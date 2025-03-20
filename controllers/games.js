const express = require('express');
const router = express.Router();
const isSignedIn = require('../middleware/is-signed-in');
const User = require('../models/user.js');
const Game = require('../models/game.js');

// GET /games - list all games
router.get('/', async (req, res) => {
    try {
      const games = await Game.find().populate('creator');
      res.render('games/index.ejs', { games });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });

// GET /games/new - show form to create new game 
router.get('/new', isSignedIn, (req, res) => {
    res.render('games/new.ejs');
});

// GET /games/new  - create a new game
router.post('/', isSignedIn, async (req, res) => {
    try {
      if (!req.session.user || !req.session.user._id) {
        throw new Error('User not authenticated');
      }
      const gameData = {
        sport: req.body.sport,
        location: req.body.location,
        time: new Date(req.body.time), 
        skillLevel: req.body.skillLevel,
        maxPlayers: parseInt(req.body.maxPlayers, 10),
        status: 'Open',
        description: req.body.description || '',
        creator: req.session.user._id, 
        participants: [req.session.user._id] // Creator auto-joins
      };
      const game = new Game(gameData);
      await game.save();
      res.redirect(`/games/${game._id}`); // Redirect to show.ejs
    } catch (error) {
      console.error(error);
      res.render('games/new.ejs', { error: 'Failed to create game. Please try again.' });
    }
  });

// GET /games/:id - Show a specific game
router.get('/:id', async (req, res) => {
    try {
      const game = await Game.findById(req.params.id)
        .populate('creator')
        .populate('participants')
        .populate('winner');
     if (!game) return res.status(404).send('Game not found');
     res.render('games/show.ejs', { game });
    } catch (error) {
      console.error(error);
      res.redirect('/games');
    }
  });


// GET /games/:id/edit - Show edit form for a game
router.get('/:id/edit', isSignedIn, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (game.creator.toString() !== req.session.user._id.toString()) {
        return res.status(403).send('You are not authorized to edit this game.');
      }
      res.render('games/edit.ejs', { game });
    } catch (error) {
      console.error(error);
      res.redirect('/games');
    }
  });


// PUT /games/:id - Update a game
router.put('/:id', isSignedIn, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (game.creator.toString() !== req.session.user._id.toString()) {
        return res.status(403).send('You are not authorized to edit this game.');
      }
      await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.redirect(`/games/${req.params.id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/games');
    }
  });

// DELETE /games/:id - Delete a game
router.delete('/:id', isSignedIn, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (game.creator.toString() !== req.session.user._id.toString()) {
        return res.status(403).send('You are not authorized to delete this game.');
      }
      await Game.findByIdAndDelete(req.params.id);
      res.redirect('/games');
    } catch (error) {
      console.error(error);
      res.redirect('/games');
    }
  });

// POST /games/:id/join - Join a game
router.post('/:id/join', isSignedIn, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      const user = await User.findById(req.session.user._id);
      if (game.participants.length < game.maxPlayers && 
          !game.participants.some(p => p.toString() === req.session.user._id.toString())) {
        game.participants.push(req.session.user._id);
        user.pastGames.push(game._id);
        if (game.participants.length === game.maxPlayers) {
          game.status = 'Full';
        }
        await game.save();
        await user.save();
      }
      res.redirect(`/games/${req.params.id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/games');
    }
});
// leave
router.post('/:id/leave', isSignedIn, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      const user = await User.findById(req.session.user._id);
      if (!game) return res.status(404).send('Game not found');
      if (game.participants.some(p => p.toString() === req.session.user._id.toString())) {
        game.participants = game.participants.filter(p => p.toString() !== req.session.user._id.toString());
        user.pastGames = user.pastGames.filter(g => g.toString() !== req.params.id.toString());
        if (game.status === 'Full' && game.participants.length < game.maxPlayers) {
          game.status = 'Open'; 
        }
        await game.save();
        await user.save();
      }
      res.redirect(`/games/${req.params.id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/games');
    }
});

// POST /games/:id/set-winner - Set the winner of a game (creator only)
router.post('/:id/set-winner', isSignedIn, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) return res.status(404).send('Game not found');

      if (game.creator.toString() !== req.session.user._id.toString()) {
        return res.status(403).send('Only the creator can set the winner.');
      }
      if (game.time > new Date()) {
        return res.status(400).send('Cannot set winner for a future game.');
      }

      const winnerId = req.body.winnerId; 
      if (!game.participants.some(p => p.toString() === winnerId)) {
        return res.status(400).send('Winner must be a participant.');
      }
      game.winner = winnerId;
      game.status = 'Completed'; 
      await game.save();
      res.redirect(`/games/${game._id}`);
    } catch (error) {
      console.error(error);
      res.redirect(`/games/${req.params.id}`);
    }
});


module.exports = router;
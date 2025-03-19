const express = require('express');
const router = express.Router();
const isSignedIn = require('../middleware/is-signed-in');
const User = require('../models/user.js');
const Game = require('../models/game.js');

// GET /games - List all games
router.get('/', async (req, res) => {
    try {
      const games = await Game.find().populate('creator');
      res.render('games/index.ejs', { games });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });

// GET /games/new - Show form to create a new game
router.get('/new', isSignedIn, (req, res) => {
    res.render('games/new.ejs');
  });

// POST /games - Create a new game
router.post('/', isSignedIn, async (req, res) => {
    try {
      const gameData = {
        ...req.body,
        creator: req.user._id,
        participants: [req.user._id], // Creator auto-joins
      };
      const game = new Game(gameData);
      await game.save();
      res.redirect('/games');
    } catch (error) {
      console.error(error);
      res.redirect('/games/new');
    }
  });

// GET /games/:id - Show a specific game
router.get('/:id', async (req, res) => {
    try {
      const game = await Game.findById(req.params.id)
        .populate('creator')
        .populate('participants');
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
      if (game.creator.toString() !== req.user._id.toString()) {
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
      if (game.creator.toString() !== req.user._id.toString()) {
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
      if (game.creator.toString() !== req.user._id.toString()) {
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
      const user = await User.findById(req.user._id);
      if (game.participants.length < game.maxPlayers && !game.participants.includes(req.user._id)) {
        game.participants.push(req.user._id);
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


module.exports = router;
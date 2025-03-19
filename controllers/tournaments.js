const express = require('express');
const router = express.Router();
const isSignedIn = require('../middleware/is-signed-in');
const User = require('../models/user.js');
const Tournament = require('../models/tournament.js')


// GET /tournaments - List all tournaments
router.get('/', async (req, res) => {
    try {
      const tournaments = await Tournament.find().populate('creator');
      res.render('tournaments/index.ejs', { tournaments });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });

// GET /tournaments/new - Show form to create a new tournament
router.get('/new', isSignedIn, (req, res) => {
    res.render('tournaments/new.ejs');
  });

// POST /tournaments - Create a new tournament
router.post('/', isSignedIn, async (req, res) => {
    try {
      const tournamentData = {
        ...req.body,
        creator: req.user._id,
        participants: [req.user._id], // Creator auto-joins
      };
      const tournament = new Tournament(tournamentData);
      await tournament.save();
      res.redirect('/tournaments');
    } catch (error) {
      console.error(error);
      res.redirect('/tournaments/new');
    }
  });


// GET /tournaments/:id - Show a specific tournament
router.get('/:id', async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id)
        .populate('creator')
        .populate('participants');
      res.render('tournaments/show.ejs', { tournament });
    } catch (error) {
      console.error(error);
      res.redirect('/tournaments');
    }
  });

// GET /tournaments/:id/edit - Show edit form for a tournament
router.get('/:id/edit', isSignedIn, async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id);
      if (tournament.creator.toString() !== req.user._id.toString()) {
        return res.status(403).send('You are not authorized to edit this tournament.');
      }
      res.render('tournaments/edit.ejs', { tournament });
    } catch (error) {
      console.error(error);
      res.redirect('/tournaments');
    }
  });

// PUT /tournaments/:id - Update a tournament
router.put('/:id', isSignedIn, async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id);
      if (tournament.creator.toString() !== req.user._id.toString()) {
        return res.status(403).send('You are not authorized to edit this tournament.');
      }
      await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.redirect(`/tournaments/${req.params.id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/tournaments');
    }
  });

// DELETE /tournaments/:id - Delete a tournament
router.delete('/:id', isSignedIn, async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id);
      if (tournament.creator.toString() !== req.user._id.toString()) {
        return res.status(403).send('You are not authorized to delete this tournament.');
      }
      await Tournament.findByIdAndDelete(req.params.id);
      res.redirect('/tournaments');
    } catch (error) {
      console.error(error);
      res.redirect('/tournaments');
    }
  });

// POST /tournaments/:id/join - Join a tournament
router.post('/:id/join', isSignedIn, async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id);
      const user = await User.findById(req.user._id);
      if (!tournament.participants.includes(req.user._id)) {
        tournament.participants.push(req.user._id);
        user.tournamentJoined.push(tournament._id);
        await tournament.save();
        await user.save();
      }
      res.redirect(`/tournaments/${req.params.id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/tournaments');
    }
  });



module.exports = router;
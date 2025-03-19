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

// GET /tournaments/new - show form to create a new tournament
router.get('/new', isSignedIn, (req, res) => {
    res.render('tournaments/new.ejs');
  });

// POST /tournaments - Create a new tournament
router.post('/', isSignedIn, async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
          throw new Error('User not authenticated');
        }
        const tournamentData = {
          name: req.body.name, 
          sport: req.body.sport,
          location: req.body.location,
          startDate: new Date(req.body.startDate),
          endDate: new Date(req.body.endDate),
          bracketType: req.body.bracketType,
          teamSize: parseInt(req.body.teamSize, 10),
          creator: req.session.user._id,
          participants: [req.session.user._id],
          status: 'Upcoming', 
          description: req.body.description || ''
        };
        const tournament = new Tournament(tournamentData);
        await tournament.save();
        res.redirect(`/tournaments/${tournament._id}`); // Redirect to show page
      } catch (error) {
        console.error(error);
        res.render('tournaments/new.ejs', { error: 'Failed to create tournament. Please try again.' });
      }
  });


// GET /tournaments/:id - Show a specific tournament
router.get('/:id', async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id)
        .populate('creator')
        .populate('participants');
      if (!tournament) return res.status(404).send('Tournament not found');
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
      if (tournament.creator.toString() !== req.session.user._id.toString()) {
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
      if (tournament.creator.toString() !== req.session.user._id.toString()) {
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
      if (tournament.creator.toString() !== req.session.user._id.toString()) {
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
      const user = await User.findById(req.session.user._id);
      if (!tournament.participants.some(p => p.toString() === req.session.user._id.toString())) {
        tournament.participants.push(req.session.user._id);
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

router.post('/:id/leave', isSignedIn, async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id);
      const user = await User.findById(req.session.user._id);
      if (!tournament) return res.status(404).send('Tournament not found');
      if (tournament.participants.some(p => p.toString() === req.session.user._id.toString())) {
        tournament.participants = tournament.participants.filter(p => p.toString() !== req.session.user._id.toString());
        user.tournamentJoined = user.tournamentJoined.filter(t => t.toString() !== req.params.id.toString());
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
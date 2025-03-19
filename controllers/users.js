const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Tournament = require('../models/tournament.js')
const Game = require('../models/game.js');
const isSignedIn = require('../middleware/is-signed-in');

// GET /profile - View current user's profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    .populate('pastGames')
    .populate('tournamentJoined');
    if (!user) throw new Error('User not found');

    const games = await Game.find({ participants: req.session.user._id }); // fetch user's current games
    const tournaments = await Tournament.find({ participants: req.session.user._id });
    res.render('users/profile.ejs', 
    { user,
      games, 
      tournaments,
      pageTitles: 'Your Profile',
      backLink: '/',
     });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// GET /profile/edit - Edit current user's profile
router.get('/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) throw new Error('User not found');
    res.render('users/edit-profile.ejs', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/profile');
  }
});



// update profile
router.put('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) throw new Error('User not found');
    user.username = req.body.username || user.username;

    await user.save();
    res.redirect('/profile');
  } catch (error) {
    console.log(error);
    res.redirect('/profile');
  }
});

// View another user's profile
router.get('/:id', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate('pastGames')
    .populate('tournamentJoined');
    if (!user) return res.status(404).send('User not found');

    const games = await Game.find({ participants: req.params.id });
    const tournaments = await Tournament.find({ participants: req.params.id });

    res.render('users/profile.ejs', { 
      user, 
      games, 
      tournaments,
      pageTitles: `${user.username}'s Profile`,
      backLink: '/profile',
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
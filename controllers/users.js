const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Tournament = require('../models/tournament.js')
const Game = require('../models/game.js');
const isSignedIn = require('../middleware/is-signed-in');

// GET /profile - View current user's profile
router.get('/', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    .populate('pastGames')
    .populate('tournamentJoined');
    if (!user) throw new Error('User not found');

    let gamesPlayed = 0; 
    let wins = 0;
    for (const game of user.pastGames){
      if (game.completed){
        gamesPlayed += 1;
        if (game.winner && game.winner.toString() === user._id.toString()){
          wins += 1; 
        }
      }
    }
    if (user.stats.gamePlayed !== gamesPlayed || user.stats.wins !== wins){
      user.stats.gamePlayed = gamesPlayed;
      user.stats.wins = wins;
      await user.save();
    }

    // only upcoming games
    const now = new Date();
    const games = await Game.find({ 
      participants: req.session.user._id, 
      completed: false, 
      time: { $gte: now } 
    }).populate('creator');
    const tournaments = await Tournament.find({ 
      participants: req.session.user._id, 
      completed: false, 
      startDate: { $gte: now } 
    }).populate('creator');


    res.render('users/profile.ejs', 
    { user,
      games, 
      tournaments,
      pageTitle: 'Your Profile',
      backLink: '/',
     });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// GET /profile/edit - Edit current user's profile
router.get('/edit', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) throw new Error('User not found');
    res.render('users/edit-profile.ejs', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/users');
  }
});


// PUT /users/edit - update current user's profile
router.put('/edit', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) throw new Error('User not found');
    user.username = req.body.username || user.username;
    user.fullName = req.body.fullName || user.fullName;
    user.location = req.body.location || user.location;
    user.sportsInterests = req.body.sportsInterests || user.sportsInterests;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    if (req.body.highlightVideo && req.body.highlightVideo.trim() !== '') { 
      user.highlightVideos = user.highlightVideos || []; 
      user.highlightVideos.push(req.body.highlightVideo.trim());
    }

    await user.save();
    res.redirect('/users');
  } catch (error) {
    console.log(error);
    res.redirect('/users/edit');
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
      pageTitle: `${user.username}'s Profile`,
      backLink: '/users',
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users');
  }
});


module.exports = router;
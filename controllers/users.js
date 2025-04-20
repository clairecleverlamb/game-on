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
    const pastGames = await Game.find({
      participants: req.session.user._id,
      completed: true,
      time: { $lt: now }
    }).populate('creator');
    const tournaments = await Tournament.find({ 
      participants: req.session.user._id, 
      completed: false, 
      startDate: { $gte: now } 
    }).populate('creator');


    res.render('users/profile.ejs', 
    { user,
      games, 
      pastGames,
      tournaments,
      pageTitle: 'Your Profile',
      backLink: '/',
      currentUserId: req.session.user._id,
     });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


// GET /users/community - View all users
router.get('/community', isSignedIn, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.session.user._id } })
      .select('username fullName profilePicture location'); 
    res.render('users/community.ejs', {
      users,
      pageTitle: 'Community',
      backLink: '/users'
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users');
  }
});

// GET /users/calendar-events - Fetch calendar events
router.get('/calendar-events', isSignedIn, async (req, res) => {
  try {
    const games = await Game.find({ participants: req.session.user._id, completed: false });
    const tournaments = await Tournament.find({ participants: req.session.user._id, completed: false });
    const events = [
      ...games.map(g => ({
        title: g.sport,
        start: g.time,
        url: `/games/${g._id}`
      })),
      ...tournaments.map(t => ({
        title: t.name,
        start: t.startDate,
        url: `/tournaments/${t._id}`
      }))
    ];
    res.json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
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
      user.highlightVideos.push({
        url:req.body.highlightVideo.trim(),
        likes:[]
      });
      console.log('Added video:', user.highlightVideos[user.highlightVideos.length - 1]);
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

    const allGames = await Game.find({ participants: req.params.id });
    const pastGames = allGames.filter(g => g.completed);
    const games = allGames.filter(g => !g.completed);
    const tournaments = await Tournament.find({ participants: req.params.id });

    res.render('users/profile.ejs', { 
      user, 
      games, 
      pastGames,
      tournaments,
      pageTitle: `${user.username}'s Profile`,
      backLink: '/users',
      currentUserId: req.session.user._id
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users');
  }
});


// Like a highlight video
router.post('/:id/like/:index', isSignedIn, async (req, res) => {
  try {
    const userToLike = await User.findById(req.params.id);
    const videoIndex = req.params.index;
    if (!userToLike || videoIndex >= userToLike.highlightVideos.length) {
      return res.redirect(`/users/${req.params.id}`);
    }
    const video = userToLike.highlightVideos[videoIndex];
    if (!video.likes.includes(req.session.user._id)) {
      video.likes.push(req.session.user._id);
      await userToLike.save();
    }
    res.redirect(`/users/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.params.id}`);
  }
});

// Unlike a highlight video
router.post('/:id/unlike/:index', isSignedIn, async (req, res) => {
  try {
    const userToUnlike = await User.findById(req.params.id);
    const videoIndex = req.params.index;
    if (!userToUnlike || videoIndex >= userToUnlike.highlightVideos.length) {
      return res.redirect(`/users/${req.params.id}`);
    }
    const video = userToUnlike.highlightVideos[videoIndex];
    video.likes = video.likes.filter(like => like.toString() !== req.session.user._id.toString());
    await userToUnlike.save();
    res.redirect(`/users/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.params.id}`);
  }
});


module.exports = router;
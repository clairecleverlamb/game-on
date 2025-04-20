const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const Tournament = require('../models/tournament');

// GET /sports/:sportName - View filtered sports content
router.get('/sports/:sportName', async (req, res) => {
  try {
    const sport = req.params.sportName;
    const games = await Game.find({ sport }).sort({ time: -1 });
    const tournaments = await Tournament.find({ sport }).sort({ startDate: -1 });

    res.render('sports/index.ejs', {
      sport,
      games,
      tournaments,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;

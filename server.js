const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const User = require('./models/user.js');
const cron = require('node-cron');
const Game = require('./models/game.js');
const Tournament = require('./models/tournament.js');

const authController = require('./controllers/auth.js');
const gamesController = require('./controllers/games.js');
const tournamentController = require('./controllers/tournaments.js');
const userController = require('./controllers/users.js'); // personal info page

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
// app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); 

app.get('/', async (req, res) => {
  try {
    const now = new Date();
    const games = await Game.find({ completed: false, time: { $gte: now } }).limit(3);
    const tournaments = await Tournament.find({ completed: false, startDate: { $gte: now } }).limit(3);
    const celebrities = await User.find().sort({ 'stats.wins': -1 }).limit(3); 
    res.render('index.ejs', { games, tournaments, celebrities });
  } catch (error) {
    console.log(error);
    res.render('index.ejs', { games: [], tournaments: [], celebrities: [] });
  }
});

app.use('/auth', authController);
app.use('/users', userController);
app.use('/games', gamesController);
app.use('/tournaments', tournamentController);


// Cron job to update completed status (runs daily at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const games = await Game.find({ completed: false });
    for (const game of games) {
      if (game.time < now) {
        game.completed = true;
        if (game.status !== 'Completed') {
          game.status = 'Completed';
        }
        await game.save();
      }
    }

    // Update Tournaments
    const tournaments = await Tournament.find({ completed: false });
    for (const tournament of tournaments) {
      if (tournament.endDate < now) { 
        tournament.completed = true;
        if (tournament.status !== 'Completed') {
          tournament.status = 'Completed';
        }
        await tournament.save();
      }
    }

    console.log('Updated completion status for games and tournaments');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

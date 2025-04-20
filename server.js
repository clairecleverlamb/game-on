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
const Game = require('./models/game.js');
const Tournament = require('./models/tournament.js');

const cron = require('node-cron');
const { updateCompletedGamesAndTournaments } = require('./utils/cron-utils');

const authController = require('./controllers/auth.js');
const gamesController = require('./controllers/games.js');
const tournamentController = require('./controllers/tournaments.js');
const userController = require('./controllers/users.js'); // personal info page

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false })); // simple key value pair 
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


// Run the cron job every day at midnight
cron.schedule('0 0 * * *', updateCompletedGamesAndTournaments);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

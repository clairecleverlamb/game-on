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
const passport = require('./config/passport-config.js');

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

app.use(passport.initialize());
app.use(passport.session());
app.use(passUserToView); 


// regular sign in with username + password
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/users');
  } else {
    res.render('index.ejs');
  }
});

app.use('/auth', authController);
app.use('/users', userController);
app.use('/games', gamesController);
app.use('/tournaments', tournamentController);


// app.get('/profile', isSignedIn, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.user._id)
//       .populate('pastGames')
//       .populate('tournamentJoined');
//     if (!user) throw new Error('User not found');
//     res.render('users/profile.ejs', { user });
//   } catch (error) {
//     console.log(error);
//     res.render('index.ejs');
//   }
// });


// // other's profile
// app.get('/users/:userId', isSignedIn, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) return res.status(404).send('User not found');
//     res.render('users/profile.ejs', { user });
//   } catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// });


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

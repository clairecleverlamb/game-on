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

const authController = require('./controllers/auth.js');
const gamesController = require('./controllers/games.js');
const torunamentController = require('./controllers/tournaments.js');
const homeController = require('./controllers/users.js'); // personal info page

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); 

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id/homes}`);
  } else {
    // homepage for users who are not signed in
    res.render('index.ejs');
  }
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/homes', homeController);
// app.use('/users/:userId/games', gamesController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

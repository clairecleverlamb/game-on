const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const isSignedIn = require('../middleware/is-signed-in');


router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) throw new Error('User not found');
    res.render('users/profile.ejs', { user });
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
    // Add other fields to update as needed
    await user.save();
    res.redirect('/profile');
  } catch (error) {
    console.log(error);
    res.redirect('/profile');
  }
});

// see other's profile
router.get('/:id', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('users/profile.ejs', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
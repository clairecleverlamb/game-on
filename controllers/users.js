const express = require('express');
const router = express.Router();
const User = require('../models/user.js');


const isAuthenticated = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/sign-in');
  next();
};

router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('users/profile.ejs', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user._id.toString() !== req.session.user._id) {
      return res.status(403).send('Unauthorized');
    }
    user.username = req.body.username || user.username;
    await user.save();
    res.redirect(`/users/${user._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



module.exports = router;
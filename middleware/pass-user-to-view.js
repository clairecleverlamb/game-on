const User = require('../models/user.js');

const passUserToView = async (req, res, next) => {
  if (req.session.user && req.session.user._id) {
    try {
      const user = await User.findById(req.session.user._id)
        .select('username fullName profilePicture stats pastGames tournamentJoined') 
        .populate('tournamentJoined'); 
      res.locals.user = user || null; 
    } catch (error) {
      console.log('Error fetching user in middleware:', error);
      res.locals.user = null; 
    }
  } else {
    res.locals.user = null; 
  }
  next();
};

module.exports = passUserToView;
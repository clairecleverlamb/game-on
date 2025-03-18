const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String, 
    unique: true,
    sparse: true,
  },
  fullName: {
    type: String,
  }, 
  profilePicture: {
    type: String,
  }, 
  location: {
    type: String,
  }, 
  sportsInterests: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advance'],
  }, 
  stats: {
    gamePlayed: {
      type: Number, 
      default: 0,
    },
    wins: {
      type: Number,
      default: 0, 
    },
  },
  pastGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  }],
  tournamentJoined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }],
  highlightVideos: [{
    type: String,
  }],
}, {
  timestamps: true, 
});

const User = mongoose.model('User', userSchema);

module.exports = User;

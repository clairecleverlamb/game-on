const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  sport: {
    type: String,
    required: true, 
  },
  location: {
    type: String,
    required: true, 
  },
  time: {
    type: Date,
    required: true, 
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
  maxPlayers: {
    type: Number,
    required: true, 
  },
  status: {
    type: String,
    enum: ['Open', 'Full', 'Cancelled'],
    default: 'Open', 
  },
  description: {
    type: String, 
  },
}, {
  timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
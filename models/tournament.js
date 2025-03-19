const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sport: {
        type: String, 
        required: true,
    }, 
    location: {
        type: String, 
        required: true, 
    }, 
    startDate: {
        type: Date, 
        required: true,
    }, 
    endDate: {
        type: Date, 
        required: true, 
    }, 
    bracketType: {
        type: String, 
        enum: ['Single Elimination', 'Round Robin', 'Group Stage'],
    },
    teamSize: {
        type: Number,
        required: true,
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
    status: {
        type: String, 
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming',
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean, 
        default: false
    },
}, {
    timestamps: true,
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
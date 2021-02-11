// Requiring Libraries
const mongoose = require('mongoose')

// Declaring the Project schema
const projectSchema = new mongoose.Schema({

    // Project Name
    name: {
        type: String,
        required: true
    },

    // Project Duration
    duration: {
        type: Number,
        required: false
    },

    // Project Picture
    picture: {
        type: String,
        required: false
    },

    // Project Creation Date
    creation_date: {
        type: Date,
        required: false
    },

    // Project List of Tracks
    tracks: {
        type: [track],
        rquired: false
    }
})

// Export the user model
module.exports = mongoose.model('Project', projectSchema)
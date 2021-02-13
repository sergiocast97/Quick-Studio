// Requiring Libraries
const mongoose = require('mongoose')

// Project Images Location
const recordingBasePath = 'uploads/recording'

// Declaring the Recording schema
const recordingSchema = new mongoose.Schema({

    // Point where the recording starts
    start_second: {
        type: Number,
        required: true
    },

    // Recording audio
    audio: {
        type: String,
        required: false
    },

})

// Export the user model
module.exports = mongoose.model('Recording', recordingSchema)
module.exports.recordingBasePath = recordingBasePath
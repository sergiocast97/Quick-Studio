// Requiring Libraries
const mongoose = require('mongoose')

// Declaring the Track schema
const trackSchema = new mongoose.Schema({

    // Track Name
    name: {
        type: String,
        required: true
    },

    // Track colour
    colour: {
        type: String,
        required: false
    },

    // Recordings
    recordings: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'Recording'
    }
})

// Export the user model
module.exports = mongoose.model('Track', trackSchema)
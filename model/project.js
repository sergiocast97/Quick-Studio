// Requiring Libraries
const mongoose = require('mongoose')

// Project Images Location
const projectImageBasePath = 'uploads/projectImage'
// Project Recording Location
const recordingBasePath = 'uploads/recording'

// Declaring the Recording schema
const recordingSchema = new mongoose.Schema({

    // Disable IDs
    id: false,
    _id: false,

    // Recording ID
    recording_id: {
        type: String,
        required: true
    },

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

// Declaring the Track schema
const trackSchema = new mongoose.Schema({

    // Disable IDs
    id: false,
    _id: false,

    // Track Id
    track_id: {
        type: String,
        required: true
    },

    // Track Name
    track_name: {
        type: String,
        required: true
    },

    // Track colour
    track_colour: {
        type: String,
        required: false
    },

    // Recordings
    recordings: [recordingSchema]

})

// Declaring the Project schema
const projectSchema = new mongoose.Schema({

    // Project ID
    project_id: {
        type: String,
        required: true
    },

    // Project Name
    name: {
        type: String,
        required: true
    },

    // Project Picture
    picture: {
        type: String,
        required: false
    },


    // Project Creation Date
    creation_date: {
        type: Date,
        required: true,
        default: Date.now
    },

    // Project Last Modified Date
    last_modified_date: {
        type: Date,
        required: false,
        default: Date.now,
    },

    // List of Collaborators
    collaborators: {
        type: [ String ],
        required: false
    },

    // Project List of Tracks
    tracks: [trackSchema]
})

// Export the user model
module.exports = mongoose.model('Project', projectSchema)
module.exports.projectImageBasePath = projectImageBasePath
module.exports.recordingBasePath = recordingBasePath
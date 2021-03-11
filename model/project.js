// Requiring Libraries
const mongoose = require('mongoose')

// Project Images Location
const projectImageBasePath = 'uploads/projectImage'

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
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'User'
    },

    // Project List of Tracks
    tracks: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'Track'
    }

})

// Export the user model
module.exports = mongoose.model('Project', projectSchema)
module.exports.projectImageBasePath = projectImageBasePath
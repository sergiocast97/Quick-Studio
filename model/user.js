// Requiring Libraries
const mongoose = require('mongoose')

// Declaring the user schema
const userSchema = new mongoose.Schema({

    // Username
    username: {
        type: String,
        required: true
    },

    // First Name
    name: {
        type: String,
        required: true
    },

    // Last Name
    surname: {
        type: String,
        required: true
    },

    // Email
    email: {
        type: String,
        required: true
    },

    // Password
    password: {
        type: String,
        required: true
    },

    // Location
    location: {
        type: String,
        required: false
    },

    // List of bandmates
    bandmates: {
        type: [String],
        required: false
    }
})

// Export the user model
module.exports = mongoose.model('User', userSchema)
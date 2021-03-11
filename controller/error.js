// Necessary libraries
const express = require('express')
const error = express()
const createError = require('http-errors')

// 404 Error Handler
error.use(function(req, res, next) {
    next(createError(404))
})

// Error handler
error.use(function(err, req, res, next) {

    // Only show error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // Render the error
    res.status(err.status || 500)
    res.render('pages/error', { error: err, title: err.status })
})

// Export the router
module.exports = error;
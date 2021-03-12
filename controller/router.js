/* Loading Resources */

// Load the ENV file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Requiring necessary modules
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const initializePassport = require('./authenticator')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('../model/user')
const Project = require('../model/project')

/* Initializing the modules */

// Initializing Passport
initializePassport(
    passport,
    email => User.findOne({ email: email }),
    id => User.findById(id),
)

// Access form inside the req variable
router.use(express.urlencoded({ extended: false }))

// Using flash
router.use(flash())

// Using sessions
router.use(session({
    secret: process.env.SESSION_SECRET,
    // Resave our sesion if nothing has changed?
    resave: false,
    // Save an empty value if there is no value?
    saveUninitialized: false
}))

// Initialising passport and session
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

// Initialising multer
const uploadPath = path.join('public', User.profilePictureBasePath)
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// Make sure the user is authenticated
function checkAuthenticated(req, res, next) {
    // If the user is authenticated, go to the page
    if (req.isAuthenticated()) {
        return next()
    }
    // If the user is not authenticated, go to Login
    res.redirect('/login')
}

// Make sure the user is not authenticated
function checkNotAuthenticated(req, res, next) {
    // If the user is authenticated, go to main page
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    // If the user is not authenticated, go to the page
    next()
}

// Function to generate random string
function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/* Handling routes */

/* Show Tes Page */
router.get('/test', function (req, res) {
    res.render('pages/test', { title: 'Test Page', name: "Test Area" })
})

/* Show Login Page */
router.get('/login', checkNotAuthenticated, async (req, res) => {
    res.render('pages/login', { title: 'Sign In' })
})

/* Log in the user */
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

/* Show the Register Page */
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('pages/register', { title: 'Register', user: new User() })
})

/* Register the User */
router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {

        // Generate a hashed password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // Create a new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            password: hashedPassword
        })
        console.log(JSON.stringify(user))

        // Save the User
        const newUser = await user.save()

        // Redirect to Login
        res.redirect('/login')

    } catch {

        // If error, redirect to register with populated fields
        res.render('/register', {
            user: user,
            errorMessage: 'Error creating user'
        })
        console.log("\nThere has been an issue\n")
    }
})

/* Show the Projects page */
router.get('/', checkAuthenticated, async (req, res) => {
    try {

        // Get all of the users
        const project_list = await Project.find({})
        //const project_list = ["Breakdown test 01", "Test 01", "Test 02", "Test 03"]
        res.render('pages/index', { title: "Projects", user: await req.user, project_list: project_list })
    
    } catch {

        res.redirect('/')
    }
})

/* Create a new Project */
router.post('/new', checkAuthenticated, async (req, res) => {
    try {

        // Create a new empty project
        const project = new Project({
            project_id: randomString(24),
            name: "New Project",
        })
        console.log(JSON.stringify(project))
        
        // Save the Project
        const newProject = await project.save()
        
        // Redirect to the newly created project
        console.log("Project created")
        res.redirect('/project/' + project.project_id )

    } catch {

        console.log("The project could not be saved")
        res.redirect('/')
    }
})

/* Show an Individual Project */
router.get('/project/:project_id', checkAuthenticated, async (req, res) => {

    // Get the project
    console.log("Going to: " + req.params.project_id )
    const project = await Project.findOne({ project_id: req.params.project_id })

    // Render the project page
    res.render('pages/project', { title: project.name, user: await req.user, project: project })
})

/* Edit the Project (TODO) */
router.put('/project/:project_id', checkAuthenticated, async (req, res) => {
    try {

        // Find the project on the database
        console.log(req.params.project_id)
        let project = await Project.findOne({ project_id: req.params.project_id })
        console.log(JSON.stringify(project))
        
        // Update the details if they've been provided
        if (req.body.name) project.name = req.body.name
        project.last_modified_date = Date.now()

        // Save the project details
        const savedProject = await project.save()
        console.log("Project updated")

        // Redirect to the settings page
        res.redirect('/project/' + project.project_id)

    } catch {

        // If anything goes wrong, go back to the Settings page
        console.log("Project could not be updated")
        res.redirect('/project/' + req.params.project_id)
    }
})

/* Update via AJAX */
router.post('/project/update/:project_id', async function(req, res) {
    try {

        // Get the New Name
        let name = req.body.name;
        console.log("New Name: " + name)

        // Get the Project
        let project = await Project.findOne({ project_id: req.params.project_id })
        console.log(JSON.stringify(project))

        // Update the details if they've been provided
        if (req.body.name) project.name = req.body.name
        project.last_modified_date = Date.now()

        // Save the project details
        const savedProject = await project.save()
        console.log("Project updated")

        // Redirect to the settings page
        res.send({ name: name, message: "Name updated Successfully"});

    } catch {

        // If anything goes wrong, go back to the Settings page
        console.log("Project could not be updated")
        //res.redirect('/project/' + req.params.project_id)
    }
});

/* Delete a Project */
router.delete('/project/:project_id', async (req, res) => {

    try {
        // Find the project on the database
        let project = await Project.findOne({ project_id: req.params.project_id })

        // Remove user
        removedProject = await project.remove()
        console.log("Project removed")

        // Redirect to Main Page
        res.redirect('/')

    } catch {

        // Redirect to Main Page
        res.redirect('/')
    }
})

/* Show the Settings Page */
router.get('/settings', checkAuthenticated, async (req, res) => {
    try {
        // Show the Settings page
        res.render('pages/settings', { title: "Settings", user: await req.user })
    } catch {
        res.redirect('/')
    }
})

/* Update User Details */
router.put('/settings', checkAuthenticated, async (req, res) => {
    // Declare an empty user
    let user
    try {
        // Find the logged user
        logged_user = await req.user
        user = await User.findOne({ username: logged_user.username })
        // Update the details if they've been provided
        if (req.body.name) user.name = req.body.name
        if (req.body.surname) user.surname = req.body.surname
        if (req.body.email) user.email = req.body.email
        if (req.body.username) user.username = req.body.username
        if (req.body.location) user.location = req.body.location
        if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10)
        // Save the user details
        await user.save()
        console.log("User updated")
        // Redirect to the settings page
        res.redirect('/settings')
    } catch {
        // If anything goes wrong, go back to the Settings page
        console.log("User could not be updated")
        res.redirect('/settings')
    }
})

/* Delete a User */
router.delete('/settings', async (req, res) => {
    // Declare an empty user
    let user
    try {
        // Find the logged user
        logged_user = await req.user
        user = await User.findOne({ username: logged_user.username })

        // Remove user
        await user.remove()
        console.log("User removed")
        
        // Logout
        req.logOut()

        // Redirect to login
        res.redirect('/')
    } catch {
        res.redirect('/settings')
    }
})

/* Show the Bandmates Section */
router.get('/bandmates', checkAuthenticated, async (req, res) => {
    try {
        // Get all of the users
        const bandmate_list = await User.find({})
        // Display the user page
        res.render('pages/bandmates', { title: "Bandmates", user: await req.user, bandmate_list: bandmate_list })
    } catch {
        res.redirect('/')
    }
})

/* Logout the User */
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

// Export the Router
module.exports = router
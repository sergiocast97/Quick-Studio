/* Loading Resources */

// Load the ENV file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Requiring necessary modules
const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./authenticator')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

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

// Initializing passport and session
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

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


/* Handling routes */

// Test
router.get('/test', function (req, res) {
    res.render('pages/test', { title: 'Test Page', name: "Test Area" })
})

// Login

router.get('/login', checkNotAuthenticated, async (req, res) => {
    res.render('pages/login', { title: 'Sign In' })
})
.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// Register

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('pages/register', { title: 'Register', user: new User() })
})
.post('/register', checkNotAuthenticated, async (req, res) => {
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

// Main Page

router.get('/', checkAuthenticated, async (req, res) => {
    try {
        // Passing the logged user object
        logged_user = await req.user
        user_name = logged_user.name + " " + logged_user.surname
        let project_list = ["Breakdown test 01", "Test 01", "Test 02", "Test 03"]
        res.render('pages/index', { title: "Projects", name: user_name, project_list: project_list })
    } catch {

    }
})

router.get('/settings', checkAuthenticated, async (req, res) => {
    try {
        // Passing the logged user object
        logged_user = await req.user
        user_name = logged_user.name + " " + logged_user.surname

        res.render('pages/settings', { title: "Settings", name: user_name })
    } catch {
        res.redirect('/')
    }
})

router.get('/bandmates', checkAuthenticated, async (req, res) => {
    try {
        // Passing the logged user object
        logged_user = await req.user
        user_name = logged_user.name + " " + logged_user.surname

        // Get all of the users
        const bandmate_list = await User.find({})
        //const bandmate_list = ["Cristiana", "Conrado", "Nate", "Tobin", "Masha"]
        
        // Display the user page
        res.render('pages/bandmates', { title: "Bandmates", name: user_name, bandmate_list: bandmate_list })
    } catch {
        res.redirect('/')
    }
})

// Logout

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

module.exports = router
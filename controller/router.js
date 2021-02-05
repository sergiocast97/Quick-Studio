/* Loading Resources */

// Load the ENV file
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Using a temporary DB
const users = []

// Requiring necessary modules
const express = require('express')
const router = express.Router()
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
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
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
  res.render('pages/test', { title: 'Test Page' })
})

// Login

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('pages/login', { title: 'Sign In' })
})
.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// Register

router.get('/register', checkNotAuthenticated, (req, res) => {
res.render('pages/register', { title: 'Register' })
})
.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
      // Try to generate a hashed password
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      // Create a new user
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      console.log("\nUser created\n")
      // Redirect the user to the login page
      res.redirect('/login')
  } catch {
      console.log("\nThere has been an issue\n")
      res.redirect('/register')
  }
})

// Main Page

router.get('/', checkAuthenticated, (req, res) => {
  res.render('pages/index', { title: "Quick Studio", name: req.user.name })
})

// Logout

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

module.exports = router
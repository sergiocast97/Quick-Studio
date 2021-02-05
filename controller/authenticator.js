const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// Initializing the passport functionality
function initialize(passport, getUserByEmail, getUserById){

    // Function to authenticate the user
    const authenticateUser = async (email, password, done) => {
        
        // Find the email in the database
        const user = getUserByEmail(email)
        
        // If no email was found, 
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        // Attempt to authenticate the user
        try {
            console.log('Authenticating user\n')
            if (await bcrypt.compare(password, user.password)) {
                // Return the user object (Authenticated)
                console.log('User Authenticated\n')
                return done(null, user);
            } else {
                // Incorrect Password
                console.log('User could not be authenticated\n')
                return done(null, false, { message: 'Incorrect Password' })
            }
        // Something bad happened
        } catch (e) {
            console.log('\nSomething happened with the authentication\n')
            return done(e)
        }
    }

    // Use local authentication on the email
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    
    // Serialize the user
    passport.serializeUser((user, done) => done(null, user.id))
    
    // Deserialize the user
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize;
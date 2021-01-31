var express = require('express');
var router = express.Router();

// Show the Homepage
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

// Show the Login Page
router.get('/login', function (req, res) {
  res.render('pages/login', { title: 'Login' });
})

// Show the Register Page
router.get('/register', function (req, res) {
  res.render('pages/register', { title: 'Register' });
})

// Show the Test Page
router.get('/test', function (req, res) {
  res.render('pages/test', { title: 'Test Page' });
})


/* Log in the user */
router.post('/login', function(req, res){

  authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});

/**
 * Examples of Routes
 */

// Get Request (e.g Get a page)
router.get('/', function (req, res) {
  res.send('Hello World!')
})

// Post Request (Submit data)
router.post('/', function (req, res) {
  res.send('Got a POST request')
})

// Put request (Replace Data)
router.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
})

// Delete Request (Removes data)
router.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
})

module.exports = router;

// Libraries
if (process.env.NODE_ENV !== 'production') { require('dotenv') }
const port = (process.env.PORT || '3000');
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

// Controller
const indexRouter = require('./controller/router')
const errorRouter = require('./controller/error')
app.use(methodOverride('_method'))

// View
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

// Model
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

// Start up the routers
app.use('/', indexRouter)
app.use('/', errorRouter)

// Start up the app
app.listen(port, () =>{ console.log(`\nApp listening at http://localhost:${port}\n`) });
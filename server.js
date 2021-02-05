// Libraries
if (process.env.NODE_ENV !== 'production') { require('dotenv') }
const port = (process.env.PORT || '3000');
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

// Controller
const indexRouter = require('./controller/router')
const errorRouter = require('./controller/error')

// View
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout')
app.use(expressLayouts)
app.use(express.static('public'))

// Model
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

// Starting up
app.use('/', indexRouter)
app.use('/', errorRouter)
app.listen(port, () =>{
    console.log(`\nApp listening at http://localhost:${port}\n`)
});
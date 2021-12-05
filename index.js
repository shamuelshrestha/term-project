const express = require('express')
const path = require('path')
const hbs = require('hbs')
const {db} = require('./connection')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')
require('./config/passport')(passport)


const app = express()

var options = {
	host: process.env.HOST,
	port: 3306,
	user: process.env.USER,
	password: process.env.PASS,
	database: process.env.DATABASE
}

var sessionStore = new MySQLStore(options)

// express session
app.use(session({
    secret: 'my-term-project',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 24 * 60000}
}))

// Passport setup
app.use(passport.initialize())
app.use(passport.session())

// Express body parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Handlebars setup
app.set('view engine', 'hbs')

// Public/static directory setup
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))

// setting partials 
hbs.registerPartials(__dirname + '/views/partials')

// routes handlers
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})
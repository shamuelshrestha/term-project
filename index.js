const express = require('express')
const hbs = require('hbs')

const app = express()

// Handlebars setup
app.set('view engine', 'hbs')

// setting partials 
hbs.registerPartials(__dirname + '/views/partials')

// routes handlers
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})
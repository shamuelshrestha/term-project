const express = require('express')
const path = require('path')

const app = express()

// Handlebars setup
app.set('view engine', 'hbs')


// routes handlers
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})
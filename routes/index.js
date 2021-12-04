const router = require('express').Router()

router.route('/').get((req, res) => {
    res.send('Hello World, I am Shamuel Shrestha.')
})

module.exports = router
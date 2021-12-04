const router = require('express').Router()

router.route('/').get((req, res) => {
    res.render('test.hbs', {message: 'Hello world, this is shamuel shrestha.'})
})

module.exports = router
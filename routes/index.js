const router = require('express').Router()

// Homepage route
router.route('/').get((req, res) => {
    res.render('login.hbs', {title: 'Home', })
})

// Login routes
router.route('/login').get((req, res) => {
    res.render('login.hbs', {title: 'Login', })
})

// registration routes
router.route('/register').get((req, res) => {
    res.render('register.hbs', {title: 'Registration', })
})

// Post routes
router.route('/post').get((req, res) => {
    res.render('post.hbs', {title: 'Post', })
})

module.exports = router
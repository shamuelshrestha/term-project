const router = require('express').Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const {User, Post} = require('../models/Models') 
const {Op} = require('sequelize')
const{ensureAuthenticated, forwardAuthenticated} = require("../config/auth")

// Homepage route
router.route('/').get((req, res) => {
    if(req.isAuthenticated()){
        console.log(req.user)
        return res.render('index.hbs', {title: 'Home', auth: true, authuser: req.user})
    }
    res.render('index.hbs', {title: 'Home', auth: false})
})

// Login routes
router.route('/login').get(forwardAuthenticated, (req, res) => {
    res.render('login.hbs', {title: 'Login', auth:false })
})

// Login post
router.route('/login').post((req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(!user){
            var data = {
                title: 'failure'
            }
            res.send(data)
        }else{
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if(err) console.log(err)
                if(isMatch) {
                    req.logIn(user, (err) => {
                        var data = {
                            title: 'success',
                        }
                        res.json(data)
                    })
                }else {
                    var data = {
                        title: 'password',
                    }
                    res.json(data)
                }
            })
        }
    })(req, res, next)
})

// Logout
router.route('/logout').get((req, res) => {
    req.logout()
    req.session.destroy(function(err) {
        if(err) {console.log(err)}
        res.redirect('/login')
    })
})


// registration routes
router.route('/register').get(forwardAuthenticated, (req, res) => {
    res.render('register.hbs', {title: 'Registration', auth: false })
})

router.route('/register').post((req, res) => {
    const {username, email, password} = req.body
    // console.log(req.body)
    User.findOne({where: {  [Op.or]: [{username}, {email}] }}).then(user => {
        if(user){
            if(user.username === username){
                var data = {
                    title: 'username'
                }
                return res.json(data)
            }
            if(user.email === email){
                var data = {
                    title: 'email'
                }
                return res.json(data)
            }
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err){
                    console.log(err)
                    var data = {
                        title: 'error'
                    }
                    return res.json(data)
                }
                User.create({username, email, password: hash}).then(newuser => {
                    var data = {
                        title: 'success'
                    }
                    return res.json(data)
                }).catch(err => {console.error(err)})
            })
        })
    }).catch(err => {
        console.log(err)
        var data = {
            title: 'error'
        }
        return res.json(data)
    })
})


// Post routes
router.route('/post').get((req, res) => {
    res.render('post.hbs', {title: 'Post', auth: true, authuser: req.user })
})

module.exports = router
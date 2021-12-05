const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {User, Post} = require('../models/Models') 
const {Op} = require('sequelize')

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
    res.render('post.hbs', {title: 'Post', })
})

module.exports = router
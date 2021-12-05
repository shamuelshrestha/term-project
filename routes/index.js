const router = require('express').Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const multer = require('multer')

const {User, Post} = require('../models/Models') 
const {Op} = require('sequelize')
const{ensureAuthenticated, forwardAuthenticated} = require("../config/auth")


// Multer Congig
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads')
    },
    filename: (req, file, cb) =>{
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
})


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
router.route('/post').get(ensureAuthenticated, (req, res) => {
    res.render('post.hbs', {title: 'Post', auth: true, authuser: req.user })
})

router.route('/post').post(upload.single('postImage'), (req, res) => {
    const {title, description} = req.body
    if(!req.file){
        var data = {
            title: 'no image'
        }
        return res.json(data)
    }
    if(title === ''){
        var data = {
            title: 'no title'
        }
        return res.json(data)
    }
    Post.findOne({where: {title: title}}).then(post => {
        if(post){
            var data = {
                title: 'exists'
            }
            return res.json(data)
        }

        Post.create({title, description, user: req.user.id, image: '/'+req.file.path }).then(newpost => {
            var data = {
                title: 'success'
            }
            return res.json(data)
        })

    }).catch(err => {
        console.error(err)
        var data = {
            title: 'error'
        }
        return res.json(data)
    })
})

// Single post page 
router.route('/:id/view').get( (req, res) => {
    Post.findOne({where: {id: req.params.id}}).then(post => {
        if(!post){
            return res.status(200).send('Invalid url')
        }
        console.log(post.user)
        User.findOne({where: {id: post.user}}).then(user => {
            console.log(user)
            if(req.isAuthenticated()){
                return res.render('postInner.hbs', {title: 'Single Post', auth: true, authuser: req.user, user, post })
            }
            return res.render('postInner.hbs', {title: 'Single Post', auth: false, user, post })
        })
    }).catch(err => {console.error(err)})
    // res.render('post.hbs', {title: 'Post', auth: true, authuser: req.user })
})


// Post a new comment on a post
router.route('/:id/comment').post(ensureAuthenticated, (req, res) => {
    const {comment} = req.body
    Post.findOne({where: {id: req.params.id}}).then(post => {
        console.log(post)
        User.findOne({where: {id: post.user}}).then(user => {
            var obj = {
                username: user.username,
                comment
            }
            var arr = [obj].concat(post.comments)
            // arr.push(obj)
            // console.log(arr)
            Post.update({comments: arr}, {where: {id: req.params.id}}).then(update => {
                console.log(update)
                var data = {
                    title: 'success'
                }
                return res.status(200).send(data)
            })
        })
        
    }).catch(err =>{
        console.log(err)
        var data = {
            title: 'error'
        }
        return res.status(200).send(data)
    })
})

module.exports = router
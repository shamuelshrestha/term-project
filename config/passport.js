const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const {User} = require('../models/Models')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
            // Match user
            User.findAll({where:{username: username}}).then(user => {
                if(!user[0]){
                    done(null, false)
                }else{
                    // console.log('inside business')
                    bcrypt.compare(password, user[0].dataValues.password, (err, isMatch) => {
                        if(err) console.log(err)
                        if(isMatch) {
                            return done(null, user[0].dataValues.id)
                        }else {
                            var err = 'password'
                            done(err)
                        }
                    })
                }
            }).catch(err => {
                done(err)
            })
        })
    )

    passport.serializeUser(function(id, done){
        done(null, id)
    })
    passport.deserializeUser(function(id, done){
        User.findOne({where: {id: id}}).then(user => {
                console.log("user desearalize")
                done(null, user)
        } ).catch(err => {done(err)})
    })
}



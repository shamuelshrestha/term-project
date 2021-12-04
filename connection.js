require('dotenv').config()

// Connection using sequelize 
const Sequelize = require('sequelize')

const db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASS, {
    host: process.env.HOST,
    dialect: 'mysql'
})

db.authenticate().then(() => console.log('Connected to DB')).catch(err => console.log(err))

module.exports = db
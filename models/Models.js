const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
const db = require('../connection')

// User db model
const User = db.define('user', {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    username: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
})

// Post db model
const Post = db.define('post', {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user: {
        type: Sequelize.UUID,
        allowNull: false
    }
})

// db.sync({alter:true})


module.exports = {User, Post}

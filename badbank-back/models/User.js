const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    balance: {
        type: Number,
        default: 100
    },

    transactionHistory: [{ type: String, amount: Number }], 

    roles: [{
        type: String,
        default: "BBuser"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)
const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const standUps = new Schema({

    standUp: {
        type: Object,
        required: [true, 'yesterday', 'today', 'problems']
    },

    date:{
        type: String,
        required: true
    },


})
module.exports = mongoose.model('standUps', standUps)

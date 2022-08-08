const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const name = new Schema({

    id: {
        type: Number,
        required: true
    },

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },

    standUps: {
        ref: 'standUp',
        type: Schema.Types.ObjectId
    }
});



const TgBots= mongoose.model('TgBots', name)

module.exports = TgBots
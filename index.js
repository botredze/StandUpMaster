const TelegramApi = require('node-telegram-bot-api')

const mongoose = require("mongoose");
const User = require('./models/user')
const StandUp = require('./models/standUp')
const token = '5525401139:AAHfXICnJmYxKq1NELj4L3TRJ3FK-m8r89Q'
const bot = new TelegramApi(token, {polling: true})
const db = 'mongodb+srv://botedze:pass321@cluster0.xf3b3vn.mongodb.net/node-api?retryWrites=true&w=majority'

mongoose
    .connect(db)
    .then((res)=> {
        console.log('Connected to DB')
    }).catch((error)=>{
    console.log(error)
})


const saveme = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Да', callback_data: 'true',}]

        ]
    })
}

bot.setMyCommands([
    {command: '/start', description: 'Начало работы'},
    {command: '/save_me', description: 'Сохранение пользователя'},
    {command: '/list_stand_ups', description: 'Мои стендапы'},
    {command: '/create_stand_up', description: 'Добовление стендапа'}

])


bot.on('message', msg=> {
    const text = msg.text;
    const chatId = msg.chat.id

    bot.sendMessage(chatId, `Ваще сообщение ${text}`)

    if(text === "/start"){
        bot.sendMessage(chatId, `Добро пожаловать`)

    }
    if(text === "/save_me") {
        bot.sendMessage(chatId, `Вы пользователь ${msg.from.last_name} ${msg.from.first_name} ?`, saveme)
    }
    if(text === "/list_stand_ups") {
        bot.sendMessage(chatId, 'Ваши стендапы')
        StandUp
            .findById(msg.username.id)
            .then((listStandUp)=> {
                bot.sendMessage(chatId, `Ваши стендапы ${listStandUp}`)
            }).catch((err) => {
            console.log(err)
            bot.sendMessage(chatId, `Ваши стендапы не найдены ${err}`)
        })

    }

    if(text === "/create_stand_up"){
       bot.sendMessage(chatId, 'Создание нового стендапа')

        bot.on('update', msg => {
            const newStandUps = {
                standUp: msg.text
            }
            console.log(newStandUps.standUp)
            if (newStandUps.standUp.indexOf('yesterday') !== -1) {

                const tdIndex = newStandUps.standUp.indexOf('today')
                const problIndex = newStandUps.standUp.indexOf('problems')
                const today = newStandUps.standUp.substring(tdIndex)
                const yesterday = newStandUps.standUp.substring(0, tdIndex)
                const problems = newStandUps.standUp.substring(problIndex)
                const newStandUp = {today, yesterday, problems}

                const keyWords = ['yesterday', 'today', 'problems']

                if (newStandUp.prototype.indexOf(keyWords) !== 1) {
                    const standUp = new StandUp({newStandUp})
                    standUp
                        .save()
                        .then((result) => {
                            bot.sendMessage(chatId, 'Успешно! ')
                        })
                        .catch((err) => {
                            console.log(err)
                            bot.sendMessage(chatId, `Ошибка ${err}`)
                        })
                    console.log(standUp)
                    return bot.on('polling_error', console.log)
                }
            }
        })
    }
})

bot.on ('callback_query', msg=>{
    const data = msg.data
    const chatId = msg.message.chat.id

    const first_name = msg.from.first_name
    const last_name = msg.from.last_name
    const username = msg.from.username
    const id = msg.username.id

    if(data === 'true'){
        const user = new User({id,first_name, last_name, username})
            user.save()
                .then((result) => {
                bot.sendMessage(chatId, `Пользователь ${msg.from.first_name} ${msg.from.last_name} сохранен !`)
            })
                .catch((error) => {
                console.log(error)
                bot.sendMessage(chatId, `Произошла ошибка ${error}`)
            })
    }
})



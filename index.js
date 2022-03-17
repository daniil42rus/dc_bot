const command = require('nodemon/lib/config/command');
const TelegramBot = require('node-telegram-bot-api');
const { Telegraf, Markup, Scenes, session } = require('telegraf')
const { Keyboard } = require('telegram-keyboard');
require('dotenv').config();
const text = require('./const');
const bot = new Telegraf(process.env.BOT_TOKEN)
const botMessage = new TelegramBot(process.env.BOT_TOKEN);

const applicationScene = require("./scenes/application.js")

const stage = new Scenes.Stage([applicationScene])
bot.use(session())
bot.use(stage.middleware())

bot.start(async (ctx) => {

    // console.log(ctx.chat.id)

    if (ctx.chat.id !== process.env.applicationChat) {
        ctx.scene.enter('applicationWizard') 
    }
})

bot.on('message', (ctx) => { 

    if (ctx.chat.id !== process.env.applicationChat) {
        ctx.scene.enter('applicationWizard') 
    }
})




bot.launch()







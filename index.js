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



// bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name} ${text.command}`))


let application = [
    'Диагностический центр',
    '1 поликлиника',
    '2 поликлиника',
    '3 поликлиника',
    '4 поликлиника',
    '10 поликлиника',
    'Женская консультация',
    'ТП',
    'ЦМР',
]

for (i of application) {
    bot.hears(i, async (ctx) => { 
        console.log(ctx.message.text) 
    ctx.scene.enter('applicationWizard')
    })
}

bot.command('new_application', async (ctx) => {
    // bot.start( async (ctx) => {
    try {

        // console.log(ctx.message.text) 
        // ctx.scene.enter('applicationWizard')
        await ctx.reply("Какое подразделение", Markup.keyboard([
            ['Диагностический центр'],
            ['1 поликлиника', '2 поликлиника'],
            ['3 поликлиника', '4 поликлиника'],
            ['10 поликлиника', 'Женская консультация'],
            ['ТП', 'ЦМР'],
        ]).oneTime().resize())
    } catch (e) {
        console.log(e)
    }
})

bot.on('message', (ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}! Выбери нужную команду: ${text.command}`))


bot.launch()







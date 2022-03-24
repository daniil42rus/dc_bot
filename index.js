const { Telegraf, Markup, Scenes, session } = require('telegraf')
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN)

const applicationScene = require("./scenes/application.js")
const takeApplicationScene = require("./scenes/takeApplication.js")
const closedApplicationScene = require("./scenes/closedApplication.js")

const stage = new Scenes.Stage([applicationScene, takeApplicationScene, closedApplicationScene])




bot.use(session())
bot.use(stage.middleware());

bot.command('admin', (ctx) => {
    ctx.replyWithHTML("Выберите из меню нужное действие", Markup.keyboard([
        ['Взять заявку по ID', 'Закрыть заявку по ID'],
        ['Мои открытые заявки', 'Мои закрытые заявки за этот месяц'],
        ['Открытые заявки'],
        ['Изменить исполнителя'],
    ]).oneTime().resize())
})

bot.hears("Взять заявку по ID", (ctx) => {
    ctx.scene.enter('takeApplicationWizard')
})

bot.hears("Закрыть заявку по ID", (ctx) => {
    ctx.scene.enter('closedApplicationWizard')
})

bot.command('new_application', (ctx) => {
    if (ctx.chat.id != process.env.applicationChat) {
        ctx.scene.enter('applicationWizard')
    }
})

bot.on('message', (ctx) => {
    if (ctx.chat.id != process.env.applicationChat) {
        ctx.reply('Что бы отправить завяку в ИТ отдел, нажмите /new_application', Markup.removeKeyboard())
    }
})

bot.launch()







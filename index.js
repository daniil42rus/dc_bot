const { Telegraf, Markup, Scenes, session } = require('telegraf')
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs');


const applicationScene = require("./scenes/application.js")
const takeApplicationScene = require("./scenes/takeApplication.js")
const closedApplicationScene = require("./scenes/closedApplication.js")
const myOpenApplicationScene = require("./scenes/myOpenApplication.js")
const myClosedMonthApplicationScene = require("./scenes/myClosedMonthApplication.js")
const allOpenApplicationScene = require("./scenes/allOpenApplication.js")
const sendApplicationScene = require("./scenes/sendApplication.js")

const stage = new Scenes.Stage(
    [
        applicationScene,
        takeApplicationScene,
        closedApplicationScene,
        myOpenApplicationScene,
        myClosedMonthApplicationScene,
        allOpenApplicationScene,
        sendApplicationScene
    ])




bot.use(session())
bot.use(stage.middleware());


bot.command('admin', (ctx) => {

    let executorFile = fs.readFileSync('./db/executors.json', 'utf-8')
    let executorFileParse = JSON.parse(executorFile)

    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)

    console.log(executorID)
    if (executorID === undefined) {
        ctx.reply("У вас нет прав для просмотра")
    } else {
        ctx.replyWithHTML("Выберите из меню нужное действие", Markup.keyboard([
            ['Взять заявку по ID', 'Закрыть заявку по ID'],
            ['Мои открытые заявки', 'Мои закрытые заявки за этот месяц'],
            ['Открытые заявки'],
            ['Изменить исполнителя'],
        ]).oneTime().resize())

    }
})

bot.hears("Взять заявку по ID", (ctx) => {
    ctx.scene.enter('takeApplicationWizard')
})

bot.hears("Закрыть заявку по ID", (ctx) => {
    ctx.scene.enter('closedApplicationWizard')
})

bot.hears("Мои открытые заявки", (ctx) => {
    ctx.scene.enter('myOpenApplicationWizard')
})

bot.hears("Мои закрытые заявки за этот месяц", (ctx) => {
    ctx.scene.enter('myClosedMonthApplicationWizard')
})

bot.hears("Открытые заявки", (ctx) => {
    ctx.scene.enter('allOpenApplicationWizard')
})

bot.hears("Изменить исполнителя", (ctx) => {
    ctx.scene.enter('sendApplicationWizard')
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







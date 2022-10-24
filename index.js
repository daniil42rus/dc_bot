const { Telegraf, Markup, Scenes, session } = require('telegraf')
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs');
const fetch = require('node-fetch');

const { createWriteStream } = require('node:fs');
const { pipeline } = require('node:stream');
const { promisify } = require('node:util');





const applicationScene = require("./scenes/application.js")
const takeApplicationScene = require("./scenes/takeApplication.js")
const closedApplicationScene = require("./scenes/closedApplication.js")
const myOpenApplicationScene = require("./scenes/myOpenApplication.js")
const myClosedMonthApplicationScene = require("./scenes/myClosedMonthApplication.js")
const allOpenApplicationScene = require("./scenes/allOpenApplication.js")
const sendApplicationScene = require("./scenes/sendApplication.js")
const sendStatisticsScene = require("./scenes/statistics.js")
const personOpenApplicationScene = require("./scenes/personOpenApplication.js")
const messageAllScene = require("./scenes/massageAll.js")
const customerOpenApplicationScene = require("./scenes/customerOpenApplication.js")

const stage = new Scenes.Stage(
    [
        applicationScene,
        takeApplicationScene,
        closedApplicationScene,
        myOpenApplicationScene,
        myClosedMonthApplicationScene,
        allOpenApplicationScene,
        sendApplicationScene,
        sendStatisticsScene,
        personOpenApplicationScene,
        messageAllScene,
        customerOpenApplicationScene,
    ])

bot.use(session())
bot.use(stage.middleware());

let executorFile = fs.readFileSync('./db/executors.json', 'utf-8')
let executorFileParse = JSON.parse(executorFile)
let date = new Date

bot.command('admin', (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    if (ctx.chat.type == 'private') {

        let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)

        if (executorID == undefined) {
            ctx.reply('Что бы отправить завяку в ИТ отдел, нажмите /new_application', Markup.removeKeyboard())
        } else {
            ctx.replyWithHTML("Выберите из меню нужное действие", Markup.keyboard([
                ['Взять заявку по ID', 'Закрыть заявку по ID'],
                ['Мои открытые заявки', 'Мои закрытые заявки за этот месяц'],
                ['Открытые заявки', 'Изменить исполнителя'],
                ['Отправить сообщение'],
            ]).oneTime().resize())
        }
    }
})

bot.hears("Взять заявку по ID", (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)
    if (ctx.chat.type == 'private' || executorID == undefined) {
        ctx.scene.enter('takeApplicationWizard')
    }
})

bot.hears("Закрыть заявку по ID", (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)
    if (ctx.chat.type == 'private' || executorID == undefined) {
        ctx.scene.enter('closedApplicationWizard')
    }
})

bot.hears("Мои открытые заявки", (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)
    if (ctx.chat.type == 'private' || executorID == undefined) {
        ctx.scene.enter('myOpenApplicationWizard')
    }
})

bot.hears("Мои закрытые заявки за этот месяц", (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)
    if (ctx.chat.type == 'private' || executorID == undefined) {
        ctx.scene.enter('myClosedMonthApplicationWizard')
    }
})

bot.hears("Открытые заявки", (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)
    if (ctx.chat.type == 'private' || executorID == undefined) {
        ctx.scene.enter('allOpenApplicationWizard')
    }
})

bot.hears("Изменить исполнителя", (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)
    if (ctx.chat.type == 'private' || executorID == undefined) {
        ctx.scene.enter('sendApplicationWizard')
    }
})

bot.hears("Отправить сообщение", (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.from.id)
    if (ctx.chat.type == 'private' || executorID == undefined) {
        ctx.scene.enter('messageAllWizard')
    }
})

bot.command('statistic', (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    if (ctx.from.id == process.env.admin1 || ctx.from.id == process.env.admin2 || ctx.chat.type == 'private') {
        ctx.scene.enter('statisticsWizard')
    } else {
        ctx.reply('Что бы отправить завяку в ИТ отдел, нажмите /new_application', Markup.removeKeyboard())
    }

})

bot.command('person', (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    if (ctx.from.id == process.env.admin1 || ctx.from.id == process.env.admin2 || ctx.chat.type == 'private') {

        ctx.scene.enter('personOpenApplicationWizard')
    } else {
        ctx.reply('Что бы отправить завяку в ИТ отдел, нажмите /new_application', Markup.removeKeyboard())
    }
})

bot.command('new_application', (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    if (ctx.chat.type == 'private') {
        ctx.scene.enter('applicationWizard')
    }
})

bot.command('open_application', (ctx) => {

    console.log(ctx.message.text, ctx.chat, date.toLocaleString())
    if (ctx.chat.type == 'private') {
        ctx.scene.enter('customerOpenApplicationWizard')
    }
})

bot.on('photo', async (ctx) => {


    let file_id = ctx.message.photo[ctx.message.photo.length - 1]?.file_id;
    console.log(file_id);
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`
    const responselink = await fetch(url);
    const body = await responselink.json()

    const fileLink = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${body.result.file_path}`

    // const file_path = body.result.file_path;
    // const urljpg = await fetch(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`);



    // const responseimg = await fetch(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${body.result.file_path}`);

    // console.log(responseimg);


    const streamPipeline = promisify(pipeline);

    const response = await fetch(fileLink);

    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

    await streamPipeline(response.body, createWriteStream(`./uploads/${body.result.file_path}`));




    console.log('Сообщение', ctx.message, body.result.file_path , ctx.chat, date.toLocaleString())
    if (ctx.chat.type == 'private') {
        ctx.reply(fileLink, Markup.removeKeyboard())
    }




})

bot.on('message', (ctx) => {

    console.log('Сообщение', ctx.message.text, ctx.chat, date.toLocaleString())
    if (ctx.chat.type == 'private') {
        ctx.reply('Что бы отправить завяку в ИТ отдел, нажмите /new_application', Markup.removeKeyboard())
    }
})

bot.launch()







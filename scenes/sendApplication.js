const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');



const idApplication = new Composer()
idApplication.on("text", async (ctx) => {

    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.message.message_id
        ctx.wizard.state.data.userId = ctx.message.from.id

        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.text = ctx.message.text

        let executorFile = fs.readFileSync('./db/executors.json', 'utf-8')
        let executorFileParse = JSON.parse(executorFile)
        let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == ctx.message.from.id)
        ctx.wizard.state.data.executorGet = executorID.name
      
        await ctx.replyWithHTML("Введите ID", Markup.removeKeyboard())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})


const whomSendIdApplication = new Composer()
whomSendIdApplication.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.idApplication = ctx.message.text

        let readFile = fs.readFileSync('./db/applications.json', 'utf-8')
        let readFileParse = JSON.parse(readFile)
        let findApplicationID = readFileParse.find(readFileParse => readFileParse.id == ctx.message.text)

        if (findApplicationID == undefined) {
            await ctx.reply("Заявка с таким ID  не найдена", Markup.removeKeyboard())
            return ctx.scene.leave()

        }
        if (!findApplicationID.open) {
            await ctx.reply("Эта заявка уже закрыта, нельзя передавать закрытую заявку", Markup.removeKeyboard())
            return ctx.scene.leave()
        }

        if (findApplicationID.executor.id != ctx.message.from.id) {
            await ctx.reply("Эта заявка вам не пренадлежит, нельзя передавать чужую заявку", Markup.removeKeyboard())
            return ctx.scene.leave()
        }


        // console.log(findApplicationID.open)


        await ctx.replyWithHTML("Кому хотите передать зяаявку", Markup.keyboard([
            ['Сапрыкин Станислав Евгеньевич', 'Кулешов Даниил Олегович'],
            ['Газдик Дмитрий Евгеньевич', 'Смаль Артем Вячеславович'],
            ['Никитин Максим Александрович', 'Анисимов Сергей Андреевич'],
            ['Лучников Александр Александрович'],
        ]).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const SendIdApplication = new Composer()
SendIdApplication.on("text", async (ctx) => {

    try {
        ctx.wizard.state.data.whomSendIdApplication = ctx.message.text
        const wizardData = ctx.wizard.state.data
        console.log(wizardData)

        let readFile = fs.readFileSync('./db/applications.json', 'utf-8')
        let readFileParse = JSON.parse(readFile)
        let findApplicationID = readFileParse.find(readFileParse => readFileParse.id == wizardData.idApplication)

        let executorFile = fs.readFileSync('./db/executors.json', 'utf-8')
        let executorFileParse = JSON.parse(executorFile)
        let executorID = executorFileParse.find(executorFileParse => executorFileParse.name == wizardData.whomSendIdApplication)


        findApplicationID.executor.name = executorID.name
        findApplicationID.executor.id = executorID.id
        findApplicationID.executor.nickName = executorID.nickName


        readFileStringify = JSON.stringify(readFileParse)
        fs.writeFileSync('./db/applications.json', readFileStringify)

        
        await botMessage.sendMessage(executorID.id, `${wizardData.executorGet} передал вам заявку с ID ${wizardData.idApplication}` );

        await botMessage.sendMessage(findApplicationID.customer.id, `Вашу заявку с ID ${wizardData.idApplication} передана\nНовый исполнитель ${executorID.name}.\nСвязь с новым исполнителем t.me/${executorID.nickName}` );

        await ctx.replyWithHTML("Заявка передана", Markup.removeKeyboard())

        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }

})




const sendApplicationScene = new Scenes.WizardScene('sendApplicationWizard', idApplication, whomSendIdApplication, SendIdApplication)
module.exports = sendApplicationScene

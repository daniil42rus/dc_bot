const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');

// const choice = new Composer()
// choice.on("text", async (ctx) => {
//     try {
//         // console.log(ctx.chat)

//         ctx.wizard.state.data = {}
//         ctx.wizard.state.data.id = ctx.message.message_id
//         ctx.wizard.state.data.userId = ctx.message.from.id

//         ctx.wizard.state.data.userName = ctx.message.from.username
//         ctx.wizard.state.data.firstName = ctx.message.from.first_name
//         ctx.wizard.state.data.lastName = ctx.message.from.last_name
//         ctx.wizard.state.data.text = ctx.message.text

//         // console.log(ctx)


//         return ctx.wizard.next()
//     } catch (e) {
//         console.error(e)
//     }
// })

const idApplication = new Composer()
idApplication.on("text", async (ctx) => {

    ctx.wizard.state.data = {}
    ctx.wizard.state.data.id = ctx.message.message_id
    ctx.wizard.state.data.userId = ctx.message.from.id

    ctx.wizard.state.data.userName = ctx.message.from.username
    ctx.wizard.state.data.firstName = ctx.message.from.first_name
    ctx.wizard.state.data.lastName = ctx.message.from.last_name
    ctx.wizard.state.data.text = ctx.message.text

    try {
        await ctx.replyWithHTML("Введите ID")
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const addIdApplication = new Composer()
addIdApplication.on("text", async (ctx) => {

    try {

        ctx.wizard.state.data.idApplication = ctx.message.text
        const wizardData = ctx.wizard.state.data

        let readFile = fs.readFileSync('./db/applications.json', 'utf-8')
        let readFileParse = JSON.parse(readFile)

        let findApplicationID = readFileParse.find(readFileParse => readFileParse.id == wizardData.idApplication)

        let executorFile = fs.readFileSync('./db/executors.json', 'utf-8')
        let executorFileParse = JSON.parse(executorFile)

        let executorID = executorFileParse.find(executorFileParse => executorFileParse.id == wizardData.userId)

        if (findApplicationID == undefined) {
            await ctx.reply("Заявка не найдена");
            return ctx.scene.leave()
        }

        if (findApplicationID.executor.id == wizardData.userId) {
            await ctx.reply("Это уже ваша заявка");
            return ctx.scene.leave()
        }

        if (findApplicationID.executor.name) {
            ctx.replyWithHTML(`Заявку уже принял ${findApplicationID.executor.name}`);
            return ctx.scene.leave()
        }

        if (findApplicationID && !findApplicationID.executor.name) {
            findApplicationID.executor.name = executorID.name;
            findApplicationID.executor.id = wizardData.userId;
            findApplicationID.executor.nickName = wizardData.userName;

            await ctx.reply(`Вам добавленна заявка ID ${findApplicationID.id} от ${findApplicationID.customer.firstName} `,Markup.removeKeyboard());
            await botMessage.sendMessage(findApplicationID.customer.id, `Вашу заявку принял ${executorID.name} \n Связь с исполнителем \n t.me/${findApplicationID.executor.nickName}`,
                { disable_web_page_preview: true });
            readFileStringify = JSON.stringify(readFileParse)
            fs.writeFileSync('./db/applications.json', readFileStringify)
            return ctx.scene.leave()
        }

        // console.log(findApplicationID)

        // for (i of readFileParse) {

        //     if (wizardData.idApplication == i.id) {

        //         if (i.executor.name) {
        //             ctx.replyWithHTML(`Заявку уже принял ${i.executor.name}`);
        //             break;
        //         }

        //         i.executor.name = wizardData.firstName;
        //         i.executor.id = wizardData.userId;
        //         i.executor.nickName = wizardData.userName;
        //         await botMessage.sendMessage(i.customer.id, `Вашу заявку принял ${i.executor.name} \n Связь с исполнителем \n t.me/${i.executor.nickName}`,
        //             { disable_web_page_preview: true });

        //         readFileStringify = JSON.stringify(readFileParse)
        //         fs.writeFileSync('./db/applications.json', readFileStringify)
        //     }
        // }

    } catch (e) {
        console.error(e)
    }

})

const takeApplicationScene = new Scenes.WizardScene('takeApplicationWizard', idApplication, addIdApplication)
module.exports = takeApplicationScene

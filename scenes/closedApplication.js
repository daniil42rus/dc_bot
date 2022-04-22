const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');



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
        await ctx.replyWithHTML("Введите ID", Markup.removeKeyboard())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})


const closedIdApplication = new Composer()
closedIdApplication.on("text", async (ctx) => {
    // await ctx.reply("ЗАКРЫТО ЕЙК", Markup.removeKeyboard());



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
            await ctx.reply("Заявка не найдена", Markup.removeKeyboard());
            return ctx.scene.leave()
        }

        if (!findApplicationID.executor.id) {
            await ctx.reply(`Заявка с ID ${wizardData.idApplication} никто не взял.\nЧто бы закрыть заявку, ее нужно себе добавить`, Markup.removeKeyboard());
            return ctx.scene.leave()
        }

        if (!findApplicationID.open) {
            await ctx.reply(`Заявку с ID ${wizardData.idApplication} уже закрыл ${findApplicationID.executor.name}.`, Markup.removeKeyboard());
            await ctx.reply(`Заявка закрыта ${findApplicationID.closed.day}.${findApplicationID.closed.month}.${findApplicationID.closed.year} в ${findApplicationID.closed.hours}:${findApplicationID.closed.minutes}`, Markup.removeKeyboard());
            return ctx.scene.leave()
        }

        if (findApplicationID.executor.id != wizardData.userId) {
            await ctx.reply(`Заявку с ID ${wizardData.idApplication} взял в работу ${findApplicationID.executor.name}.\nВы не можете закрыть чужую заявку`, Markup.removeKeyboard());
            return ctx.scene.leave()
        }

        if (findApplicationID && findApplicationID.executor.name) {

            let currentDate = new Date();
            let dd = currentDate.getDate();
            let mm = currentDate.getMonth() + 1;
            let yyyy = currentDate.getFullYear();
            let hours = currentDate.getHours()
            let minutes = currentDate.getMinutes()


            findApplicationID.open = false;
            findApplicationID.closed.day = dd;
            findApplicationID.closed.month = mm;
            findApplicationID.closed.year = yyyy;
            findApplicationID.closed.hours = hours;
            findApplicationID.closed.minutes = minutes;
            findApplicationID.closed.date = currentDate.toISOString()

            await ctx.reply(`Вы закрыли заявку ID ${findApplicationID.id} от ${findApplicationID.customer.firstName} `);
            await ctx.reply(`Заявка закрыта ${findApplicationID.closed.day}.${findApplicationID.closed.month}.${findApplicationID.closed.year} в ${findApplicationID.closed.hours}:${findApplicationID.closed.minutes}`,Markup.removeKeyboard());

            await botMessage.sendMessage(findApplicationID.customer.id, `Вашу заявку с ID ${findApplicationID.id} закрыл ${executorID.name} \nЗаявка закрыта ${findApplicationID.closed.day}.${findApplicationID.closed.month}.${findApplicationID.closed.year} в ${findApplicationID.closed.hours}:${findApplicationID.closed.minutes}`,
                { disable_web_page_preview: true });

            readFileStringify = JSON.stringify(readFileParse)
            fs.writeFileSync('./db/applications.json', readFileStringify)

            return ctx.scene.leave()
        }

    } catch (e) {
        console.error(e)
    }

})


const closedApplicationScene = new Scenes.WizardScene('closedApplicationWizard', idApplication, closedIdApplication)
module.exports = closedApplicationScene

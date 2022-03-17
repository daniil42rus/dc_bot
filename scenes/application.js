const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const botMessage = new TelegramBot(process.env.BOT_TOKEN);


const yesUndefined = name => typeof name === 'undefined' ? '' : name;







const problems = new Composer()
problems.on("text", async (ctx) => {
    try {
        // chatId = ctx.message.from.id;
        console.log(ctx.chat)
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.message.message_id
        ctx.wizard.state.data.title = ctx.message.text
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.text = ctx.message.text

        await ctx.replyWithHTML("В чем проблема"
            , Markup.keyboard([
                [Markup.button.callback('Принтер', 'printer'), Markup.button.callback('РэдОС', 'redOS')],
            ]).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }

    console.log(ctx)
})

const problemsDetails = new Composer()

problemsDetails.hears('Принтер', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML("Немного подробнее? Опишите или выбирете из меню", Markup.keyboard([
            ['Замятие бумаги'],]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML("Немного подробнее?")
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const roomNumber = new Composer()

roomNumber.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.problemsDetails = ctx.message.text
        await ctx.replyWithHTML("Какаой у вас кабинет? ")
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const conditionStep = new Composer()
conditionStep.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.roomNumber = ctx.message.text
        const wizardData = ctx.wizard.state.data
      
        let answer = (
        `${wizardData.title} 
        Номер кабинета: ${wizardData.roomNumber} 
        id заявки: ${wizardData.id} 
        Отправитель: ${wizardData.firstName}
        В чем проблема: ${wizardData.problems}
        Описание: ${wizardData.problemsDetails}
        t.me/${wizardData.userName} `);

        await ctx.replyWithHTML(answer, {
            disable_web_page_preview: true
        });

        if (wizardData.title ==='10 поликлиника' || wizardData.title ==='Женская консультация' ) {
            botMessage.sendMessage(347867666, answer)
        }

        botMessage.sendMessage(-1001618076057, answer)

        await ctx.replyWithHTML('Заявка отправлена в отдел ИТ', Markup.keyboard([
            ['Подать новую заявку'],]
        ).oneTime().resize())
        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }
    return i;
})

problemsDetails.hears('Подать новую заявку', async (ctx) => {
    // require('.index')
    // ctx.scene.enter('applicationWizard')
})





const applicationScene = new Scenes.WizardScene('applicationWizard', problems, problemsDetails, roomNumber, conditionStep)
module.exports = applicationScene

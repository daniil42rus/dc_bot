const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');
const { colours } = require('nodemon/lib/config/defaults');



const startStatistics = new Composer()
startStatistics.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userId = ctx.message.from.id
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name

        await ctx.replyWithHTML("Введите начало периода", Markup.removeKeyboard())
        return ctx.wizard.next()

    } catch (e) {
        console.error(e)
    }
})


const endStatistics = new Composer()
endStatistics.on("text", async (ctx) => {
    try {

        ctx.wizard.state.data.startStatistics = ctx.message.text

        await ctx.replyWithHTML("Введите конец периода", Markup.removeKeyboard())
        return ctx.wizard.next()

    } catch (e) {
        console.error(e)
    }
})



const personStatistics = new Composer()
personStatistics.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.endStatistics = ctx.message.text

        let startDate = Date.parse(ctx.wizard.state.data.startStatistics);
        let endDate = Date.parse(ctx.wizard.state.data.endStatistics);
          
        startDate = String(startDate)
        endDate = String(endDate)

        if (startDate == 'NaN' || endDate == 'NaN') {
            await ctx.reply(`Введены некоректные значения\nЗначения которые вы вводили: с ${ctx.wizard.state.data.startStatistics} по ${ctx.wizard.state.data.endStatistics}`, Markup.removeKeyboard());
            return ctx.scene.leave()
        }

        await ctx.replyWithHTML("Чью статистику посмотреть", Markup.keyboard([
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



const getStatistics = new Composer()
getStatistics.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.personStatistics = ctx.message.text

        const wizardData = ctx.wizard.state.data

        let readFile = fs.readFileSync('./db/applications.json', 'utf-8')
        let readFileParse = JSON.parse(readFile)

        let startDate = Date.parse(wizardData.startStatistics);
        let endDate = Date.parse(wizardData.endStatistics);

        let number = [];
        let dc = [];
        let p1 = [];
        let p2 = [];
        let p3 = [];
        let p4 = [];
        let p10 = [];
        let wc = [];
        let tp = [];
        let cmr = [];

        for (values of readFileParse) {
            let data = `${values.closed.year}-${values.closed.month}-${values.closed.day}`;
            let closedDate = Date.parse(data);

            for (let i = startDate; i < endDate; i = i + 24 * 60 * 60 * 1000) {

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "Диагностический центр") {
                    dc.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "1 поликлиника") {
                    p1.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "2 поликлиника") {
                    p2.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "3 поликлиника") {
                    p3.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "4 поликлиника") {
                    p4.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "10 поликлиника") {
                    p10.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "Женская консультация") {
                    wc.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "Женская консультация") {
                    wc.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "ТП") {
                    tp.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open && values.application.department == "ЦМР") {
                    cmr.push(values.id)
                }

                if (i == closedDate && wizardData.personStatistics == values.executor.name && !values.open) {
                    number.push(values.id)
                }

            }
        }

        if (dc.length) await ctx.reply(`Всего за период закртыто в ДЦ: ${dc.length}`, Markup.removeKeyboard());
        if (p1.length) await ctx.reply(`Всего за период закртыто в 1П: ${p1.length}`, Markup.removeKeyboard());
        if (p2.length) await ctx.reply(`Всего за период закртыто в 2П: ${p2.length}`, Markup.removeKeyboard());
        if (p3.length) await ctx.reply(`Всего за период закртыто в 3П: ${p3.length}`, Markup.removeKeyboard());
        if (p4.length) await ctx.reply(`Всего за период закртыто в 4П: ${p4.length}`, Markup.removeKeyboard());
        if (p10.length) await ctx.reply(`Всего за период закртыто в 10П: ${p10.length}`, Markup.removeKeyboard());
        if (wc.length) await ctx.reply(`Всего за период закртыто в ЖК: ${wc.length}`, Markup.removeKeyboard());
        if (tp.length) await ctx.reply(`Всего за период закртыто в ТП: ${tp.length}`, Markup.removeKeyboard());
        if (cmr.length) await ctx.reply(`Всего за период закртыто в ЦМР: ${cmr.length}`, Markup.removeKeyboard());

        if (number.length) await ctx.reply(`Всего за период закрыто: ${number.length}`, Markup.removeKeyboard());

        if (!number.length) await ctx.reply(`За период с ${wizardData.startStatistics} по ${wizardData.endStatistics} ничего нет`, Markup.removeKeyboard());


        return ctx.scene.leave()

    } catch (e) {
        console.error(e)
    }
})


const sendStatisticsScene = new Scenes.WizardScene('statisticsWizard', startStatistics, endStatistics, personStatistics, getStatistics)
module.exports = sendStatisticsScene

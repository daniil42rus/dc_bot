const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');

const myClosedMonthApplication = new Composer()
myClosedMonthApplication.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.message.message_id
        ctx.wizard.state.data.userId = ctx.message.from.id
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.text = ctx.message.text
        ctx.wizard.state.data.idApplication = ctx.message.text

        const wizardData = ctx.wizard.state.data

        let readFile = fs.readFileSync('./db/applications.json', 'utf-8')
        let readFileParse = JSON.parse(readFile)

        let number = [];

        let currentDate = new Date();
        let mm = currentDate.getMonth() + 1;


        for (i of readFileParse) {



            let answer = (
                `
               ЗАКРЫТА
               Дата закрытия ${i.closed.day}.${i.closed.month}.${i.closed.year} в ${i.closed.hours}:${i.closed.minutes}
                ${i.application.department} 
          Номер кабинета: ${i.application.roomNumber}       
          Срочность:  ${i.application.urgency}       
          Отправитель:  ${i.customer.firstName}      
          В чем проблема:   ${i.application.problems}      
          Описание:   ${i.application.problemsDetails} 
          id заявки:  ${i.id}       
            `);


            if (!i.open && wizardData.userId == i.executor.id && i.closed.month == mm) {
                number.push(i.id)
                await ctx.reply(`${answer} `);
            }
        }

        await ctx.reply(`Вами закрыто ${number.length} шт.`,Markup.removeKeyboard());

        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }
})

const myClosedMonthApplicationScene = new Scenes.WizardScene('myClosedMonthApplicationWizard', myClosedMonthApplication)
module.exports = myClosedMonthApplicationScene

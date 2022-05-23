const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');

const customerOpenApplication = new Composer()
customerOpenApplication.on("text", async (ctx) => {
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

        for (i of readFileParse) {




            let answer = (
                `
                ${i.application.department} 
          Номер кабинета: ${i.application.roomNumber}       
          Срочность:  ${i.application.urgency}       
          Отправитель:  ${i.customer.firstName}      
          В чем проблема:   ${i.application.problems}      
          Описание:   ${i.application.problemsDetails} 
          id заявки:  ${i.id}       
          `);


            !i.executor.name ? executorName = `Исполнитель : не назначен` : executorName = `Исполнитель:  ${i.executor.name} \n t.me/${i.executor.nickName}`;

            if (i.open && wizardData.userId == i.customer.id) {
                number.push(i.id)
                await ctx.reply(`${answer} ${executorName} `);
            }
        }

        await ctx.reply(`Всего ${number.length} шт.`, Markup.removeKeyboard());

        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }
})

const customerOpenApplicationScene = new Scenes.WizardScene('customerOpenApplicationWizard', customerOpenApplication)
module.exports = customerOpenApplicationScene

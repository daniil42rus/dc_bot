const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');
const { connect } = require('../../functions/connectDb');


const customerOpenApplication = new Composer()
customerOpenApplication.on("text", async (ctx) => {
    try {
        const db = await connect()
        const applications = db.collection("applications");

        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.message.message_id
        ctx.wizard.state.data.userId = ctx.message.from.id
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.text = ctx.message.text
        ctx.wizard.state.data.idApplication = ctx.message.text

        const wizardData = ctx.wizard.state.data

        let readFileParse = await applications.find({ 'customer.id': parseInt(wizardData.userId) }).toArray()

        let truereadFileParse = readFileParse.filter(obj => obj.open)

        let number = [];

        for (i of truereadFileParse) {
            
                let answer = (
                    `
                    ${i.application.department} 
              Номер кабинета: ${i.application.roomNumber}       
              Срочность:  ${i.application.urgency}       
              Отправитель:  ${i.customer.firstName}      
              В чем проблема:   ${i.application.problems}      
              Описание:   ${i.application.problemsDetails} 
              id заявки:  ${i.id}      
              Исполнитель: ${!i.executor.name ? 'не назначен' : i.executor.name + ' - t.me/' + i.executor.nickName}
              `);
              
                number.push(i.id)
                await ctx.reply(answer, {
                    disable_web_page_preview: true
                });
        }

        await ctx.reply(`Всего ${number.length} шт.`, Markup.removeKeyboard());

        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }
})

const customerOpenApplicationScene = new Scenes.WizardScene('customerOpenApplicationWizard', customerOpenApplication)
module.exports = customerOpenApplicationScene

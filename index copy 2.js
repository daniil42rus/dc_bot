const command = require('nodemon/lib/config/command');
const TelegramBot = require('node-telegram-bot-api');
const { Telegraf, Markup } = require('telegraf')
const { Keyboard } = require('telegram-keyboard');
require('dotenv').config();
const text = require('./const');
const bot = new Telegraf(process.env.BOT_TOKEN)


const botMessage = new TelegramBot(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name} ${text.command}`))
bot.help((ctx) => ctx.reply(text.command))

// bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.hears('Привет', (ctx) => ctx.reply(`Привет ${text.command}`))



function problem(text, chatId) {
    let application = [];

    console.log(text)

    application.push(text)

    for (i of application) {
        botMessage.sendMessage('347867666', i);
    }


}

let application = [];

bot.command('new_application', async (ctx) => {


    const chatId = ctx.message.from.id;


    try {

        await ctx.replyWithHTML('<b>Какое подразделение</b>', Markup.keyboard(
            [
                [Markup.button.callback('ДЦ')],
                [Markup.button.callback('ТП')],
                [Markup.button.callback('ЦМР')]
            ]
        ))


        bot.hears('123', async (ctx) => {
            // problem(ctx.message.text, chatId)
            console.log(ctx.message.text)
            application.push(ctx.message.text)
            // for (i of application) {
            //     botMessage.sendMessage('347867666', i);
            // }


            await ctx.replyWithHTML('<b>Что не работает</b>', Markup.keyboard(
                [
                    [Markup.button.callback('Принтер')],
                    [Markup.button.callback('Компьютер')],
                    [Markup.button.callback('Мониор')]
                ]

            ))

        })

        console.log(application)




    } catch (e) {
        console.error(e)
    }

})











// bot.on('text', (ctx) => ctx.reply(`Привет ${ctx.message.from.first_name} ${text.command}`))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))







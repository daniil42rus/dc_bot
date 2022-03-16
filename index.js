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
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('Привет', (ctx) => ctx.reply(`Привет ${text.command}`))










bot.command('new_application', async (ctx) => {
    let application = [];

    const chatId = ctx.message.from.id;
    console.log(chatId)

    function problem() {
        ctx.replyWithHTML('<b>Что не работает</b>', Markup.keyboard(
            [
                [Markup.button.callback('Принтер')],
                [Markup.button.callback('Компьютер')],
                [Markup.button.callback('Мониор')]
            ]
        ))
    }


    let appl = [
        'Диагностический центр',
        '1 поликлиника',
        '2 поликлиника',
        '3 поликлиника',
        '4 поликлиника',
    ]

    try {
        await ctx.replyWithHTML('<b>Какое подразделение</b>', Markup.keyboard(
            [
                [Markup.button.callback(appl[0])],
                [Markup.button.callback('1 поликлиника'), Markup.button.callback('2 поликлиника')],
                [Markup.button.callback('3 поликлиника'), Markup.button.callback('4 поликлиника')],
                [Markup.button.callback('10 поликлиника'), Markup.button.callback('Женская консультация')],
                [Markup.button.callback('ТП'), Markup.button.callback('ЦМР')],
            ]
        ))

for ( i of appl) {

    bot.hears(i, async (ctx) => {
        console.log(ctx.message.text)
        application.push(ctx.message.text)
        problem()
    })
} 


        // bot.hears('Диагностический центр', async (ctx) => {
        //     console.log(ctx.message.text)
        //     application.push(ctx.message.text)
        //     problem()
        // })


        // bot.hears('ТП', async (ctx) => {
        //     console.log(ctx.message.text)
        //     application.push(ctx.message.text)
        //     problem()
        // })


        // bot.hears('ЦМР', async (ctx) => {
        //     console.log(ctx.message.text)
        //     application.push(ctx.message.text)
        //     problem()
        // })






        bot.hears('Принтер', async (ctx) => {
            console.log(ctx.message.text)
            application.push(ctx.message.text)
            for (i of application) {
                botMessage.sendMessage('347867666', i);
                botMessage.sendMessage(chatId, i);

            }
            await ctx.replyWithHTML('Какой кабинет', Markup.keyboard(
                [
                    [Markup.button.callback('1')],
                    [Markup.button.callback('2')],
                    [Markup.button.callback('3')]
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







const { Telegraf } = require('telegraf')
const { Keyboard } = require('telegram-keyboard');


const token = '5289196198:AAFqEmyAtwIUH2lahhzJKmRR_dXor2VVzZA';


const bot = new Telegraf(token)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))


bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

bot.on('message', async (ctx) => {

    const keyboard = Keyboard.make([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], {
        pattern: [3, 1, 1]
    })
    
    console.log(keyboard)
  
    await ctx.reply('Simple built-in keyboard', keyboard.reply())

    // await ctx.reply('Simple inline keyboard', keyboard.inline())
    console.log(keyboard.buttons)
  })




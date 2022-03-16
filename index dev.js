const TelegramBot = require('node-telegram-bot-api');
const Telegraf = require('telegraf');
const { Keyboard } = require('telegram-keyboard');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5289196198:AAFqEmyAtwIUH2lahhzJKmRR_dXor2VVzZA';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Массив с кнопками
const keyboard_dep = [
    [{ text: 'ДЦ', callback_data: "ДЦ" }],
    [{ text: 'ЦМР', callback_data: "ЦМР" }],
]

const keyboard_prob = [
    [{ text: 'Принтер не работает', callback_data: "Принтер не работает" }],
    [{ text: 'Сканер', callback_data: "Сканер" }],
]

// Настройки для отправки сообщения
let options_dep = {
    reply_markup: JSON.stringify({
        // Добавляем наши кнопки
        inline_keyboard: keyboard_dep,

    })
};

// Настройки для отправки сообщения
let options_prob = {
    reply_markup: JSON.stringify({
        // Добавляем наши кнопки
        inline_keyboard: keyboard_prob,

    })
};


// Отслеживаем что пользователь зашёл к боту
bot.on('message', (msg) => {
    // Получаем индитенфикатор пользователя
    const chatId = msg.chat.id;
    console.log(chatId)
    // Отправляем пользователю сообщение
    bot.sendMessage(chatId, "trude", options_dep);

    // Проверка зажатия кнопки
    bot.on('callback_query', (query) => {
        let value = [];
        value.push('t.me/' + query.message.chat.username)

        if (query.data === "ДЦ") {

            value.push(query.data)
            // console.log(value)

            bot.sendMessage(chatId, 'В чем проблема', options_prob);
            bot.off;

            bot.on('callback_query', (query) => {

                if (query.data === "Принтер не работает") {
                    value.push(query.data)
                    for (i of value) {
                        bot.sendMessage(chatId, i);
                    }

                };
            });
            // bot.sendMessage(347867666, 'ДЦ');
        }
    });
});

// 347867666



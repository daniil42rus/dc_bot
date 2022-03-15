const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5289196198:AAFqEmyAtwIUH2lahhzJKmRR_dXor2VVzZA';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Массив с кнопками
const keyboard_dep = [
    [{ text: 'ДЦ', callback_data: "1" }],
    [{ text: 'ЦМР', callback_data: "2" }],
]

const keyboard_prob = [
    [{ text: 'Принтер', callback_data: "10" }],
    [{ text: 'Сканер', callback_data: "20" }],
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
    bot.sendMessage(chatId, true, options_dep);



    // Проверка зажатия кнопки
    bot.on('callback_query', (query) => {

        console.log(query.data)


        // Проверка что нажата кнопка со значение один
        if (query.data === "1") {
            console.log(query)
            bot.sendMessage(chatId, 'В чем проблема', options_prob);
            bot.on('callback_query', (query) => {
                if (query.data === "10") {
                    // process.exit(-1);
                    bot.sendMessage(chatId, 'какой кабинет?');
                };
            });

            // bot.sendMessage(347867666, 'ДЦ');
        }

        // Проверка что нажата кнопка со значение два
        if (query.data === "2") {
            bot.sendMessage(chatId, 'В чем проблема', options_prob);


        }


    });
});

// 347867666



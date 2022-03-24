const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fs = require('fs');
const { Console } = require('console');

const department = new Composer()
department.on("text", async (ctx) => {
    try {
        console.log(ctx.chat)

        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.message.message_id
        ctx.wizard.state.data.userId = ctx.message.from.id

        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.text = ctx.message.text

        await ctx.replyWithHTML("Выберите подразделение из меню", Markup.keyboard([
            ['Диагностический центр'],
            ['1 поликлиника', '2 поликлиника'],
            ['3 поликлиника', '4 поликлиника'],
            ['10 поликлиника', 'Женская консультация'],
            ['ТП', 'ЦМР'],
        ]).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const problems = new Composer()
problems.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.title = ctx.message.text
        await ctx.replyWithHTML("В чем проблема? Опишите или выберите из меню"
            , Markup.keyboard([
                ['Арена', 'Принтер'],
                ['1С', 'Компьютер'],
                ['ФСС', 'Регистры'],

            ]).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const problemsDetails = new Composer()

let problemsDetailsText = "Немного подробнее? Опишите или выберите из меню";

problemsDetails.hears('Арена', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Не запускается', '  Не работает '],
            ['Зависла', 'Нет шаблона'],
            ['Создать шаблон', 'Ошибка на экране'],
            ['Не печатает'],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('Принтер', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Замена катриджа', 'Не печатает'],
            ['Замятие бумаги', 'Высыпался тонер'],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('1С', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Не запускается ', 'Не работает '],
            ['Завис', 'Не печатает'],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('Компьютер', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Не включается  ', 'Синий экран '],
            ['Завис', 'Нет интернета'],
            ['Не работает монитор', 'Не работает клавиатура/мышь'],
            ['Не работает программа', 'Установить новое ПО'],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('ФСС', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Не отправляет  ', 'Не принимает  '],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('Регистры', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Не открываются  ', 'Не корректный логин/пароль  '],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})


problemsDetails.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML("Немного подробнее?", Markup.removeKeyboard())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const urgency = new Composer()
urgency.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.problemsDetails = ctx.message.text
        await ctx.replyWithHTML("Укажите сросночть заявки", Markup.keyboard([
            ['Срочно (1-2 часа)', 'В течении дня'],
            ['В течении 2х-3х дней', 'В течении недели'],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()

    } catch (e) {
        console.error(e)
    }
})

const roomNumber = new Composer()
roomNumber.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.urgency = ctx.message.text
        await ctx.replyWithHTML("Какой у вас кабинет? ", Markup.removeKeyboard())
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

        let applicationID = Math.floor(wizardData.id / 10)

        let currentDate = new Date();
        let dd = currentDate.getDate();
        let mm = currentDate.getMonth() + 1;
        let yyyy = currentDate.getFullYear();
        let hours = currentDate.getHours()
        let minutes = currentDate.getMinutes()

        let answer = (
            `
            ${wizardData.title} 
      Номер кабинета: ${wizardData.roomNumber}       
      Срочность:  ${wizardData.urgency}       
      Отправитель:  ${wizardData.firstName}      
      В чем проблема:   ${wizardData.problems}      
      Описание:   ${wizardData.problemsDetails} 
      id заявки:  ${wizardData.id}       
        `);

        let answerAdmin = (
            `t.me/${wizardData.userName}
            tg://user?id=${wizardData.userId}`
        );


        answerJSON = {
            'id': wizardData.id,

            'open': true,

            'application': {
                'department': wizardData.title,
                'roomNumber': wizardData.roomNumber,
                'problems': wizardData.problems,
                'problemsDetails': wizardData.problemsDetails,
            },

            'customer': {
                'firstName': wizardData.firstName,
                'id': wizardData.userId,
                'nickname': wizardData.userName,
            },

            'executor': {
                'name': false,
                'id': false,
                'nickName': false,
            },

            'closed': {
                'day': false,
                'month': false,
                'year': false,
                'hours': false,
                'minutes': false,
            },

            'applicationDate': {
                'day': dd,
                'month': mm,
                'year': yyyy,
                'hours': hours,
                'minutes': minutes,
            },
        };



        await botMessage.sendMessage(process.env.applicationChat, answer + answerAdmin, {
            disable_web_page_preview: true
        });

        let readFile = fs.readFileSync('./db/applications.json', 'utf-8')
        let all = readFile.substring(0, readFile.length - 1) + ',' + JSON.stringify(answerJSON) + ']';
        fs.writeFileSync('./db/applications.json', all);


        await ctx.reply(answer, {
            disable_web_page_preview: true
        });

        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }


})

const applicationScene = new Scenes.WizardScene('applicationWizard', department, problems, problemsDetails, urgency, roomNumber, conditionStep)
module.exports = applicationScene

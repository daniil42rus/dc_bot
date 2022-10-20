const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
require('dotenv').config();

const fs = require('fs');
const { Console } = require('console');

const department = new Composer()
department.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.message.message_id
        ctx.wizard.state.data.userId = ctx.message.from.id

        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.text = ctx.message.text

        await ctx.replyWithHTML("Выберите подразделение из меню", Markup.keyboard([
            ['Диагностический центр', 'Дарвина'],
            ['1 поликлиника', '2 поликлиника'],
            ['3 поликлиника', '4 поликлиника'],
            ['10 поликлиника', 'Женская консультация'],
            ['ТП', 'ЦМР'],
            ['Отмена заявки'],
        ]).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

const problems = new Composer()
// problems.hears('Отмена заявки', async (ctx) => {
//     try {
//         await ctx.reply('Вы отменили заявку', Markup.removeKeyboard())
//         return ctx.scene.leave()
//     } catch (e) {
//         console.error(e)
//     }

// })

problems.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.title = ctx.message.text

        switch (ctx.message.text) {
            case 'Диагностический центр':
                break
            case 'Дарвина':
                break
            case '1 поликлиника':
                break
            case '2 поликлиника':
                break
            case '3 поликлиника':
                break
            case '4 поликлиника':
                break
            case '10 поликлиника':
                break
            case 'Женская консультация':
                break
            case 'ТП':
                break
            case 'ЦМР':
                break
            case 'Отмена заявки':
                await ctx.reply('Вы отменили заявку', Markup.removeKeyboard())
                return ctx.scene.leave()
            default:
                await ctx.replyWithHTML("Нет такого подразделения")
                return
        }

        await ctx.replyWithHTML("В чем проблема? Опишите или выберите из меню"
            , Markup.keyboard([
                ['Арена', 'Принтер'],
                ['1С', 'Компьютер'],
                ['ФСС', 'Регистры'],
                ['Оборудование', 'ЭЦП'],
                ['Отмена заявки'],
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
            ['Не печатает', 'ЭЦП не подписывает'],
            ['Отмена заявки'],
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
            ['Отмена заявки'],

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
            ['Отмена заявки'],

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
            ['Отмена заявки'],

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
            ['ЭЦП не подписывает'],
            ['Отмена заявки'],

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
            ['Отмена заявки'],

        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('Оборудование', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Не считываются мониторы', '  Не загружается аппаратура'],
            ['Аппарат не видит принтер'],
            ['Отмена заявки'],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('Отмена заявки', async (ctx) => {
    try {
        await ctx.reply('Вы отменили заявку', Markup.removeKeyboard())
        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }
})

problemsDetails.hears('ЭЦП', async (ctx) => {
    try {
        ctx.wizard.state.data.problems = ctx.message.text
        await ctx.replyWithHTML(problemsDetailsText, Markup.keyboard([
            ['Выпустить ЭЦП', '  Установить ЭЦП'],
            ['Аннулировать ЭЦП', 'ЭЦП не подписывает'],
            ['Отмена заявки'],
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
        await ctx.replyWithHTML("Немного подробнее?", Markup.keyboard([
            ['Отмена заявки'],
        ]
        ).oneTime().resize())
        return ctx.wizard.next()
    } catch (e) {
        console.error(e)
    }
})





const urgency = new Composer()
urgency.hears('Отмена заявки', async (ctx) => {
    try {
        await ctx.reply('Вы отменили заявку', Markup.removeKeyboard())
        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }
})

urgency.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.problemsDetails = ctx.message.text
        await ctx.replyWithHTML("Укажите срочночть заявки", Markup.keyboard([
            ['Срочно (1-2 часа)', 'В течении дня'],
            ['В течении 2х-3х дней', 'В течении недели'],
            ['Отмена заявки'],

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

        switch (ctx.message.text) {
            case 'Срочно (1-2 часа)':
                break
            case 'В течении дня':
                break
            case 'В течении 2х-3х дней':
                break
            case 'В течении недели':
                break
            case 'Отмена заявки':
                await ctx.reply('Вы отменили заявку', Markup.removeKeyboard())
                return ctx.scene.leave()
            default:
                await ctx.replyWithHTML("Нет такого периода срочности")
                return
        }

        ctx.wizard.state.data.urgency = ctx.message.text

        if (ctx.wizard.state.data.problems == 'ЭЦП') {

            await ctx.replyWithHTML("ФИО и должность врача? ", Markup.keyboard([
                ['Отмена заявки'],
            ]
            ).oneTime().resize())

        } else {
            await ctx.replyWithHTML("Какой у вас кабинет? ", Markup.keyboard([
                ['Отмена заявки'],
            ]
            ).oneTime().resize())
        }



        return ctx.wizard.next()

    } catch (e) {
        console.error(e)
    }
})

const conditionStep = new Composer()
conditionStep.hears('Отмена заявки', async (ctx) => {
    try {
        await ctx.reply('Вы отменили заявку', Markup.removeKeyboard())
        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }
})

conditionStep.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.roomNumber = ctx.message.text
        const wizardData = ctx.wizard.state.data

        let currentDate = new Date();
        let dd = currentDate.getDate();
        let mm = currentDate.getMonth() + 1;
        let yyyy = currentDate.getFullYear();
        let hours = currentDate.getHours()
        let minutes = currentDate.getMinutes()

        let readFile = fs.readFileSync('./db/applications.json', 'utf-8')

        let readFileParse = JSON.parse(readFile)
        let nubberID = parseInt(readFileParse[readFileParse.length - 1].id + 1)

        let answer = (
            `
            ${wizardData.title} 
      Номер кабинета: ${wizardData.roomNumber}       
      Срочность:  ${wizardData.urgency}       
      Отправитель:  ${wizardData.firstName}      
      В чем проблема:   ${wizardData.problems}      
      Описание:   ${wizardData.problemsDetails} 
      id заявки:  ${nubberID}       
        `);

        let answerAdmin = (
            `t.me/${wizardData.userName}
            tg://user?id=${wizardData.userId}`
        );

        answerJSON = {
            'id': nubberID,

            'open': true,

            'application': {
                'department': wizardData.title,
                'roomNumber': wizardData.roomNumber,
                'problems': wizardData.problems,
                'problemsDetails': wizardData.problemsDetails,
                'urgency': wizardData.urgency,
            },

            'customer': {
                'firstName': wizardData.firstName,
                'id': wizardData.userId,
                'nickName': wizardData.userName,
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
                'date': false,

            },

            'applicationDate': {
                'day': dd,
                'month': mm,
                'year': yyyy,
                'hours': hours,
                'minutes': minutes,
                'date': currentDate.toISOString(),
            },
        };




        await botMessage.sendMessage(process.env.applicationChat, answer + answerAdmin, {
            disable_web_page_preview: true
        });

        let all = readFile.substring(0, readFile.length - 1) + ',' + JSON.stringify(answerJSON) + ']';
        fs.writeFileSync('./db/applications.json', all);


        let readCustomer = fs.readFileSync('./db/customer.json', 'utf-8')
        let readCustomerParse = JSON.parse(readCustomer)

        let findCustomer = readCustomerParse.find(readCustomerParse => readCustomerParse.customer.id == wizardData.userId)

        if (findCustomer == undefined) {

            let customer = {
                'customer': {
                    'firstName': wizardData.firstName,
                    'id': wizardData.userId,
                    'nickName': wizardData.userName,
                }
            }
            let newCustomer = readCustomer.substring(0, readCustomer.length - 1) + ',' + JSON.stringify(customer) + ']';
            fs.writeFileSync('./db/customer.json', newCustomer);
        }

        await ctx.reply(answer, Markup.removeKeyboard(), {
            disable_web_page_preview: true
        });

        return ctx.scene.leave()
    } catch (e) {
        console.error(e)
    }


})

const applicationScene = new Scenes.WizardScene('applicationWizard', department, problems, problemsDetails, urgency, roomNumber, conditionStep)
module.exports = applicationScene

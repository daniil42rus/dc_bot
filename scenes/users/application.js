const { Markup, Composer, Scenes } = require('telegraf')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const botMessage = new TelegramBot(process.env.BOT_TOKEN);
const fetch = require('node-fetch');

const express = require("express");
const multer = require("multer");

const fs = require('fs');
const { Console } = require('console');

const { connect } = require('../../functions/connectDb');


const adminsList = async () => {
    const db = await connect()
    if (typeof db == 'undefined') {
        console.log('Admins undefined');
        throw new Error("Нет соединения");

    } else {
        console.log(('link Admins'));
        const admins = db.collection("customer");
        // const results = await admins.find().toArray();
        // let find = results.filter(results => results.id  == 511869236)
        const results = await admins.findOne({ 'id': 511869236 });

        // results.forEach(element => {

        //     console.log(element.customer.id);
        //     if (511869236 == element.customer.id) {
        //         console.log(true);
        //     }

        // });

        // console.log(parseInt(results[results.length - 1].id));
        // console.log(results);
        if (results == null) {
            console.log('отстой');
        } else {
            // console.log(results);
        }
    }
}
// adminsList();




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
            case 'Дарвина':
            case '1 поликлиника':
            case '2 поликлиника':
            case '3 поликлиника':
            case '4 поликлиника':
            case '10 поликлиника':
            case 'Женская консультация':
            case 'ТП':
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

urgency.on('photo', async (ctx) => {
    try {
        ctx.wizard.state.data.problemsDetails = ctx.message.text



        let file_id = ctx.message.photo[ctx.message.photo.length - 1]?.file_id;
        console.log(file_id);
        const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`);
        const body = await response.json()
        const fileLink = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${body.result.file_path}`
        // const file_path = body.result.file_path;
        // const urljpg = await fetch(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`);

        ctx.wizard.state.data.problemsDetailsPhoto = fileLink





        function saveImg(blob) {
            let link = document.createElement("a");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", `${Date.now()}`);
            link.click();
        }

        fetch(fileLink)
            .then(response_object => response_object.blob())
            .then(blob_object => saveImg(blob_object))




        ctx.reply(fileLink)

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

        const db = await connect();
        const applications = db.collection("applications");
        const customer = db.collection("customer");

        const applicationsArr = await applications.find().toArray();
 
        let nubberID = parseInt(applicationsArr[applicationsArr.length - 1].id + 1)


        let answer = (
            `
            ${wizardData.title} 
      Номер кабинета: ${wizardData.roomNumber}       
      Срочность:  ${wizardData.urgency}       
      Отправитель:  ${wizardData.firstName}      
      В чем проблема:   ${wizardData.problems}      
      Описание:   ${wizardData.problemsDetails} 
      PhotoLink:   ${wizardData.problemsDetailsPhoto} 

      id заявки:  ${nubberID}       
        `);

        let answerAdmin = (
            `t.me/${wizardData.userName}
            tg://user?id=${wizardData.userId}`
        );

        answerJSON = {
            id: nubberID,

            open: true,

            application: {
                department: wizardData.title,
                roomNumber: wizardData.roomNumber,
                problems: wizardData.problems,
                problemsDetails: wizardData.problemsDetails,
                PhotoLink: wizardData.problemsDetailsPhoto,

                urgency: wizardData.urgency,
            },

            customer: {
                firstName: wizardData.firstName,
                id: wizardData.userId,
                nickName: wizardData.userName,
            },

            executor: {
                name: false,
                id: false,
                nickName: false,
            },

            closed: {
                day: false,
                month: false,
                year: false,
                hours: false,
                minutes: false,
                date: false,

            },

            applicationDate: {
                day: dd,
                month: mm,
                year: yyyy,
                hours: hours,
                minutes: minutes,
                date: currentDate.toISOString(),
            },
        };

        let customerJson = {
            firstName: wizardData.firstName,
            id: wizardData.userId,
            nickName: wizardData.userName,
        };

        await botMessage.sendMessage(process.env.applicationChat, answer + answerAdmin, {
            disable_web_page_preview: true
        });

        if (typeof db == undefined) {
            console.log('Admins undefined');
            throw new Error("Нет соединения");
        } else {
            
            //положить заявку в БД

            await applications.insertOne(answerJSON);
            console.log('Заявка добавленна в БД');

            const results = await customer.findOne({ 'id': parseInt(wizardData.userId) });
            if (results == null) {
                customer.insertOne(customerJson);
                console.log('Полдьзователь добавлен в БД');
            } else {
                console.log('Полдьзователь имеется в БД');
            }
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

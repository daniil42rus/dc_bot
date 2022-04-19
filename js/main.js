const container = document.getElementById('container')

const pageParams = new URLSearchParams(window.location.search);
let pageId = pageParams.get('page')

function createMenu() {
    let nav = document.createElement('nav')
    let all = document.createElement('a')
    let open = document.createElement('a')
    let closed = document.createElement('a')

    all.textContent = 'Все заявки'
    open.textContent = 'Открытые заявки'
    closed.textContent = 'Закрытые заявки'

    all.classList.add('nav__link')
    open.classList.add('nav__link')
    closed.classList.add('nav__link')

    all.href = window.location.origin + '?page=' + all.textContent
    open.href = window.location.origin + '?page=' + open.textContent
    closed.href = window.location.origin + '?page=' + closed.textContent

    nav.append(all)
    nav.append(open)
    nav.append(closed)

    container.append(nav)
}


async function createExecutorNav() {
    let nav = document.createElement('nav')
    let executors = await getExecutors()

    executors.forEach(element => {
        let item = createExecutorMenu(element)
        nav.append(item)

    });

    container.append(nav)
    return nav

}

function createExecutorMenu(executor) {
    let person = document.createElement('a')
    person.classList.add('nav__executors', 'nav__link')
    person.textContent = executor.name
    person.href = 'executors.html?executor=' + executor.name
    return person
}


async function getApplications() {
    let response = await fetch('db/applications.json');
    let applications = await response.json();
    return applications
}

async function getExecutors() {
    let response = await fetch('db/executors.json');
    let executors = await response.json();


    return executors
}




function createList() {
    let list = document.createElement('ul')

    let item = document.createElement('li')
    let id = document.createElement('span')
    // let open = document.createElement('span')
    let urgency = document.createElement('span')
    let department = document.createElement('span')
    let roomNumber = document.createElement('span')
    let problems = document.createElement('span')
    let problemsDetails = document.createElement('span')
    let customer = document.createElement('span')
    let executor = document.createElement('span')
    let applicationDate = document.createElement('span')
    let closed = document.createElement('span')

    item.classList.add('list-group-item', 'justify-content-between', 'align-items-center')
    list.classList.add('list-group')


    item.id = 'item'
    id.id = 'id'
    // open.id = 'open'
    urgency.id = 'urgency'
    department.id = 'department'
    roomNumber.id = 'roomNumber'
    problems.id = 'problems'
    problemsDetails.id = 'problemsDetails'
    customer.id = 'customer'
    executor.id = 'executor'
    applicationDate.id = 'applicationDate'
    closed.id = 'closed'


    id.textContent = 'ID'
    // open.textContent = 'Состояние'
    urgency.textContent = 'Срочность'
    department.textContent = 'Подразделение'
    roomNumber.textContent = 'Кабинет'
    problems.textContent = 'Проблема'
    problemsDetails.textContent = 'Подробнее'
    customer.textContent = 'Клиент'
    executor.textContent = 'Исполнитель'
    applicationDate.textContent = 'Дата создания'
    closed.textContent = 'Дата закрытия'

    item.append(id)
    // item.append(open)
    item.append(urgency)
    item.append(department)
    item.append(roomNumber)
    item.append(problems)
    item.append(problemsDetails)
    item.append(customer)
    item.append(executor)
    item.append(applicationDate)
    item.append(closed)
    list.append(item)

    return list
}

function createItems(element) {
    let item = document.createElement('li')
    let id = document.createElement('span')
    // let open = document.createElement('span')
    let urgency = document.createElement('span')
    let department = document.createElement('span')
    let roomNumber = document.createElement('span')
    let problems = document.createElement('span')
    let problemsDetails = document.createElement('span')
    let customer = document.createElement('span')
    let executor = document.createElement('span')
    let applicationDate = document.createElement('span')
    let closed = document.createElement('span')



    item.classList.add('list-group-item', 'justify-content-between', 'align-items-center');


    if (element.application.urgency === 'Срочно (1-2 часа)') {
        let date = new Date(element.applicationDate.date)
        let deadline = date.getHours() + 2
        if (date.getHours() < deadline) {
            item.classList.add('deadline')
        }
    }

    if (element.application.urgency === 'В течении дня') {
        let date = new Date(element.applicationDate.date)
        let deadline = new Date();

        if (date.toLocaleDateString() < deadline.toLocaleDateString()) {
            item.classList.add('deadline')
        }
    }

    if (element.application.urgency === 'В течении 2х-3х дней') {
        let date = new Date(element.applicationDate.date)
        let deadline = new Date(date);
        let nowDate = new Date()
        deadline.setDate(date.getDate() + 3)
        if (nowDate.toLocaleDateString() > deadline.toLocaleDateString()) {
            item.classList.add('deadline')
        }
    }

    // "urgency": "В течении недели"

    if (element.application.urgency === 'В течении недели') {
        let date = new Date(element.applicationDate.date)
        let deadline = new Date(date);
        let nowDate = new Date()
        deadline.setDate(date.getDate() + 7)
        if (nowDate.toLocaleDateString() > deadline.toLocaleDateString()) {
            item.classList.add('deadline')
        }
    }






    !element.open ? item.classList.add('closed') : item.classList.remove('closed')

    id.textContent = element.id

    // element.open ? open.textContent = 'Открыта' : open.textContent = 'Закрыта'
    urgency.textContent = element.application.urgency
    department.textContent = element.application.department
    roomNumber.textContent = element.application.roomNumber
    problems.textContent = element.application.problems
    problemsDetails.textContent = element.application.problemsDetails
    customer.textContent = element.customer.firstName
    element.executor.name ? executor.textContent = element.executor.name : executor.textContent = 'Не назначем'


    let CreateApplicationDate = new Date(element.applicationDate.date)

    applicationDate.textContent = `${CreateApplicationDate.toLocaleDateString()} в ${CreateApplicationDate.getHours()}:${CreateApplicationDate.getMinutes()}`



    let closedApplicationDate = new Date(element.closed.date)

    if (element.closed.year) {
        closed.textContent = `${closedApplicationDate.toLocaleDateString()} в ${closedApplicationDate.getHours()}:${closedApplicationDate.getMinutes()}`
    }

    item.append(id)
    // item.append(open)
    item.append(urgency)
    item.append(department)
    item.append(roomNumber)
    item.append(problems)
    item.append(problemsDetails)
    item.append(customer)
    item.append(executor)
    item.append(applicationDate)
    item.append(closed)

    return item
}

async function createTable() {
    let applications = await getApplications()
    let list = createList()
    let div = document.createElement('div')
    let h1 = document.createElement('h1')
    let col = document.createElement('span')


    div.classList.add('table__title')


    container.append(div)
    container.append(list)

    function getTable() {
        applications.forEach(element => {
            if (element.open && pageParams.get("page") == 'Открытые заявки') {
                let item = createItems(element)
                list.append(item)
            }
        });

        applications.forEach(element => {
            if (!element.open && pageParams.get("page") == 'Закрытые заявки') {
                let item = createItems(element)
                list.append(item)
            }
        });

        applications.forEach(element => {
            if (pageParams.get("page") == 'Все заявки') {
                let item = createItems(element)
                list.append(item)
            }
        });

    }
    getTable()



    document.getElementById("id").addEventListener("click", () => {
        applications.sort(function (a, b) {
            if (a.id > b.id) return 1;
            if (a.id < b.id) return -1;
            return 0;
        });
        sorts();
    })

    document.getElementById("urgency").addEventListener("click", () => {
        applications.sort(function (a, b) {
            if (a.application.urgency > b.application.urgency) return 1;
            if (a.application.urgency < b.application.urgency) return -1;
            return 0;
        });
        sorts();
    })
    document.getElementById("department").addEventListener("click", () => {
        applications.sort(function (a, b) {
            if (a.applicationDate.department > b.application.department) return 1;
            if (a.application.department < b.application.department) return -1;
            return 0;
        });
        sorts();
    })
    document.getElementById("applicationDate").addEventListener("click", () => {
        applications.sort(function (a, b) {
            if (a.applicationDate.date > b.applicationDate.date) return 1;
            if (a.applicationDate.date < b.applicationDate.date) return -1;
            return 0;
        });
        sorts();
    })
    document.getElementById("closed").addEventListener("click", () => {
        applications.sort(function (a, b) {
            if (a.closed.date > b.closed.date) return 1;
            if (a.closed.date < b.closed.date) return -1;
            return 0;
        });
        sorts();
    })

    function sorts() {
        let nodeList = document.querySelectorAll('li');
        let parent = nodeList[0].parentNode;
        for (let i = 1; i < nodeList.length; i++) {
            parent.removeChild(nodeList[i])
        }
        getTable()
    }


    let li = document.querySelectorAll('li');

    col.textContent = `Всего показанно ${li.length - 1} шт.`
    h1.textContent = pageId

    div.append(h1)
    div.append(col)




}



document.addEventListener('DOMContentLoaded', async () => {
    createMenu()
    // await createExecutorNav()
    await createTable()
    // console.log(window.location.origin + window.location.search)
    // console.log(window.location.search)
    // console.log(pageParams.get("page"))
})
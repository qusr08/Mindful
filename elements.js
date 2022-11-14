/*

- weekly view of calender (shit fart)

- make image of raspberry pi to send to babe

*/

// https://javascript.plainenglish.io/3-ways-to-store-data-in-the-browser-db11c412104b

'use strict';

let time = document.getElementById("js-time");
let timeSuffix = document.getElementById("js-time-suffix");
let date = document.getElementById("js-date");
let sidebarEvents = document.getElementById("js-sidebar-events");
let sidebarTasks = document.getElementById("js-sidebar-tasks");
let selectedContent = undefined;

let calendar = document.getElementById("js-calendar");
let calendarContent = document.getElementById("js-calendar-content");
let calendarMonth = document.getElementById("js-calendar-month");
let calendarYear = document.getElementById("js-calendar-year");
let selectedCalendarBox = undefined;

let weather = document.getElementById("js-weather");

let profile = document.getElementById("js-profile");
let profileAccountButton = document.getElementById("js-profile-account-button");
let profileGeneralButton = document.getElementById("js-profile-general-button");
let profileDisplayButton = document.getElementById("js-profile-display-button");
let profileConnectionsButton = document.getElementById("js-profile-connections-button");
let profileAccountTab = document.getElementById("js-profile-account");
let profileGeneralTab = document.getElementById("js-profile-general");
let profileDisplayTab = document.getElementById("js-profile-display");
let profileConnectionsTab = document.getElementById("js-profile-connections");
let selectedProfileContent = undefined;
let selectedProfileButton = undefined;

let tasks = document.getElementById("js-tasks");
let tasksContent = document.getElementById("js-tasks-content");

let keyboard = document.getElementById("js-keyboard");
let nameTextBoxParent = document.getElementById("js-keyboard-name");
let dateTextBoxParent = document.getElementById("js-keyboard-date");
let timeTextBoxParent = document.getElementById("js-keyboard-time");
let nameTextBox = document.getElementById("js-keyboard-name-box");
let dateTextBox = document.getElementById("js-keyboard-date-box");
let timeTextBox = document.getElementById("js-keyboard-time-box");
let selectedKeyboardTextBox = undefined;
let isAddingEvent = false;

let now;
let currentMonth = 0;
let currentYear = 0;

let JSONTaskData = {
    '0': {
        'details': 'Fold laundry',
        'isDone': false
    },
    '1': {
        'details': 'Take out trash',
        'isDone': true
    },
    '2': {
        'details': 'Vacuum downstairs',
        'isDone': true
    }
}

let JSONEventData = {
    '2022': {
        '11': {
            '14': {
                '0': {
                    'time': '9:00AM',
                    'details': 'Breakfast',
                    'color': 'red'
                },
                '1': {
                    'time': '12:00PM',
                    'details': 'Lunch',
                    'color': 'pink'
                },
                '2': {
                    'time': '7:00PM',
                    'details': 'Dinner',
                    'color': 'yellow'
                }
            },
            '26': {
                '0': {
                    'time': '9:00AM',
                    'details': 'breakfastkiwahwdoiuahewfosehfoaeshfaiuwhdaiuwhdiuawd',
                    'color': 'green'
                },
                '1': {
                    'time': '5:00PM',
                    'details': 'Meeting',
                    'color': 'lightblue'
                }
            }
        }
    }
}

window.onload = function(event) {
    // Update the current date and time every second
    refreshDateTime();
    setInterval(refreshDateTime, 1000);

    // Set the month to the current month
    setCalendar(now.getMonth(), now.getFullYear());

    updateTasks();
}

function refreshDateTime() {
    now = new Date();

    time.innerHTML = `${now.toLocaleTimeString('en-us', { timeStyle: "short" }).slice(0, -3)}`;
    timeSuffix.innerHTML = `${now.toLocaleTimeString('en-us', { timeStyle: "short" }).slice(-2)}`;
    date.innerHTML = `${now.toLocaleDateString("en-us", { dateStyle: "full" }).split(",").splice(0, 1) + ", " + now.toLocaleDateString("en-us", { dateStyle: "medium" }).split(",").splice(0, 1)}`;
}

function setCalendar(month, year) {
    currentMonth = month;
    currentYear = year;

    // Remove all calendar boxes
    while (calendarContent.firstChild) {
        calendarContent.removeChild(calendarContent.firstChild);
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date

    // Calculate the number of days in the month
    // https://bobbyhadz.com/blog/javascript-get-number-of-days-in-month
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    // Calculate the month of the week that the first day of the month starts on
    let dayOfTheWeek = new Date(year, month, 1).getDay();
    // Get the name of the month
    // https://stackoverflow.com/questions/1643320/get-month-name-from-date/18648314#18648314
    let monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

    // Set the title of the calendar to the right month and year
    calendarMonth.innerHTML = `${monthName}`;
    calendarYear.innerHTML = `${year}`;

    // Make dummy elements to offset the start of the month
    for (let i = 0; i < dayOfTheWeek; i++) {
        calendarContent.appendChild(document.createElement("div"));
    }

    // Make all calendar boxes
    for (let i = 0; i < daysInMonth; i++) {
        let calendarBox = document.createElement("div");
        calendarBox.classList.add("calendar-box");
        calendarBox.onclick = () => { selectDay(calendarBox, i + 1, month + 1, year); };

        // If the calendar box is today
        // ... select the calendar box
        if (now.getDate() - 1 == i && now.getMonth() == month && now.getFullYear() == year) {
            selectDay(calendarBox, i + 1, month + 1, year);
        }

        // Load calendar box events
        let eventHTML = `<div class="calendar-box-events">`;
        let eventData = undefined;
        try {
            eventData = JSONEventData[String(year)][String(month + 1)][String(i + 1)];
            if (eventData != undefined) {
                // https://stackoverflow.com/questions/29032525/how-to-access-first-element-of-json-object-array
                let eventCount = 0;
                let event = undefined;
                while ((event = eventData[String(eventCount)]) != undefined) {
                    eventHTML += `<span style="color: ${event.color};">●</span>`;
                    eventCount++;
                }
            }
        } catch {}
        eventHTML += `</div>`;
        calendarBox.innerHTML = `<span>${i + 1}</span>${eventHTML}`;

        calendarContent.appendChild(calendarBox);
    }
}

function goToNextMonth() {
    let newMonth = (currentMonth + 1) % 12;
    let newYear = currentYear + Number(currentMonth == 11);

    setCalendar(newMonth, newYear);
}

function goToPreviousMonth() {
    // let newMonth = (currentMonth - 1) % 12;
    let newMonth = (currentMonth == 0 ? 11 : currentMonth - 1);
    let newYear = currentYear - Number(currentMonth == 0);

    setCalendar(newMonth, newYear);
}

function selectDay(calendarBox, day, month, year) {
    // Set the input calendar box as selected
    if (selectedCalendarBox != undefined) {
        selectedCalendarBox.classList.remove("selected");
    }
    selectedCalendarBox = calendarBox;
    calendarBox.classList.add("selected");

    // Load the events into the calendar events section
    let eventData = undefined;
    sidebarEvents.innerHTML = "";
    try {
        eventData = JSONEventData[String(year)][String(month)][String(day)];
        if (eventData != undefined) {
            // https://stackoverflow.com/questions/29032525/how-to-access-first-element-of-json-object-array
            let eventCount = 0;
            let event = undefined;
            while ((event = eventData[String(eventCount)]) != undefined) {
                sidebarEvents.innerHTML += `
                    <div class="calendar-event">
                        <span class="calendar-event-color" style="color: ${event.color};">●</span>
                        <span class="calendar-event-time">${event.time}</span>
                        <span class="calendar-event-details">${event.details}</span>
                    </div>
                `;
                eventCount++;
            }

            return;
        }
    } catch {}

    sidebarEvents.innerHTML = `
        <div class="calendar-event">
                <span class="calendar-event-details">No events!</span>
        </div>
    `;
}

function updateTasks() {
    sidebarTasks.innerHTML = "";
    tasksContent.innerHTML = `<span class="tasks-title">To-Do List</span>`;

    // https://stackoverflow.com/questions/29032525/how-to-access-first-element-of-json-object-array
    let taskCount = 0;
    let task = undefined;
    while ((task = JSONTaskData[String(taskCount)]) != undefined) {
        let newTask = `
            <div class="task">
                <span class="task-bullet ${task.isDone ? 'done' : ''}">○</span>
                <span class="task-details ${task.isDone ? 'done' : ''}">${task.details}</span>
            </div>
        `;

        if (!task.isDone) {
            sidebarTasks.innerHTML += newTask;
        }
        tasksContent.innerHTML += newTask;

        taskCount++;
    }

    if (taskCount == 0) {
        let noTasks = `
            <div class="task">
                <span class="task-details">No tasks!</span>
            </div>
        `;

        sidebarTasks.innerHTML = noTasks;
        tasksContent.innerHTML = noTasks;
    }
}

function clickCalendarButton() {
    setCalendar(now.getMonth(), now.getFullYear());
    selectContent(calendar);
}

function clickTasksButton() {
    selectContent(tasks);
}

function clickHomeButton() {
    setCalendar(now.getMonth(), now.getFullYear());
    selectContent(undefined);
}

function clickWeatherButton() {
    selectContent(weather);
}

function clickProfileButton() {
    selectContent(profile);
    selectProfileContent(profileAccountButton, profileAccountTab);
}

function clickAddEventButton() {
    keyboard.classList.add("shown");
    keyboard.classList.remove("hidden");

    nameTextBoxParent.classList.add("shown");
    dateTextBoxParent.classList.add("shown");
    timeTextBoxParent.classList.add("shown");

    isAddingEvent = true;
}

function clickAddTaskButton() {
    keyboard.classList.add("shown");
    keyboard.classList.remove("hidden");

    nameTextBoxParent.classList.add("shown");
    dateTextBoxParent.classList.add("hidden");
    timeTextBoxParent.classList.add("hidden");

    isAddingEvent = false;
}

function clickKeyboardButton(key) {
    if (selectedKeyboardTextBox != undefined) {
        if (key == 'backspace') {
            selectedKeyboardTextBox.innerHTML = selectedKeyboardTextBox.innerHTML.slice(0, -1);
        } else {
            selectedKeyboardTextBox.innerHTML += key;
        }
    }
}

function clickKeyboardCancelButton() {
    keyboard.classList.add("hidden");
    keyboard.classList.remove("shown");

    nameTextBox.innerHTML = "";
    dateTextBox.innerHTML = "";
    timeTextBox.innerHTML = "";

    selectKeyboardTextBox(undefined);
}

function clickKeyboardSubmitButton() {
    if (isAddingEvent) {
        let dateArray = dateTextBox.innerHTML.split("/");
        let newEventObject = {};
        newEventObject['time'] = `${timeTextBox.innerHTML}`;
        newEventObject['details'] = `${nameTextBox.innerHTML}`;
        newEventObject['color'] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        console.log(newEventObject);

        if (JSONEventData[dateArray[2]] == undefined) {
            JSONEventData[dateArray[2]] = {};
        }

        if (JSONEventData[dateArray[2]][dateArray[0]] == undefined) {
            JSONEventData[dateArray[2]][dateArray[0]] = {};
        }

        if (JSONEventData[dateArray[2]][dateArray[0]][dateArray[1]] == undefined) {
            JSONEventData[dateArray[2]][dateArray[0]][dateArray[1]] = {};
        }

        let newEventIndex = Object.keys(JSONEventData[dateArray[2]][dateArray[0]][dateArray[1]]).length;
        JSONEventData[dateArray[2]][dateArray[0]][dateArray[1]][`${newEventIndex}`] = newEventObject;

        setCalendar(now.getMonth(), now.getFullYear());
    } else {
        let newTaskIndex = Object.keys(JSONTaskData).length;
        let newTaskObject = {};
        newTaskObject['details'] = `${nameTextBox.innerHTML}`;
        newTaskObject['isDone'] = false;

        JSONTaskData[`${newTaskIndex}`] = newTaskObject;

        updateTasks();
    }

    clickKeyboardCancelButton();
}

function selectKeyboardTextBox(element) {
    if (selectedKeyboardTextBox != undefined) {
        selectedKeyboardTextBox.classList.remove("selected");
    }

    if (element != undefined) {
        element.classList.add("selected");
    }

    selectedKeyboardTextBox = element;
}

function selectProfileContent(button, element) {
    if (selectedProfileContent != undefined) {
        selectedProfileContent.classList.add("hidden");
        selectedProfileContent.classList.remove("shown");
    }

    if (element != undefined) {
        element.classList.add("shown");
        element.classList.remove("hidden");
    }

    if (selectedProfileButton != undefined) {
        selectedProfileButton.classList.remove("selected");
    }

    if (button != undefined) {
        button.classList.add("selected");
    }

    selectedProfileContent = element;
    selectedProfileButton = button;
}

function selectContent(element) {
    if (selectedContent != undefined) {
        selectedContent.classList.add("hidden");
        selectedContent.classList.remove("shown");
    }

    if (element != undefined) {
        element.classList.add("shown");
        element.classList.remove("hidden");
    }

    selectedContent = element;
}

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
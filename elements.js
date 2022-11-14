/*

- on screen keyboard functionality
- selecting text boxes and having keyboard type into them
- adding events to calendar
- adding tasks
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
        'isDone': false
    },
    '2': {
        'details': 'Vacuum downstairs',
        'isDone': false
    },
    '3': {
        'details': 'Walk dog',
        'isDone': true
    },
    '4': {
        'details': 'Organize closet',
        'isDone': true
    }
}

let JSONEventData = {
    '2022': {
        'november': {
            '14': {
                '0': {
                    'time': '9:00AM - 10:00AM',
                    'details': 'Breakfast',
                    'color': 'red'
                },
                '1': {
                    'time': '12:00PM - 1:00PM',
                    'details': 'Lunch',
                    'color': 'pink'
                },
                '2': {
                    'time': '7:00PM - 8:00PM',
                    'details': 'Dinner',
                    'color': 'yellow'
                }
            },
            '27': {
                '0': {
                    'time': '9:00AM - 10:00AM',
                    'details': 'breakfastkiwahwdoiuahewfosehfoaeshfaiuwhdaiuwhdiuawd',
                    'color': 'green'
                },
                '1': {
                    'time': '5:00PM - 9:00PM',
                    'details': 'Meeting',
                    'color': 'lightblue'
                }
            }
        },
        'december': {
            '3': {
                '0': {
                    'time': '9:00AM - 10:00AM',
                    'details': 'this is an event',
                    'color': 'gold'
                }
            }
        }
    },
    '2025': {
        'august': {
            '4': {
                '0': {
                    'time': 'all day',
                    'details': 'birtbay :)',
                    'color': 'gray'
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
        calendarBox.onclick = () => { selectDay(calendarBox, i + 1, monthName, year); };

        // If the calendar box is today
        // ... select the calendar box
        if (now.getDate() - 1 == i && now.getMonth() == month && now.getFullYear() == year) {
            selectDay(calendarBox, i + 1, monthName, year);
        }

        // Load calendar box events
        let eventHTML = `<div class="calendar-box-events">`;
        let eventData = undefined;
        try {
            eventData = JSONEventData[String(year)][monthName.toLowerCase()][String(i + 1)];
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

function selectDay(calendarBox, day, monthName, year) {
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
        eventData = JSONEventData[String(year)][monthName.toLowerCase()][String(day)];
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
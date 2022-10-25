/*

TO DO

# Calendar / Calendar Events
* [X] Shifting calendar days based on days of the week
* [ ] Store data about events saved to calendar
* [ ] Selecting day of the week and displaying the events for that day
* [X] Cycle through months and update day positions
* [ ] Display dots on days for events
* [X] Make proper calendar layout

+ [ ] Adding a new event

- [ ] Highlight 'today' on the calendar
- [ ] Cycle through events on a day automatically if there are more than 3

*/

// https://javascript.plainenglish.io/3-ways-to-store-data-in-the-browser-db11c412104b

'use strict';

let today = new Date();

let calendarElement = document.getElementById("js-calendar");
let calendarTitleElement = document.getElementById("js-calendar-title");

let currentMonth = 0;
let currentYear = 0;

let JSONEventData = {
    '2022': {
        'october': {
            '25': {
                '0': {
                    'time': '9:00am-10:00am',
                    'details': 'this is an event',
                    'color': 'red'
                },
                '1': {
                    'time': '9:00am-10:00am',
                    'details': 'this is an event',
                    'color': 'pink'
                },
                '2': {
                    'time': '9:00am-10:00am',
                    'details': 'this is an event',
                    'color': 'yellow'
                }
            }
        },
        'november': {
            '3': {
                '0': {
                    'time': '9:00am-10:00am',
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
    // Set the month to the current month
    setCalendar(today.getMonth(), today.getFullYear());
}

function setCalendar(month, year) {
    currentMonth = month;
    currentYear = year;

    // Remove all calendar boxes
    while (calendarElement.firstChild) {
        calendarElement.removeChild(calendarElement.firstChild);
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
    calendarTitleElement.innerHTML = `${monthName} ${year}`;

    // Make dummy elements to offset the start of the month
    for (let i = 0; i < dayOfTheWeek; i++) {
        calendarElement.appendChild(document.createElement("div"));
    }

    // Make all calendar boxes
    for (let i = 0; i < daysInMonth; i++) {
        let calendarBox = document.createElement("div");
        calendarBox.classList.add("calendar-box");

        // Load calendar box events
        let eventHTML = `<div class="calendar-box-events">`;
        let eventData = undefined;
        try {
            eventData = JSONEventData[String(year)][monthName.toLowerCase()][String(i + 1)];

            if (eventData != undefined) {
                // https://stackoverflow.com/questions/29032525/how-to-access-first-element-of-json-object-array
                let eventCount = 0;
                while (eventData[String(eventCount)] != undefined) {
                    eventHTML += `<span style="color: ${eventData[String(eventCount)].color};">●</span>`;
                    eventCount++;
                }
            }
        } catch {}
        eventHTML += `</div>`;
        calendarBox.innerHTML = `<span>${i + 1}</span>${eventHTML}`;

        calendarElement.appendChild(calendarBox);
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
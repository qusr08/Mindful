/*

TO DO

# Calendar / Calendar Events
* [ ] Shifting calendar days based on days of the week
* [ ] Store data about events saved to calendar
* [ ] Selecting day of the week and displaying the events for that day
* [ ] Cycle through months and update day positions
* [ ] Display dots on days for events
* [ ] Make proper calendar layout

+ [ ] Adding a new event

- [ ] Highlight 'today' on the calendar
- [ ] Cycle through events on a day automatically if there are more than 3

*/


// https://bobbyhadz.com/blog/javascript-get-number-of-days-in-month
// https://artofmemory.com/blog/how-to-calculate-the-day-of-the-week/

window.customElements.define('c-calendar', class extends HTMLElement {
    constructor() {
        super();

        this.DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    }

    connectedCallback() {
        for (let i = 0; i < 7; i++) {
            let calendarDay = document.createElement("div");
            calendarDay.classList.add("calendar-day");
            calendarDay.innerHTML = `${this.DAYS[i]}`;

            this.appendChild(calendarDay);
        }

        for (let i = 0; i < 40; i++) {
            let calendarBox = document.createElement("div");
            calendarBox.classList.add("calendar-box");
            calendarBox.innerHTML = `${i + 1}`;

            this.appendChild(calendarBox);
        }
    }
});

window.customElements.define('c-reminders', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

    }
});

window.customElements.define('c-todo', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

    }
});
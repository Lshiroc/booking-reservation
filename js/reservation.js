export class Reservation {
    constructor() {
        console.log("constructed object");
        document.querySelector('#nextBtn').addEventListener('click', this.next);
    }

    // Load the required data
    load(staffs, services, dates, time) {
        this.staffs = staffs;
        this.services = services;
        this.dates = dates;
        this.time = time;
        console.log("loaded data");
    }

    /*
        Visually smooth even when called multiple times 
        by the user.
    */
    giveWarning(text) {
        let infoBox = document.querySelector('.info');
        if(infoBox.style.animationPlayState == "paused" || infoBox.style.animationPlayState == "") {
            let infoText = document.querySelector('.info-text');
            infoBox.style.animationPlayState = "running";
            infoText.innerText = text;
            setTimeout(this.removeWarning, 3000);
        }
    }

    removeWarning() {
        let infoBox = document.querySelector('.info');
        infoBox.style.animationPlayState = "paused";
    }

    start() {
        // Display staff
        this.stage = 1;
        let container = document.querySelector('#optionsContainer');
        this.staffs.forEach(staff => {
            container.innerHTML += 
                `<div data-id='${staff.id}' class="option">
                    <div class="option-img">
                        <img src="./images/${staff.image}" alt="${staff.name}" />
                    </div>
                    <div class="option-title">${staff.name}</div>
                    <div class="option-description">${staff.email}</div>
                </div>`;
        });

        let options = [...container.children];
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.staffSelected = option.getAttribute("data-id");
                this.service();
            });
        });
    }

    service() {
        this.stage = 2;
        let container = document.querySelector('#optionsContainer');
        container.innerHTML = '';
        this.services.forEach(service => {
            container.innerHTML += 
            `
            <div data-id='${service.id}' class="option service">
                <div class="option-img">
                    <img src="./images/${service.image}" alt="${service.name}" />
                </div>
                <div class="option-title">${service.name}</div>
                <div class="option-description">${service.duration}</div>
                <div class="option-price">${service.price}$</div>
            </div>
            `;
        })

        let options = [...container.children];
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.serviceSelected = option.getAttribute("data-id");
                this.date();
            });
        })
    }

    date() {
        this.stage = 3;
        document.querySelector('#optionsContainer').innerHTML = '';
        let dateContainer = document.querySelector('#dateContainer');
        dateContainer.style.display = 'grid';
        let currentDate = new Date();
        updateCalendar(currentDate.getFullYear(), currentDate.getMonth());

        document.querySelector('#nextDate').addEventListener('click', () => {
            updateCalendar(2024, 2);
        })

        function updateCalendar(year, month) {
            // Check which weekday is the first day of current month
            let startWeekday = new Date(year, month, 1).getDay();
            let maxDays = new Date(year, month+1, 0).getDate();
            let daysContainer = document.querySelector("#daysContainer");
            let j = 1;
            daysContainer.innerHTML = '';
            for(let i = 0; i < startWeekday + maxDays; i++) {
                if(i < startWeekday || j > maxDays) {
                    daysContainer.innerHTML += 
                    `
                    <div></div>
                    `;
                } else {
                    daysContainer.innerHTML += 
                    `
                    <div class="day">${j}</div>
                    `;
                    j++;
                }
            }
        }
    }

    next = () => {
        if((this.stage == 1 && this.staffSelected) || (this.stage == 2 && this.serviceSelected)) {
            this.removeWarning();
        } else if(this.stage == 1 && !this.staffSelected) {
            this.giveWarning("SELECT STAFF")
        } else if(this.stage == 2 && !this.serviceSelected) {
            this.giveWarning('SELECT SERVICE')
        }
    }
}
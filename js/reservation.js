export class Reservation {
    constructor() {
        console.log("constructed object");
        document.querySelector('#nextBtn').addEventListener('click', this.next);
        this.currentDate = new Date();
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
                this.datePick();
            });
        })
    }

    datePick() {
        this.stage = 3;
        document.querySelector('#optionsContainer').innerHTML = '';
        let dateContainer = document.querySelector('#dateContainer');
        dateContainer.style.display = 'grid';
        updateCalendar(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate, this.dates);
        
        document.querySelector('#nextDate').addEventListener('click', () => {
            let month = parseInt(dateLabel.getAttribute('data-month'));
            let year = parseInt(dateLabel.getAttribute('data-year'));
            if(month > 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
            this.currentDate = new Date(year, month, 1);
            updateCalendar(year, month, this.currentDate, this.dates);
        })

        document.querySelector('#backDate').addEventListener('click', () => {
            let month = parseInt(dateLabel.getAttribute('data-month'));
            let year = parseInt(dateLabel.getAttribute('data-year'));
            if(month <= 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
            this.currentDate = new Date(year, month, 1);
            updateCalendar(year, month, this.currentDate, this.dates);
        })

        function updateCalendar(year, month, currentDate, dates) {
            // Check which weekday is the first day of current month
            let dateLabel = document.querySelector('#dateLabel')
            dateLabel.setAttribute('data-year', currentDate.getFullYear());
            dateLabel.setAttribute('data-month', currentDate.getMonth());
            dateLabel.innerText = currentDate.toLocaleString("en-US", {month: 'long'}) +  " " + currentDate.getFullYear();
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
                    let formattedDate = [currentDate.getFullYear(), String(currentDate.getMonth()+1).padStart(2, '0'), String(j).padStart(2, '0')].join('-');
                    let day = document.createElement('div');
                    day.classList.add('day');
                    if(dates.includes(formattedDate)) {
                        day.classList.add('active')
                    }
                    
                    day.innerText = j;
                    day.addEventListener('click', (e) => {
                        if(e.target.classList.contains('active')) {
                            let alreadySelected = document.querySelector('.day.selected');
                            if(alreadySelected && alreadySelected != e.target) {
                                alreadySelected.classList.remove('selected');
                            }
                            e.target.classList.toggle('selected');
                        }
                    })
                    daysContainer.append(day);
                    j++;
                }
            }
        }

        function chooseDate() {
            
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
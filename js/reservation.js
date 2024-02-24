export class Reservation {
    constructor() {
        document.querySelector('#nextBtn').addEventListener('click', this.next);
        document.querySelector('#backBtn').addEventListener('click', this.back);
        this.currentDate = new Date();
        this.dateTimeSelected = {date: null, time: null};
    }

    // Load the required data
    load(staffs, services, dates, time) {
        this.staffs = staffs;
        this.services = services;
        this.dates = dates;
        this.times = time;
        this.stage = 1;
        this.stageChange(1);
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

    /*
    stage 1 = Staff
    stage 2 = Service
    stage 3 = Date & Time
    stage 4 = Connfirmation
    */

    stageChange(stage) {
        this.stage = stage;
        switch(stage) {
            case 1:
                this.chooseStaff();
                break;
            case 2:
                this.service();
                break;
            case 3:
                this.datePick();
                break;
            case 4:
                this.confirmation();
                break;
        }
    }

    // Stage 1
    chooseStaff() {
        this.stage = 1;
        let container = document.querySelector('#optionsContainer');
        container.innerHTML = '';
        document.querySelector('#dateContainer').style.display = 'none';
        this.staffs.forEach(staff => {
            container.innerHTML += 
                `<div data-id='${staff.id}' class="option ${this.staffSelected == staff.id && 'selected'}">
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
                this.serviceSelected = null;
                this.dateTimeSelected = {};
                document.querySelector('#daysContainer').removeAttribute('data-date');
                this.stageChange(2);
            });
        });
    }

    // Stage 2
    service() {
        this.stage = 2;
        let container = document.querySelector('#optionsContainer');
        container.innerHTML = '';
        document.querySelector('#dateContainer').style.display = 'none';
        this.services.forEach(service => {
            container.innerHTML += 
            `
            <div data-id='${service.id}' class="option service ${this.serviceSelected == service.id && 'selected'}">
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
                this.dateTimeSelected = {};
                document.querySelector('#daysContainer').removeAttribute('data-date');
                this.stageChange(3);
            });
        })
    }

    // Stage 3
    datePick() {
        this.stage = 3;
        document.querySelector('#optionsContainer').innerHTML = '';
        let dateContainer = document.querySelector('#dateContainer');
        dateContainer.style.display = 'grid';
        this.updateCalendar(this.currentDate.getFullYear(), this.currentDate.getMonth());

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
            this.updateCalendar(year, month);
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
            this.updateCalendar(year, month);
        })
    }

    updateCalendar(year, month) {
        console.log("updateing...")
        // Check which weekday is the first day of current month
        let dateLabel = document.querySelector('#dateLabel');
        let timesContainer = document.querySelector('#timesContainer');
        dateLabel.setAttribute('data-year', this.currentDate.getFullYear());
        dateLabel.setAttribute('data-month', this.currentDate.getMonth());
        dateLabel.innerText = this.currentDate.toLocaleString("en-US", {month: 'long'}) +  " " + this.currentDate.getFullYear();
        let startWeekday = new Date(year, month, 1).getDay();
        let maxDays = new Date(year, month+1, 0).getDate();
        let daysContainer = document.querySelector("#daysContainer");
        daysContainer.setAttribute('data-date', year + "-" + String(month).padStart(2, '0'));
        let j = 1;
        daysContainer.innerHTML = '';
        for(let i = 0; i < startWeekday + maxDays; i++) {
            if(i < startWeekday || j > maxDays) {
                daysContainer.innerHTML += 
                `
                <div></div>
                `;
            } else {
                let formattedDate = [this.currentDate.getFullYear(), String(this.currentDate.getMonth()+1).padStart(2, '0'), String(j).padStart(2, '0')].join('-');
                let day = document.createElement('div');
                day.classList.add('day');
                if(this.dates.includes(formattedDate)) {
                    day.classList.add('active')
                }
                
                day.innerText = j;
                if(day.classList.contains('active')) {
                    let fullDate = daysContainer.getAttribute('data-date') + "-" + String(j).padStart(2, "0");
                    let timeLabel = document.querySelector('#timeLabel');
                    
                    day.addEventListener('click', (e) => {
                        let alreadySelected = document.querySelector('.day.selected');
                        this.dateTimeSelected['date'] = fullDate;

                        if(alreadySelected && alreadySelected != e.target) {
                            alreadySelected.classList.remove('selected');
                            timeLabel.innerText = "Select date";
                            timesContainer.innerHTML = '';
                        }
                        if(e.target.classList.contains('selected')) {
                            timesContainer.innerHTML = '';
                            timeLabel.innerText = "Select date";
                            e.target.classList.remove('selected');
                        } else {
                            e.target.classList.add('selected');
                            timeLabel.innerText = [year, String(month).padStart(2, '0'), String(e.target.innerText).padStart(2, '0')].join('-');
                            this.times.forEach(time => {
                                let timeItem = document.createElement('div');
                                timeItem.classList.add('time');
                                timeItem.innerHTML = `${time.start_time}<br/>${time.end_time}`;
                                timeItem.addEventListener('click', () => {
                                    this.dateTimeSelected['time'] = `${time.start_time} ${time.end_time}`;
                                    this.stageChange(4);
                                })
                                timeItem.setAttribute('data-time', `${time.start_time} ${time.end_time}`);
                                timesContainer.append(timeItem);
                            })
                        }
                    })
                    let checkTimeItem = document.querySelector(`[data-time="${this.dateTimeSelected['time']}"]`);
                    if(this.dateTimeSelected['date'] == fullDate && checkTimeItem) {
                        console.log("ehememe")
                        day.classList.add('selected');
                        checkTimeItem.classList.add('selected');
                    } else if(!this.dateTimeSelected['date'] || !this.dateTimeSelected['time']) {
                        timesContainer.innerHTML = '';
                        timeLabel.innerText = 'Select date';
                    }
                }
                daysContainer.append(day);
                j++;
            }
        }
    }

    // Stage 4
    confirmation() {
        this.stage = 4;
        console.log("stage 4...");
        document.querySelector('#dateContainer').style.display = 'none';
    }

    next = () => {
        switch(this.stage){
            case 1:
                if(!this.staffSelected) {
                    this.giveWarning("Select staff");
                } else {
                    this.removeWarning();
                    this.stageChange(2);
                }
                break;
            case 2:
                if(!this.serviceSelected) {
                    this.giveWarning("Select service");
                } else {
                    this.removeWarning();
                    this.stageChange(3);
                }
                break;
            case 3:
                if(!this.dateTimeSelected['date'] || !this.dateTimeSelected['time']) {
                    this.giveWarning("Select date & time");
                } else {
                    this.removeWarning();
                    this.stageChange(4);
                }
                break;
        }
        if((this.stage == 1 && this.staffSelected) || (this.stage == 2 && this.serviceSelected)) {
            this.removeWarning();
        } else if(this.stage == 1 && !this.staffSelected) {
            this.giveWarning("Select staff");
        } else if(this.stage == 2 && !this.serviceSelected) {
            this.giveWarning('Select service');
        } else if(this.stage == 3 && (!this.dateTimeSelected['time'] ||  !this.dateTimeSelected['date'] )) {
            this.giveWarning('Select date & time');
        }
    }

    back = () => {
        switch(this.stage) {
            case 1:
                console.log("not possible");
                break;
            case 2:
                this.stageChange(1);
                break;
            case 3:
                this.stageChange(2);
                break;
            case 4:
                this.stageChange(3);
                break;
        }
    }
}
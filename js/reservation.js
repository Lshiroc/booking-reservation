export class Reservation {
    constructor() {
        document.querySelector('#nextBtn').addEventListener('click', this.next);
        document.querySelector('#backBtn').addEventListener('click', this.back);
        this.currentDate = new Date();
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

    /*
        TODO: instead of going through every stage
        with nesting them, make a promise for more
        clean step-by-step approach.
    */

    stageChange(stage, thisStage) {
        console.log(stage)
        thisStage = stage;
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
                this.stageChange(3);
            });
        })
    }

    // Stage 3
    async datePick() {
        this.stage = 3;
        document.querySelector('#optionsContainer').innerHTML = '';
        let dateContainer = document.querySelector('#dateContainer');
        dateContainer.style.display = 'grid';
        updateCalendar(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate, this.dates, this.times, this.dateTimeSelected, this.stageChange, this.stage);

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
            updateCalendar(year, month, this.currentDate, this.dates, this.times, this.dateTimeSelected, this.stageChange, this.stage);
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
            updateCalendar(year, month, this.currentDate, this.dates, this.times, this.dateTimeSelected, this.stageChange, this.stage);
        })

        function updateCalendar(year, month, currentDate, dates, times, dateTimeSelected, stageChange, thisStage) {
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
                    if(day.classList.contains('active')) {
                        dateTimeSelected = {
                            date: j,
                            time: null
                        }
                        day.addEventListener('click', (e) => {
                            let alreadySelected = document.querySelector('.day.selected');
                            let timesContainer = document.querySelector('#timesContainer');
                            let timeLabel = document.querySelector('#timeLabel');

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
                                times.forEach(time => {
                                    let timeItem = document.createElement('div');
                                    timeItem.classList.add('time');
                                    timeItem.innerHTML = `${time.start_time}<br/>${time.end_time}`;
                                    timeItem.addEventListener('click', () => {
                                        dateTimeSelected['time'] = `${time.start_time} ${time.end_time}`;
                                        stageChange(4, thisStage);
                                    })
                                    if(dateTimeSelected['date'] == j && dateTimeSelected['time'] == `${time.start_time} ${time.end_time}`) {
                                        day.classList.add('selected');
                                    }
                                    timesContainer.append(timeItem);
                                })
                            }
                        })
                    }
                    daysContainer.append(day);
                    j++;
                }
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
        if((this.stage == 1 && this.staffSelected) || (this.stage == 2 && this.serviceSelected)) {
            this.removeWarning();
        } else if(this.stage == 1 && !this.staffSelected) {
            this.giveWarning("Select staff");
        } else if(this.stage == 2 && !this.serviceSelected) {
            this.giveWarning('Select service');
        } else if(this.stage == 3 && !this.dateTimeSelected) {
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
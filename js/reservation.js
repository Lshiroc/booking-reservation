export class Reservation {
    constructor() {
        // Separate onclick events for necessery DOM elements
        document.querySelector('#nextBtn').addEventListener('click', this.next);
        document.querySelector('#backBtn').addEventListener('click', this.back);
        document.querySelector('.notificationCloseBtn').addEventListener('click', this.removeNotification);
        
        // Initialization of some veriables
        this.currentDate = new Date();
        this.dateTimeSelected = {date: null, time: null};
        this.switchStages();
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

    // Display small warning box
    giveWarning(text) {
        let infoBox = document.querySelector('.info');
        if(infoBox.style.animationPlayState == "paused" || infoBox.style.animationPlayState == "") {
            let infoText = document.querySelector('.info-text');
            infoBox.style.animationPlayState = "running";
            infoText.innerText = text;
            setTimeout(this.removeWarning, 3000);
        }
    }

    // Remove warning Box
    removeWarning() {
        let infoBox = document.querySelector('.info');
        infoBox.style.animationPlayState = "paused";
    }

    // Display the modal for Notification
    giveNotification(text, success) {
        document.querySelector('.notificationText').innerText = text;
        if(success) {
            document.querySelector('.notificationText').style.color = '#38CF78';
        } else {
            document.querySelector('.notificationText').style.color = '#F39C12';
        }
        let notificationContainer = document.querySelector('.notificationContainer');
        notificationContainer.style.animation = 'notificationBackgroundOn .4s forwards';
        setTimeout(() => {
            document.querySelector('.notification').style.animation = 'notificatonAppear .7s forwards';
        }, 400);
    }

    // Remove the modal for Notification
    removeNotification = () => {
        document.querySelector('.notification').style.animation = 'notificatonDisappear .7s forwards';
        setTimeout(() => {
            let notificationContainer = document.querySelector('.notificationContainer');
            notificationContainer.style.animation = 'notificationBackgroundOff .4s forwards';
        }, 700);
    }

    /*
        stage 1 = Staff
        stage 2 = Service
        stage 3 = Date & Time
        stage 4 = Connfirmation
    */

    /*
        Generally manage switch process between stages.
        Handles the change on different elements when stage changes. 
    */
    stageChange(stage) {
        this.stage = stage;
        if(this.stage == 1) {
            document.querySelector('.left').classList.add('noBack'); 
        } else {
            document.querySelector('.left').classList.remove('noBack');  
        }

        let pinpoints = document.querySelectorAll('.pinpoint');
        let processTitle = document.querySelector('#processTitle');
        switch(stage) {
            case 1:
                this.chooseStaff();
                processTitle.innerText = 'Select staff';
                document.querySelector('#nextBtn').innerText = 'Next';
                pinpoints[0].classList.add('current');
                pinpoints[0].classList.remove('done');
                pinpoints[1].classList.remove('current');
                break;
            case 2:
                this.service();
                processTitle.innerText = 'Select service';
                document.querySelector('#nextBtn').innerText = 'Next';
                pinpoints[0].classList.remove('current');
                pinpoints[0].classList.add('done');
                pinpoints[1].classList.add('current');
                pinpoints[1].classList.remove('done');
                pinpoints[2].classList.remove('current');
                break;
            case 3:
                this.datePick();
                processTitle.innerText = 'Select date & time';
                document.querySelector('#nextBtn').innerText = 'Next';
                pinpoints[1].classList.remove('current');
                pinpoints[1].classList.add('done');
                pinpoints[2].classList.add('current');
                pinpoints[2].classList.remove('done');
                pinpoints[3].classList.remove('current');
                break;
            case 4:
                this.confirmation();
                processTitle.innerText = 'Confirm detailes';
                document.querySelector('#nextBtn').innerText = 'Confirm Booking';
                pinpoints[2].classList.remove('current');
                pinpoints[2].classList.add('done');
                pinpoints[3].classList.add('current');
                pinpoints[3].classList.remove('done');
                break;
        }
    }

    // Stage 1
    chooseStaff() {
        // Set & Reset necessary variables, elements
        this.stage = 1;
        let container = document.querySelector('#optionsContainer');
        this.elementReset();
        
        // Display Options
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

        // Add click event for every option
        let options = [...container.children];
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.staffSelected = option.getAttribute("data-id");
                this.serviceSelected = null;
                this.price = null;
                this.dateTimeSelected = {};
                document.querySelector('#daysContainer').removeAttribute('data-date');
                this.stageChange(2);
            });
        });
    }

    // Stage 2
    service() {
        // Set & Reset necessary variables, elements
        this.stage = 2;
        let container = document.querySelector('#optionsContainer');
        this.elementReset();

        // Display Options
        this.services.forEach(service => {
            container.innerHTML += 
            `
            <div data-id='${service.id}' data-price='${service.price}' class="option service ${this.serviceSelected == service.id && 'selected'}">
                <div class="option-img">
                    <img src="./images/${service.image}" alt="${service.name}" />
                </div>
                <div class="option-title">${service.name}</div>
                <div class="option-description">${service.duration}</div>
                <div class="option-price">$${service.price}</div>
            </div>
            `;
        })

        // Add click event for every option
        let options = [...container.children];
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.serviceSelected = option.getAttribute("data-id");
                this.price = option.getAttribute("data-price");
                this.dateTimeSelected = {};
                document.querySelector('#daysContainer').removeAttribute('data-date');
                this.stageChange(3);
            });
        })
    }

    // Stage 3
    datePick() {
        this.stage = 3;
        this.elementReset();
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

    // Stage 4
    confirmation() {
        this.stage = 4;
        document.querySelector('#dateContainer').style.display = 'none';
        let confirmationContainer = document.querySelector('#confirmationForm');
        confirmationContainer.style.display = 'grid';
        // let infoBox = documen.querySelector('#infoBox');
        document.querySelector('#noteStaff').innerText = this.staffs.find(staff => staff.id == this.staffSelected).name;
        document.querySelector('#noteService').innerText = this.services.find(service => service.id == this.serviceSelected).name;
        document.querySelector('#noteDateTime').innerText = this.dateTimeSelected['date'] + " / " + this.dateTimeSelected['time'].replace(' ', '-');
        document.querySelector('#noteTotal').innerText = `$${this.price}`;
    }

    // Reset Date, ConfirmationForm and Options Container in one go
    elementReset() {
        document.querySelector('#dateContainer').style.display = 'none';
        document.querySelector('#confirmationForm').style.display = 'none';
        document.querySelector('#optionsContainer').innerHTML = '';
    }

    // Visually update the calendar and time table, when it is changed by the user
    // Needed for Stage 4
    updateCalendar(year, month) {
        // Check which weekday is the first day of current month
        let dateLabel = document.querySelector('#dateLabel');
        let timesContainer = document.querySelector('#timesContainer');
        let startWeekday = new Date(year, month, 1).getDay();
        let maxDays = new Date(year, month+1, 0).getDate();
        let daysContainer = document.querySelector("#daysContainer");
        let j = 1;
        
        dateLabel.setAttribute('data-year', this.currentDate.getFullYear());
        dateLabel.setAttribute('data-month', this.currentDate.getMonth());
        dateLabel.innerText = this.currentDate.toLocaleString("en-US", {month: 'long'}) +  " " + this.currentDate.getFullYear();
        daysContainer.setAttribute('data-date', year + "-" + String(month).padStart(2, '0'));
        daysContainer.innerHTML = '';
        
        // DIsplay all the days in the current month
        for(let i = 0; i < startWeekday + maxDays; i++) {
            if(i < startWeekday || j > maxDays) {
                daysContainer.innerHTML += `<div></div>`;
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

                        // Day selection style management
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
                            
                            // Display time options for selected day
                            this.times.forEach(time => {
                                let timeItem = document.createElement('div');
                                timeItem.classList.add('time');
                                timeItem.innerHTML = `${time.start_time}<br/>${time.end_time}`;
                                timeItem.addEventListener('click', () => {
                                    this.dateTimeSelected['time'] = `${time.start_time} ${time.end_time}`;
                                    this.dateTimeSelected['start_time'] = time.start_time;
                                    this.stageChange(4);
                                })
                                timeItem.setAttribute('data-time', `${time.start_time} ${time.end_time}`);
                                timesContainer.append(timeItem);
                            })
                        }
                    })

                    /*
                        Check if already exists in cache, then set the data from cache
                        If not, reset everything in Stage 4
                    */
                    let checkTimeItem = document.querySelector(`[data-time="${this.dateTimeSelected['time']}"]`);
                    if(this.dateTimeSelected['date'] == fullDate && checkTimeItem) {
                        day.classList.add('selected');
                        if(document.querySelector(".time.selected")) [
                            document.querySelector(".time.selected").classList.remove('selected')
                        ]
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

    // Check if the form is valid
    checkForm() {
        let firstname = document.getElementsByName('firstname')[0].value.trim();
        let lastname = document.getElementsByName('lastname')[0].value.trim();
        let email = document.getElementsByName('email')[0].value.trim();
        let phone = document.getElementsByName('phone')[0].value.trim();
        if(firstname == '' || lastname == '' || email == '') {
            this.giveNotification('Please, fill all the required fields!', false);
        } else {
            this.giveNotification('Confirmation successfully completed!', true);
            let final = {
                staff_id: this.staffSelected,
                service_id: this.serviceSelected,
                date: this.dateTimeSelected['date'],
                time: this.dateTimeSelected['start_time'],
                customer: {
                    name: firstname,
                    surname: lastname,
                    email: email,
                    phone: phone
                }
            }
            console.log(final);
        }
    }

    // Switch to next section when clicked on NEXT button
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
            case 4:
                this.checkForm();
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
    
    // Switch to previous section when clicked on BACK button
    back = () => {
        switch(this.stage) {
            case 1:
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

    // Manage user click on progress pinpoints
    switchStages() {
        let allStages = document.querySelectorAll('.pinpoint');
        allStages.forEach((stage, index) => {
            stage.addEventListener('click', () => {
                if(index < this.stage-1) {
                    allStages.forEach((stage, index2) => {
                        if(index2 > index) {
                            stage.classList.remove('done');
                            stage.classList.remove('current');
                        }
                    })
                    this.stageChange(index+1);
                }
            })
        })
    }
}
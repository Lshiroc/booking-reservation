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
        let contentBox = document.querySelector('#contentBox');
        this.staffs.forEach(staff => {
            contentBox.innerHTML += 
                `<div data-id='${staff.id}' class="option">
                    <div class="option-img">
                        <img src="./images/${staff.image}" alt="${staff.name}" />
                    </div>
                    <div class="option-title">${staff.name}</div>
                    <div class="option-description">${staff.email}</div>
                </div>`;
        });

        let options = [...contentBox.children];
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.staffSelected = option.getAttribute("data-id");
            });
        });
    }

    service() {
        let contentBox = document.querySelector('#contentBox');
    }

    next = () => {
        if(this.stage == 1 && this.staffSelected) {
            console.log("you may pass");
            this.removeWarning();
        } else {
            this.giveWarning("SELECT STAFF")
        }
    }


}
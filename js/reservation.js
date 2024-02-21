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

    giveWarning(text) {
        let infoBox = document.querySelector('.info');
        let infoText = document.querySelector('.info-text');
        infoBox.style.visibility = "visible";
        infoText.innerText = text;
        this.test = "teyst";
    }

    removeWarning() {
        let infoBox = document.querySelector('.info');
        infoBox.style.visibility = "hidden";
    }

    start() {
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
                // if(this.staffSelected != e.target.closest('.option').getAttribute('data-id')) {
                //     removeClasses(options);
                // }
                // e.target.closest('.option').classList.toggle("selected");
                this.staffSelected = option.getAttribute("data-id");
            });
        });

        //     function removeClasses(options) {
        //         options.forEach(option => {
        //             if(option.classList.contains("selected")) {
        //                 option.classList.remove("selected");
        //                 return;
        //             }
        //         })
        //     }
        // });
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
import { Reservation } from './reservation.js';

const staffs = [
    {
        "id": 1,
        "name": "Alex Rosetta",
        "email": "alexyrosetta@egmail.com",
        "image": "alex.png"
    },
    {
        "id": 2,
        "name": "Maria July",
        "email": "mariajuly@egmail.com",
        "image": "maria.png"
    },
]

const services = [
    {
        "id": 1,
        "name": "Oral hygiene",
        "image": "oral.png",
        "duration": "1 hour",
        "price": 50.00
    },
    {
        "id": 2,
        "name": "Implants",
        "image": "implant.png",
        "duration": "1 hour and 30 minutes",
        "price": 120.00
    },
]

const date = ["2022-03-04", "2022-03-05", "2022-03-06"];

const time = [
    {
        "start_time": "09:00",
        "end_time": "09:30",
    },
    {
        "start_time": "09:30",
        "end_time": "10:00",
    },
]

let resv = new Reservation(); 

resv.load(staffs, services, date, time);

resv.start();


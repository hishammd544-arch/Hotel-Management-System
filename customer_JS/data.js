/* HOTEL MANAGEMENT SYSTEM - CUSTOMER DATA */

const STORAGE_KEYS = {
    bookings: "hotelCustomerBookings",
    feedback: "hotelCustomerFeedback",
    complaints: "hotelCustomerComplaints",
    lostFound: "hotelCustomerLostFound",
    payments: "hotelCustomerPayments"
};

const defaultBookings = [
    {
        id: "B001",
        roomCategory: "Deluxe Room",
        checkIn: "2026-12-10",
        checkOut: "2026-12-12",
        guests: 2,
        status: "Confirmed"
    },
    {
        id: "B002",
        roomCategory: "Single Room",
        checkIn: "2026-12-20",
        checkOut: "2026-12-22",
        guests: 1,
        status: "Pending"
    }
];

function getData(key, defaultValue) {
    let data = localStorage.getItem(key);

    if (data === null) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return defaultValue;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(error);
        alert("Unable to save data!");
        return false;
    }
}

function getBookings() {
    return getData(STORAGE_KEYS.bookings, defaultBookings);
}

function saveBookings(bookings) {
    return saveData(STORAGE_KEYS.bookings, bookings);
}

function getFeedback() {
    return getData(STORAGE_KEYS.feedback, []);
}

function saveFeedback(data) {
    return saveData(STORAGE_KEYS.feedback, data);
}

function getComplaints() {
    return getData(STORAGE_KEYS.complaints, []);
}

function saveComplaints(data) {
    return saveData(STORAGE_KEYS.complaints, data);
}

function getLostFound() {
    return getData(STORAGE_KEYS.lostFound, []);
}

function saveLostFound(data) {
    return saveData(STORAGE_KEYS.lostFound, data);
}

function getPayments() {
    return getData(STORAGE_KEYS.payments, []);
}

function savePayments(data) {
    return saveData(STORAGE_KEYS.payments, data);
}

function todayDate() {
    const date = new Date();

    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
}

function generateID(items, prefix) {
    let highest = 0;

    items.forEach(function (item) {
        let number = parseInt(String(item.id).replace(/\D/g, ""));

        if (number > highest) {
            highest = number;
        }
    });

    return prefix + String(highest + 1).padStart(3, "0");
}
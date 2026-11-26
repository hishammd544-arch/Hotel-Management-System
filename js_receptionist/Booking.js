
let bookings = [
    {
        id: "BK-001",
        guestName: "Guest One",
        roomNo: 101,
        roomType: "Standard",
        checkIn: "2025-05-12",
        checkOut: "2025-05-14",
        guestCount: 1,
        status: "Confirmed"
    },
    {
        id: "BK-002",
        guestName: "Guest Two",
        roomNo: 203,
        roomType: "Deluxe",
        checkIn: "2025-05-12",
        checkOut: "2025-05-15",
        guestCount: 2,
        status: "Checked-in"
    }
];

let roomAvailability = {
    Standard: 5,
    Deluxe: 3,
    Suite: 2
};

let roomPrices = {
    Standard: 2500,
    Deluxe: 4000,
    Suite: 7000
};

let airportPrice = 1000;

function getElement(id) {
    return document.getElementById(id);
}

function getSelectedValue(name) {
    let selected = document.querySelector("input[name='" + name + "']:checked");
    return selected ? selected.value : "";
}

function generateBookingId() {
    return "BK-" + String(bookings.length + 1).padStart(3, "0");
}

function getGuestCount(type) {
    if (type === "Single") {
        return 1;
    } else if (type === "Couple") {
        return 2;
    } else if (type === "Friends") {
        return 2;
    }
    return 0;
}

function calculateTotal() {
    let roomType = getSelectedValue("roomCategory");
    let airport = getElement("airportService").checked;
    let discount = getElement("regularDiscount").checked;

    let price = roomPrices[roomType] || 0;
    let airportCharge = airport ? airportPrice : 0;
    let discountAmount = discount ? price * 0.10 : 0;

    let total = price + airportCharge - discountAmount;

    return {
        roomPrice: price,
        airportCharge: airportCharge,
        discount: discountAmount,
        total: total
    };
}

function validateBooking() {
    let roomType = getSelectedValue("roomCategory");
    let guestType = getSelectedValue("guestType");
    let payment = getSelectedValue("paymentMethod");

    if (roomType === "") {
        alert("Please select a room category.");
        return false;
    }

    if (guestType === "") {
        alert("Please select guest type.");
        return false;
    }

    if (payment === "") {
        alert("Please select payment method.");
        return false;
    }

    if (roomAvailability[roomType] <= 0) {
        alert("No rooms available in this category.");
        return false;
    }

    let checkIn = getElement("checkInDate").value;
    let checkOut = getElement("checkOutDate").value;

    if (checkIn === "" || checkOut === "") {
        alert("Please select check-in and check-out dates.");
        return false;
    }

    if (checkOut <= checkIn) {
        alert("Check-out date must be after check-in date.");
        return false;
    }

    if (guestType === "Single") {
        if (getElement("fullName").value.trim() === "" ||
            getElement("phone").value.trim() === "" ||
            getElement("dateOfBirth").value === "") {
            alert("Please fill in all required guest information.");
            return false;
        }
    } else {
        if (getElement("guest1Name").value.trim() === "" ||
            getElement("guest1DOB").value === "") {
            alert("Please fill in first guest information.");
            return false;
        }
    }

    return true;
}

function createBooking() {
    if (validateBooking() === false) {
        return false;
    }

    let roomType = getSelectedValue("roomCategory");
    let guestType = getSelectedValue("guestType");
    let guestCount = getGuestCount(guestType);

    let guestName;

    if (guestType === "Single") {
        guestName = getElement("fullName").value.trim();
    } else {
        guestName = getElement("guest1Name").value.trim();
    }

    let checkIn = getElement("checkInDate").value;
    let checkOut = getElement("checkOutDate").value;

    let roomNo = roomType === "Standard" ? 101 :
                 roomType === "Deluxe" ? 203 : 305;

    let booking = {
        id: generateBookingId(),
        guestName: guestName,
        roomNo: roomNo,
        roomType: roomType,
        guestType: guestType,
        guestCount: guestCount,
        checkIn: checkIn,
        checkOut: checkOut,
        airportService: getElement("airportService").checked,
        airportType: getSelectedValue("airportType"),
        regularDiscount: getElement("regularDiscount").checked,
        paymentMethod: getSelectedValue("paymentMethod"),
        status: "Pending"
    };

    let bill = calculateTotal();

    booking.roomPrice = bill.roomPrice;
    booking.airportCharge = bill.airportCharge;
    booking.discount = bill.discount;
    booking.totalAmount = bill.total;

    bookings.push(booking);

    roomAvailability[roomType]--;

    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.setItem("currentBill", JSON.stringify(booking));

    alert("Booking created successfully!\nBooking ID: " + booking.id);

    window.location.href = "bill.html";

    return false;
}

function loadBookings() {
    let savedBookings = localStorage.getItem("bookings");

    if (savedBookings !== null) {
        bookings = JSON.parse(savedBookings);
    }
}

function showRoomAvailability() {
    getElement("standardRooms").innerHTML = roomAvailability.Standard;
    getElement("deluxeRooms").innerHTML = roomAvailability.Deluxe;
    getElement("suiteRooms").innerHTML = roomAvailability.Suite;
}

function showGuestFields() {
    let guestType = getSelectedValue("guestType");

    getElement("singleGuest").style.display =
        guestType === "Single" ? "block" : "none";

    getElement("coupleFriends").style.display =
        guestType === "Couple" || guestType === "Friends" ? "block" : "none";
}

function showTotalAmount() {
    let roomType = getSelectedValue("roomCategory");

    if (roomType === "") {
        return;
    }

    let bill = calculateTotal();

    getElement("totalAmount").innerHTML =
        "$" + bill.total.toLocaleString();
}

loadBookings();
showRoomAvailability();


let bookings = [
    {
        id: "BK-001",
        guestName: "Guest One",
        roomNo: "101",
        checkIn: "2025-05-12",
        checkOut: "2025-05-14",
        guestCount: 2,
        status: "Confirmed"
    },
    {
        id: "BK-002",
        guestName: "Guest Two",
        roomNo: "203",
        checkIn: "2025-05-12",
        checkOut: "2025-05-15",
        guestCount: 1,
        status: "Checked-in"
    }
];

let currentFilter = "All";
let editBookingIndex = -1;

function formatDate(date) {
    let parts = date.split("-");
    return parts[2] + "-" + parts[1] + "-" + parts[0];
}

function renderBookings() {
    let keyword = document.getElementById("bookingSearch").value.toLowerCase();
    let dateFilter = document.getElementById("bookingDateFilter").value;

    let rows = "";
    let shown = 0;

    for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i];

        let matchesKeyword =
            booking.id.toLowerCase().includes(keyword) ||
            booking.guestName.toLowerCase().includes(keyword) ||
            booking.roomNo.toLowerCase().includes(keyword);

        let matchesStatus =
            currentFilter === "All" ||
            booking.status === currentFilter;

        let matchesDate =
            dateFilter === "All Dates" ||
            booking.checkIn === dateFilter;

        if (matchesKeyword && matchesStatus && matchesDate) {

            let statusClass = booking.status.toLowerCase().replace("-", "");

            rows +=
                "<tr>" +
                "<td>" + booking.id + "</td>" +
                "<td>" + booking.guestName + "</td>" +
                "<td>" + booking.roomNo + "</td>" +
                "<td>" + formatDate(booking.checkIn) + "</td>" +
                "<td>" + formatDate(booking.checkOut) + "</td>" +
                "<td>" + booking.guestCount + "</td>" +
                "<td><span class='badge " + statusClass + "'>" + booking.status + "</span></td>" +
                "<td>" +
                "<button type='button' class='btn btn-small' onclick='viewBooking(" + i + ")'>View</button> " +
                "<button type='button' class='btn btn-small' onclick='editBooking(" + i + ")'>Edit</button> " +
                "<button type='button' class='btn btn-small btn-danger' onclick='deleteBooking(" + i + ")'>Delete</button>" +
                "</td>" +
                "</tr>";

            shown++;
        }
    }

    if (shown === 0) {
        rows = "<tr><td colspan='8' class='empty-row'>No bookings found.</td></tr>";
    }

    document.getElementById("bookingTableBody").innerHTML = rows;

    document.getElementById("bookingCount").innerHTML =
        "Total Bookings: " + shown;
}

function searchBooking() {
    renderBookings();
}

function filterBookings(status) {
    currentFilter = status;
    renderBookings();
}

function viewBooking(index) {
    let booking = bookings[index];

    alert(
        "Booking ID: " + booking.id +
        "\nGuest Name: " + booking.guestName +
        "\nRoom Number: " + booking.roomNo +
        "\nCheck-in: " + formatDate(booking.checkIn) +
        "\nCheck-out: " + formatDate(booking.checkOut) +
        "\nGuest Count: " + booking.guestCount +
        "\nStatus: " + booking.status
    );
}

function editBooking(index) {
    let booking = bookings[index];

    let guestName = prompt("Enter Guest Name:", booking.guestName);

    if (guestName === null) {
        return;
    }

    if (guestName.trim() === "") {
        alert("Guest name cannot be empty.");
        return;
    }

    let roomNo = prompt("Enter Room Number:", booking.roomNo);

    if (roomNo === null) {
        return;
    }

    let guestCount = prompt("Enter Guest Count:", booking.guestCount);

    if (guestCount === null) {
        return;
    }

    if (roomNo.trim() === "" || Number(guestCount) < 1 ||
        !Number.isInteger(Number(guestCount))) {
        alert("Please enter valid booking information.");
        return;
    }

    booking.guestName = guestName.trim();
    booking.roomNo = roomNo.trim();
    booking.guestCount = Number(guestCount);

    alert("Booking updated successfully.");

    renderBookings();
}

function deleteBooking(index) {
    let booking = bookings[index];

    if (booking.status === "Cancelled") {
        alert("This booking is already cancelled.");
        return;
    }

    let confirmDelete = confirm(
        "Are you sure you want to cancel booking " + booking.id + "?"
    );

    if (confirmDelete) {
        booking.status = "Cancelled";

        alert("Booking cancelled successfully.");

        renderBookings();
    }
}

function updateBookingStatus(index, status) {
    bookings[index].status = status;
    renderBookings();
}

function filterByDate() {
    renderBookings();
}

function addBooking(booking) {
    bookings.push(booking);
    renderBookings();
}

renderBookings();

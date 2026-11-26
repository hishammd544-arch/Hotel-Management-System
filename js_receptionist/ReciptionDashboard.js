
const bookings = [
    {
        id: "BK-001",
        guestName: "Guest One",
        roomNo: 101,
        checkIn: "12 May 2025",
        checkOut: "14 May 2025",
        status: "Confirmed"
    },
    {
        id: "BK-002",
        guestName: "Guest Two",
        roomNo: 203,
        checkIn: "12 May 2025",
        checkOut: "15 May 2025",
        status: "Checked-in"
    }
];

const roomCategories = {
    standard: 5,
    deluxe: 3,
    suite: 2
};

function renderDashboard() {
    document.getElementById("dashboardTotalBookings").innerHTML = bookings.length;

    let checkedIn = 0;
    let checkedOut = 0;

    for (const booking of bookings) {
        if (booking.status === "Checked-in") {
            checkedIn++;
        }

        if (booking.status === "Checked-out") {
            checkedOut++;
        }
    }

    let totalRooms = roomCategories.standard + roomCategories.deluxe + roomCategories.suite;
    let availableRooms = totalRooms - bookings.length;

    document.getElementById("dashboardCheckedIn").innerHTML = checkedIn;
    document.getElementById("dashboardCheckedOut").innerHTML = checkedOut;
    document.getElementById("dashboardAvailableRooms").innerHTML = availableRooms;

    displayRecentBookings(bookings);
}

function displayRecentBookings(data) {
    let rows = "";

    for (const booking of data) {
        let statusClass = "";

        if (booking.status === "Confirmed") {
            statusClass = "confirmed";
        } else if (booking.status === "Checked-in") {
            statusClass = "checked-in";
        } else if (booking.status === "Checked-out") {
            statusClass = "checked-out";
        } else {
            statusClass = "pending";
        }

        rows += "<tr>" +
            "<td>" + booking.id + "</td>" +
            "<td>" + booking.guestName + "</td>" +
            "<td>" + booking.roomNo + "</td>" +
            "<td>" + booking.checkIn + "</td>" +
            "<td>" + booking.checkOut + "</td>" +
            "<td><span class='status " + statusClass + "'>" + booking.status + "</span></td>" +
            "</tr>";
    }

    if (data.length === 0) {
        rows = "<tr><td colspan='6'>No bookings found.</td></tr>";
    }

    document.getElementById("recentBookingsBody").innerHTML = rows;
}

function searchDashboardBookings() {
    let keyword = document.getElementById("dashboardSearch").value.toLowerCase().trim();

    let filteredBookings = [];

    for (const booking of bookings) {
        if (
            booking.id.toLowerCase().includes(keyword) ||
            booking.guestName.toLowerCase().includes(keyword) ||
            booking.roomNo.toString().includes(keyword)
        ) {
            filteredBookings.push(booking);
        }
    }

    displayRecentBookings(filteredBookings);
}

function resetDashboardSearch() {
    document.getElementById("dashboardSearch").value = "";
    displayRecentBookings(bookings);
}

renderDashboard();

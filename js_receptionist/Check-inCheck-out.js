
let bookings = [
    {
        id: "BK-001",
        guestName: "Guest One",
        roomNo: 101,
        checkInDate: "12-05-2025",
        status: "Checked-in"
    },
    {
        id: "BK-002",
        guestName: "Guest Two",
        roomNo: 203,
        checkInDate: "12-05-2025",
        status: "Checked-out"
    }
];

let currentMode = "Check-in";

function showCheckIn() {
    currentMode = "Check-in";
    document.getElementById("checkInBtn").className = "active";
    document.getElementById("checkOutBtn").className = "";
    renderCheckInOut();
}

function showCheckOut() {
    currentMode = "Check-out";
    document.getElementById("checkOutBtn").className = "active";
    document.getElementById("checkInBtn").className = "";
    renderCheckInOut();
}

function renderCheckInOut() {
    let keyword = document.getElementById("checkSearch").value.toLowerCase();
    let filter = document.getElementById("checkFilter").value;

    let rows = "";
    let count = 0;

    for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i];

        let matchesSearch =
            booking.id.toLowerCase().includes(keyword) ||
            booking.guestName.toLowerCase().includes(keyword) ||
            booking.roomNo.toString().includes(keyword);

        let matchesFilter =
            filter === "All" || booking.status === filter;

        let matchesMode = true;

        if (currentMode === "Check-out") {
            matchesMode = booking.status === "Checked-in";
        }

        if (matchesSearch && matchesFilter && matchesMode) {
            let action = "";

            if (booking.status === "Checked-in") {
                action = "<button type='button' onclick='checkOut(" + i + ")'>Check out</button>";
            } else if (booking.status === "Checked-out") {
                action = "<button type='button' disabled>Completed</button>";
            } else {
                action = "<button type='button' onclick='checkIn(" + i + ")'>Check in</button>";
            }

            rows += "<tr>" +
                "<td>" + booking.id + "</td>" +
                "<td>" + booking.guestName + "</td>" +
                "<td>" + booking.roomNo + "</td>" +
                "<td>" + booking.checkInDate + "</td>" +
                "<td>" + booking.status + "</td>" +
                "<td>" + action + "</td>" +
                "</tr>";

            count++;
        }
    }

    if (count === 0) {
        rows = "<tr><td colspan='6'>No booking found.</td></tr>";
    }

    document.getElementById("checkTableBody").innerHTML = rows;
}

function checkIn(index) {
    if (bookings[index].status === "Checked-out") {
        alert("This booking is already checked out.");
        return;
    }

    bookings[index].status = "Checked-in";

    alert(bookings[index].guestName + " checked in successfully.");

    renderCheckInOut();
}

function checkOut(index) {
    if (bookings[index].status !== "Checked-in") {
        alert("Guest must check in first.");
        return;
    }

    bookings[index].status = "Checked-out";

    alert(bookings[index].guestName + " checked out successfully.");

    renderCheckInOut();
}

function searchBookings() {
    renderCheckInOut();
}

document.getElementById("checkSearch").addEventListener("input", renderCheckInOut);

document.getElementById("checkFilter").addEventListener("change", renderCheckInOut);

showCheckIn();

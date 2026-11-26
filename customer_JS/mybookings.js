/* =====================================
   MY BOOKINGS - CUSTOMER PORTAL
   CRUD OPERATIONS
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("My Bookings JavaScript Loaded Successfully!");

    // HTML Elements
    const tableBody = document.querySelector(
        ".panel .table-wrap table tbody"
    );

    const searchInput = document.querySelector(
        'input[name="search-booking"]'
    );

    const searchButton = document.querySelector(
        ".toolbar button.button"
    );

    const dateFilter = document.querySelector(
        'select[name="date-filter"]'
    );

    const tabs = document.querySelectorAll(".tabs button");

    // Check HTML Elements
    if (!tableBody) {
        console.error("Booking Table Not Found!");
        return;
    }

    if (typeof getBookings !== "function" ||
        typeof saveBookings !== "function") {

        console.error("data.js is not connected!");
        alert("Booking data file is not connected properly!");
        return;
    }

    // Current Filter
    let selectedStatus = "All Bookings";
    let searchText = "";

    // Date Function
    function getToday() {

        const date = new Date();

        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");

    }

    // Import existing HTML sample records
    function importOldRecords(bookings) {

        const oldRows = Array.from(tableBody.querySelectorAll("tr"));

        oldRows.forEach(function (row) {

            const cells = row.querySelectorAll("td");

            if (cells.length < 5) return;

            const id = cells[0].textContent.trim();

            if (!id || bookings.some(item => item.id === id)) {
                return;
            }

            const statusElement = cells[4].querySelector(".status");

            bookings.push({

                id: id,

                roomCategory: cells[1].textContent.trim(),

                checkIn: cells[2].textContent.trim(),

                checkOut: cells[3].textContent.trim(),

                guests: 1,

                status: statusElement
                    ? statusElement.textContent.trim()
                    : cells[4].textContent.trim()

            });

        });

        saveBookings(bookings);

    }

    // Get Booking Data
    let bookings = getBookings();

    importOldRecords(bookings);

    // Create Action Button
    function createButton(text, action, id) {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = text;
        button.dataset.action = action;
        button.dataset.id = id;

        if (action === "cancel") {
            button.className = "danger";
        }

        return button;

    }

    // Display Booking Records
    function displayBookings() {

        bookings = getBookings();

        tableBody.innerHTML = "";

        let filteredBookings = bookings.filter(function (booking) {

            // Status Filter
            const status = String(booking.status || "").toLowerCase();

            let statusMatch = true;

            if (selectedStatus !== "All Bookings") {

                statusMatch =
                    status === selectedStatus.toLowerCase();

            }

            // Search Filter
            const id = String(booking.id || "").toLowerCase();

            const room = String(
                booking.roomCategory || ""
            ).toLowerCase();

            const searchMatch =
                id.includes(searchText) ||
                room.includes(searchText);

            // Date Filter
            let dateMatch = true;

            const filterValue = dateFilter
                ? dateFilter.value
                : "all";

            if (filterValue === "today") {

                dateMatch = booking.checkIn === getToday();

            }

            else if (filterValue === "upcoming") {

                dateMatch =
                    booking.checkIn >= getToday() &&
                    status !== "cancelled";

            }

            else if (filterValue === "completed") {

                dateMatch =
                    booking.checkOut < getToday() ||
                    status === "completed";

            }

            return statusMatch && searchMatch && dateMatch;

        });

        // No Booking Found
        if (filteredBookings.length === 0) {

            const row = document.createElement("tr");

            const cell = document.createElement("td");

            cell.colSpan = 6;
            cell.textContent = "No bookings found.";

            row.appendChild(cell);

            tableBody.appendChild(row);

            return;

        }

        // Display Every Booking
        filteredBookings.forEach(function (booking) {

            const row = document.createElement("tr");

            // Booking ID
            const idCell = document.createElement("td");
            idCell.textContent = booking.id;

            // Room Category
            const roomCell = document.createElement("td");
            roomCell.textContent = booking.roomCategory;

            // Check-in
            const checkInCell = document.createElement("td");
            checkInCell.textContent = booking.checkIn;

            // Check-out
            const checkOutCell = document.createElement("td");
            checkOutCell.textContent = booking.checkOut;

            // Status
            const statusCell = document.createElement("td");

            const statusBadge = document.createElement("span");

            const currentStatus = booking.status || "Pending";

            statusBadge.textContent = currentStatus;

            if (currentStatus === "Cancelled") {
                statusBadge.className = "status cancelled";
            }

            else if (currentStatus === "Pending") {
                statusBadge.className = "status pending";
            }

            else {
                statusBadge.className = "status confirmed";
            }

            statusCell.appendChild(statusBadge);

            // Action Buttons
            const actionCell = document.createElement("td");

            actionCell.appendChild(
                createButton("View", "view", booking.id)
            );

            if (currentStatus !== "Cancelled") {

                actionCell.appendChild(
                    createButton("Update", "update", booking.id)
                );

                actionCell.appendChild(
                    createButton("Cancel", "cancel", booking.id)
                );

            }

            row.appendChild(idCell);
            row.appendChild(roomCell);
            row.appendChild(checkInCell);
            row.appendChild(checkOutCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);

        });

    }

    // SEARCH OPERATION
    function searchBookings() {

        searchText = searchInput.value.trim().toLowerCase();

        displayBookings();

    }

    if (searchButton) {

        searchButton.addEventListener("click", searchBookings);

    }

    if (searchInput) {

        searchInput.addEventListener("input", searchBookings);

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchBookings();

            }

        });

    }

    // DATE FILTER
    if (dateFilter) {

        dateFilter.addEventListener("change", function () {

            displayBookings();

        });

    }

    // STATUS TABS
    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            tabs.forEach(function (item) {

                item.classList.remove("active");

            });

            tab.classList.add("active");

            selectedStatus = tab.textContent.trim();

            displayBookings();

        });

    });

    // VIEW / UPDATE / CANCEL
    tableBody.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;

        const bookingID = button.dataset.id;

        bookings = getBookings();

        const booking = bookings.find(function (item) {

            return item.id === bookingID;

        });

        if (!booking) {

            alert("Booking not found!");

            return;

        }

        // READ OPERATION - VIEW
        if (action === "view") {

            alert(

                "BOOKING DETAILS\n\n" +

                "Booking ID: " + booking.id +

                "\nRoom Category: " + booking.roomCategory +

                "\nCheck-in Date: " + booking.checkIn +

                "\nCheck-out Date: " + booking.checkOut +

                "\nNumber of Guests: " + booking.guests +

                "\nBooking Status: " + booking.status

            );

        }

        // UPDATE OPERATION
        else if (action === "update") {

            if (booking.status === "Cancelled") {

                alert("Cancelled booking cannot be updated!");

                return;

            }

            // Change Room Category
            const newRoom = prompt(

                "Enter New Room Category:\n" +

                "Single Room, Double Room, Deluxe Room, Suite Room",

                booking.roomCategory

            );

            if (newRoom === null) return;

            const roomList = [

                "Single Room",
                "Double Room",
                "Deluxe Room",
                "Suite Room"

            ];

            const selectedRoom = roomList.find(function (room) {

                return room.toLowerCase() === newRoom.trim().toLowerCase();

            });

            if (!selectedRoom) {

                alert("Invalid Room Category!");

                return;

            }

            // Change Check-in Date
            const newCheckIn = prompt(

                "Enter New Check-in Date (YYYY-MM-DD):",

                booking.checkIn

            );

            if (newCheckIn === null) return;

            // Change Check-out Date
            const newCheckOut = prompt(

                "Enter New Check-out Date (YYYY-MM-DD):",

                booking.checkOut

            );

            if (newCheckOut === null) return;

            // Date Validation
            function validDate(value) {

                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return false;
                }

                const date = new Date(value + "T00:00:00");

                return !isNaN(date.getTime()) &&
                    date.toISOString().slice(0, 10) === value;

            }

            if (!validDate(newCheckIn) ||
                !validDate(newCheckOut)) {

                alert("Please enter valid dates in YYYY-MM-DD format!");

                return;

            }

            if (newCheckOut <= newCheckIn) {

                alert("Check-out date must be after check-in date!");

                return;

            }

            // Save Updated Data
            booking.roomCategory = selectedRoom;

            booking.checkIn = newCheckIn;

            booking.checkOut = newCheckOut;

            if (saveBookings(bookings)) {

                alert("Booking Updated Successfully!");

                displayBookings();

            }

        }

        // DELETE OPERATION - CANCEL
        else if (action === "cancel") {

            if (booking.status === "Cancelled") return;

            const confirmation = confirm(

                "Are you sure you want to cancel Booking " +

                booking.id + "?"

            );

            if (!confirmation) return;

            booking.status = "Cancelled";

            if (saveBookings(bookings)) {

                alert("Booking Cancelled Successfully!");

                displayBookings();

            }

        }

    });

    // INITIAL DISPLAY
    displayBookings();

    console.log("My Bookings CRUD Operations Ready!");

});
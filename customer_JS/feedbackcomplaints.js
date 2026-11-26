/* ==========================================
   HOTEL MANAGEMENT SYSTEM
   FEEDBACK & COMPLAINTS JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Feedback & Complaints JavaScript Loaded!");

    // STORAGE KEY
    const STORAGE_KEY = "hotelFeedbackComplaints";

    // HTML ELEMENTS
    const forms = document.querySelectorAll(
        ".two-column .panel form.stack-form"
    );

    const tableBody = document.querySelector(
        ".table-wrap table tbody"
    );

    // CHECK HTML CONNECTION
    if (forms.length !== 2 || !tableBody) {

        console.error("Feedback HTML elements not found!");

        alert("Feedback page connection error!");

        return;
    }

    const feedbackForm = forms[0];
    const complaintForm = forms[1];

    // GET TODAY'S DATE
    function getToday() {

        const date = new Date();

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }

    // LOAD DATA
    function getRecords() {

        try {

            const savedData = localStorage.getItem(STORAGE_KEY);

            if (savedData !== null) {

                const records = JSON.parse(savedData);

                return Array.isArray(records) ? records : [];

            }

        } catch (error) {

            console.error("Unable to load feedback data:", error);

        }

        // IMPORT OLD HTML RECORDS
        const oldRows = Array.from(
            tableBody.querySelectorAll("tr")
        );

        const records = oldRows.map(function (row, index) {

            const cells = row.querySelectorAll("td");

            if (cells.length < 4) return null;

            return {

                id: "OLD-" + index,

                date: cells[0].textContent.trim(),

                type: cells[1].textContent.trim(),

                details: cells[2].textContent.trim(),

                status: cells[3].textContent.trim(),

                rating: ""

            };

        }).filter(Boolean);

        saveRecords(records);

        return records;

    }

    // SAVE DATA
    function saveRecords(records) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(records)
            );

            return true;

        } catch (error) {

            console.error("Unable to save data:", error);

            alert("Data could not be saved!");

            return false;

        }

    }

    // DISPLAY HISTORY
    function displayRecords() {

        const records = getRecords();

        tableBody.innerHTML = "";

        if (records.length === 0) {

            const row = document.createElement("tr");

            const cell = document.createElement("td");

            cell.colSpan = 4;

            cell.textContent = "No feedback or complaints found.";

            row.appendChild(cell);

            tableBody.appendChild(row);

            return;

        }

        records.forEach(function (record) {

            const row = document.createElement("tr");

            // DATE
            const dateCell = document.createElement("td");

            dateCell.textContent = record.date;

            // TYPE
            const typeCell = document.createElement("td");

            typeCell.textContent = record.type;

            // DETAILS
            const detailsCell = document.createElement("td");

            detailsCell.textContent = record.details;

            // STATUS
            const statusCell = document.createElement("td");

            const statusBadge = document.createElement("span");

            statusBadge.textContent = record.status;

            statusBadge.className =
                record.status === "Closed"
                    ? "status confirmed"
                    : "status pending";

            statusCell.appendChild(statusBadge);

            row.appendChild(dateCell);

            row.appendChild(typeCell);

            row.appendChild(detailsCell);

            row.appendChild(statusCell);

            tableBody.appendChild(row);

        });

    }

    // ==================================
    // CREATE OPERATION - FEEDBACK
    // ==================================

    feedbackForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const ratingInput = feedbackForm.querySelector(
            'input[name="rating"]:checked'
        );

        const feedbackInput = feedbackForm.querySelector(
            "#feedback"
        );

        if (!ratingInput) {

            alert("Please select a rating!");

            return;

        }

        const rating = ratingInput.value;

        const feedback = feedbackInput.value.trim();

        if (feedback === "") {

            alert("Please write your feedback!");

            return;

        }

        const records = getRecords();

        const newFeedback = {

            id: "FB-" + Date.now(),

            date: getToday(),

            type: "Feedback (" + rating + "/5)",

            details: feedback,

            rating: rating,

            status: "Closed"

        };

        records.push(newFeedback);

        if (saveRecords(records)) {

            alert("Feedback Submitted Successfully!");

            feedbackForm.reset();

            displayRecords();

            console.log("Feedback saved successfully!");

        }

    });

    // ==================================
    // CREATE OPERATION - COMPLAINT
    // ==================================

    complaintForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const complaintType = complaintForm.querySelector(
            "#complaint-type"
        );

        const complaintInput = complaintForm.querySelector(
            "#complaint"
        );

        const selectedOption =
            complaintType.options[complaintType.selectedIndex];

        const type = selectedOption.textContent.trim();

        const details = complaintInput.value.trim();

        if (!complaintType.value) {

            alert("Please select a complaint type!");

            return;

        }

        if (details === "") {

            alert("Please describe your complaint!");

            return;

        }

        const records = getRecords();

        const newComplaint = {

            id: "CP-" + Date.now(),

            date: getToday(),

            type: "Complaint - " + type,

            details: details,

            rating: "",

            status: "In Progress"

        };

        records.push(newComplaint);

        if (saveRecords(records)) {

            alert("Complaint Submitted Successfully!");

            complaintForm.reset();

            displayRecords();

            console.log("Complaint saved successfully!");

        }

    });

    // INITIALIZE PAGE
    displayRecords();

    // REMOVE OLD GET QUERY FROM ADDRESS BAR
    if (window.location.search) {

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

    }

    console.log("Feedback & Complaints System Ready!");

});
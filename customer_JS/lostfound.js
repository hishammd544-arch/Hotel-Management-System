/* LOST AND FOUND MANAGEMENT */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Lost and Found JavaScript Loaded!");

    const forms = document.querySelectorAll("form.stack-form");

    const form = Array.from(forms).find(function (item) {
        return item.querySelector("#itemName");
    });

    const tableBody = document.querySelector(".table-wrap tbody");

    if (!form) return;

    // Display Reports
    function displayReports() {

        if (!tableBody) return;

        const reports = getLostFound();

        tableBody.innerHTML = "";

        if (reports.length === 0) {

            tableBody.innerHTML =
                '<tr><td colspan="5">No reports found.</td></tr>';

            return;

        }

        reports.forEach(function (report) {

            const row = document.createElement("tr");

            const values = [
                report.id,
                report.itemName,
                report.location,
                report.date,
                report.status
            ];

            values.forEach(function (value, index) {

                const cell = document.createElement("td");

                if (index === 4) {

                    const badge = document.createElement("span");

                    badge.className = "status pending";

                    badge.textContent = value;

                    cell.appendChild(badge);

                } else {

                    cell.textContent = value;

                }

                row.appendChild(cell);

            });

            tableBody.appendChild(row);

        });

    }

    // Submit Lost Item Report
    form.noValidate = true;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const itemName = document.getElementById("itemName").value.trim();

        const location = document.getElementById("lostLocation");

        const lostDate = document.getElementById("lostDate").value;

        const description =
            document.getElementById("itemDescription").value.trim();

        const contact =
            document.getElementById("contactNumber").value.trim();

        if (
            !itemName ||
            !location.value ||
            !lostDate ||
            !description ||
            !contact
        ) {

            alert("Please fill in all information.");

            return;

        }

        const reports = getLostFound();

        reports.push({

            id: generateID(reports, "LF-"),

            itemName: itemName,

            location: location.options[location.selectedIndex].text,

            date: lostDate,

            description: description,

            contact: contact,

            status: "Pending"

        });

        if (saveLostFound(reports)) {

            alert("Lost Item Report Submitted Successfully!");

            form.reset();

            displayReports();

        }

    });

    displayReports();

});
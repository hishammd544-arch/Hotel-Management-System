
let airportServices = [
    {
        bookingId: "BK-001",
        guestName: "Guest One",
        serviceType: "Pickup",
        dateTime: "2025-05-12T10:00",
        status: "Confirmed"
    },
    {
        bookingId: "BK-002",
        guestName: "Guest Two",
        serviceType: "Drop-off",
        dateTime: "2025-05-15T14:00",
        status: "Pending"
    }
];

let editServiceIndex = -1;

function renderAirportServices() {
    let keyword = document.getElementById("airportServiceSearch").value.toLowerCase();
    let rows = "";
    let shown = 0;

    for (let i = 0; i < airportServices.length; i++) {
        let service = airportServices[i];

        let matches =
            service.bookingId.toLowerCase().includes(keyword) ||
            service.guestName.toLowerCase().includes(keyword);

        if (matches) {
            rows += "<tr>" +
                "<td>" + service.bookingId + "</td>" +
                "<td>" + service.guestName + "</td>" +
                "<td>" + service.serviceType + "</td>" +
                "<td>" + formatDateTime(service.dateTime) + "</td>" +
                "<td>" + service.status + "</td>" +
                "<td>" +
                "<button type='button' onclick='editAirportService(" + i + ")'>Edit</button> " +
                "<button type='button' onclick='cancelAirportService(" + i + ")'>Cancel</button>" +
                "</td>" +
                "</tr>";

            shown++;
        }
    }

    if (shown === 0) {
        rows = "<tr><td colspan='6'>No airport service found.</td></tr>";
    }

    document.getElementById("airportServiceTableBody").innerHTML = rows;
    document.getElementById("airportServiceCount").innerHTML =
        "Showing " + shown + " of " + airportServices.length + " services";
}

function formatDateTime(dateTime) {
    let date = new Date(dateTime);

    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, "0");

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return day + "-" + month + "-" + year + " " +
        String(hours).padStart(2, "0") + ":" + minutes + " " + ampm;
}

function saveAirportService() {
    let bookingId = document.getElementById("serviceBookingId").value.trim();
    let guestName = document.getElementById("serviceGuestName").value.trim();
    let serviceType = document.getElementById("serviceType").value;
    let dateTime = document.getElementById("serviceDateTime").value;
    let status = document.getElementById("serviceStatus").value;

    if (bookingId === "" || guestName === "" ||
        serviceType === "" || dateTime === "" || status === "") {
        alert("Please fill in all fields.");
        return false;
    }

    if (editServiceIndex === -1) {
        for (let service of airportServices) {
            if (service.bookingId === bookingId) {
                alert("Booking ID already exists.");
                return false;
            }
        }

        airportServices.push({
            bookingId: bookingId,
            guestName: guestName,
            serviceType: serviceType,
            dateTime: dateTime,
            status: status
        });

        alert("Airport service added successfully.");

    } else {
        airportServices[editServiceIndex].bookingId = bookingId;
        airportServices[editServiceIndex].guestName = guestName;
        airportServices[editServiceIndex].serviceType = serviceType;
        airportServices[editServiceIndex].dateTime = dateTime;
        airportServices[editServiceIndex].status = status;

        alert("Airport service updated successfully.");
    }

    resetAirportServiceForm();
    renderAirportServices();

    return false;
}

function editAirportService(index) {
    let service = airportServices[index];

    editServiceIndex = index;

    document.getElementById("serviceBookingId").value = service.bookingId;
    document.getElementById("serviceGuestName").value = service.guestName;
    document.getElementById("serviceType").value = service.serviceType;
    document.getElementById("serviceDateTime").value = service.dateTime;
    document.getElementById("serviceStatus").value = service.status;

    document.getElementById("serviceSaveButton").value = "Update Service";
}

function cancelAirportService(index) {
    let service = airportServices[index];

    if (confirm("Are you sure you want to cancel this airport service?")) {
        service.status = "Cancelled";

        renderAirportServices();

        alert("Airport service cancelled successfully.");
    }
}

function resetAirportServiceForm() {
    editServiceIndex = -1;

    document.getElementById("airportServiceForm").reset();

    document.getElementById("serviceSaveButton").value = "Add Service";
}

function searchAirportService() {
    renderAirportServices();
}

function showAirportServiceForm() {
    resetAirportServiceForm();
}

renderAirportServices();

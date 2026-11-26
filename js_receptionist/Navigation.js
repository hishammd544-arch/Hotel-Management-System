const hotelNavigation = [
    { label: "Dashboard", file: "Receptionist Dashboard.html" },
    { label: "Room Availability", file: "RoomAvailability.html" },
    { label: "Booking Management", file: "Management.html" },
    { label: "Create Booking", file: "Booking.html" },
    { label: "Bill", file: "Bill.html" },
    { label: "Airport Service", file: "Airport.html" },
    { label: "Check-in / Check-out", file: "Check-inCheck-out.html" }
];

function loadHotelNavigation() {
    const currentPage = window.location.pathname.split("/").pop();
    let links = "";

    for (const item of hotelNavigation) {
        const activeClass = currentPage === item.file ? " active" : "";
        links += `<a class="${activeClass.trim()}" href="${item.file}">${item.label}</a>`;
    }

    const navbar = document.createElement("header");
    navbar.className = "navbar";
    navbar.innerHTML =
        `<div class="brand"><img src="images_receptionist/hotel logo.png" alt="Hotel logo"><span>Hotel Management System</span></div>` +
        `<nav aria-label="Main navigation">${links}</nav>`;

    const placeholder = document.getElementById("hotel-navbar");
    if (placeholder) {
        placeholder.replaceWith(navbar);
    } else {
        document.body.insertBefore(navbar, document.body.firstChild);
    }
}

loadHotelNavigation();

/* ROOM BOOKING - CREATE OPERATION */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Room Booking JavaScript Loaded!");

    const form = document.querySelector(".form-grid");

    if (!form) {
        console.error("Booking form not found!");
        return;
    }

    // JavaScript will handle validation
    form.noValidate = true;

    const category = document.getElementById("room-category");
    const checkIn = document.getElementById("check-in");
    const checkOut = document.getElementById("check-out");
    const guests = document.getElementById("guests");

    // Set minimum booking date
    checkIn.min = todayDate();
    checkOut.min = todayDate();

    checkIn.addEventListener("change", function () {

        checkOut.min = checkIn.value;

        if (checkOut.value && checkOut.value <= checkIn.value) {
            checkOut.value = "";
        }

    });

    // Success message area
    const message = document.createElement("div");

    message.id = "booking-message";

    message.style.marginTop = "15px";
    message.style.padding = "15px";
    message.style.borderRadius = "8px";
    message.style.display = "none";

    form.appendChild(message);

    // Form Submit Event
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("Booking Form Submitted!");

        const room = category.value;
        const inDate = checkIn.value;
        const outDate = checkOut.value;
        const guestNumber = guests.value;

        // Validation
        if (!room || !inDate || !outDate || !guestNumber) {

            alert("Please fill in all booking information.");

            return;
        }

        if (inDate < todayDate()) {

            alert("Check-in date cannot be in the past.");

            return;
        }

        if (outDate <= inDate) {

            alert("Check-out date must be after check-in date.");

            return;
        }

        // Check data.js functions
        if (typeof getBookings !== "function" ||
            typeof saveBookings !== "function") {

            alert("Error: data.js is not connected properly!");

            return;
        }

        // Get existing bookings
        const bookings = getBookings();

        // Create new booking
        const newBooking = {

            id: generateID(bookings, "B"),

            roomCategory:
                category.options[category.selectedIndex].text,

            checkIn: inDate,

            checkOut: outDate,

            guests: Number(guestNumber),

            status: "Pending",

            createdAt: todayDate()

        };

        // Save booking
        bookings.push(newBooking);

        const saved = saveBookings(bookings);

        if (!saved) {
            return;
        }

        // Display success message
        message.style.display = "block";

        message.style.background = "#e7f6ee";
        message.style.color = "#287653";

        message.innerHTML = `
            <h3>Booking Successful!</h3>
            <p>Booking ID: ${newBooking.id}</p>
            <p>Room: ${newBooking.roomCategory}</p>
            <p>Check-in: ${newBooking.checkIn}</p>
            <p>Check-out: ${newBooking.checkOut}</p>
            <p>Status: Pending</p>
        `;

        alert(
            "Booking Successful!\n" +
            "Your Booking ID: " + newBooking.id
        );

        // Reset form
        form.reset();

        checkIn.min = todayDate();
        checkOut.min = todayDate();

        console.log("Booking Saved:", newBooking);

    });

});
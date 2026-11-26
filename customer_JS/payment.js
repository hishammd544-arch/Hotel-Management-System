/* CUSTOMER PAYMENT MANAGEMENT */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Payment JavaScript Loaded!");

    const forms = document.querySelectorAll("form.stack-form");

    const form = Array.from(forms).find(function (item) {
        return item.querySelector("#booking-id") &&
            item.querySelector("#payment-amount");
    });

    const tableBody = document.querySelector(
        ".subpanel .table-wrap tbody"
    );

    if (!form) return;

    // Display Payment History
    function displayPayments() {

        if (!tableBody) return;

        const payments = getPayments();

        tableBody.innerHTML = "";

        if (payments.length === 0) {

            tableBody.innerHTML =
                '<tr><td colspan="5">No payment records found.</td></tr>';

            return;

        }

        payments.forEach(function (payment) {

            const row = document.createElement("tr");

            const values = [
                payment.id,
                payment.bookingId,
                "$" + payment.amount,
                payment.method,
                payment.status
            ];

            values.forEach(function (value) {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);

            });

            tableBody.appendChild(row);

        });

    }

    // Confirm Payment
    form.noValidate = true;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const bookingId =
            document.getElementById("booking-id").value.trim();

        const amount =
            Number(document.getElementById("payment-amount").value);

        const tip =
            Number(document.getElementById("tip-amount").value || 0);

        const method =
            form.querySelector('input[name="payment-method"]:checked');

        // Check Booking ID
        const bookings = getBookings();

        const booking = bookings.find(function (item) {

            return item.id.toLowerCase() === bookingId.toLowerCase();

        });

        if (!booking) {

            alert("Invalid Booking ID!");

            return;

        }

        if (!amount || amount <= 0 || tip < 0 || !method) {

            alert("Please enter valid payment information.");

            return;

        }

        const methodNames = {

            cash: "Cash on Arrival",

            card: "Credit/Debit Card",

            "mobile-banking": "Mobile Banking"

        };

        const payments = getPayments();

        payments.push({

            id: generateID(payments, "P"),

            bookingId: booking.id,

            amount: amount + tip,

            method: methodNames[method.value],

            status: method.value === "cash"
                ? "Pending"
                : "Payment Method Selected"

        });

        if (savePayments(payments)) {

            alert(
                "Payment Method Saved Successfully!\n" +
                "Booking ID: " + booking.id +
                "\nNo real payment has been processed."
            );

            form.reset();

            displayPayments();

        }

    });

    displayPayments();

});
/* CUSTOMER DASHBOARD */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Dashboard JavaScript Loaded!");

    const stats = document.querySelectorAll(
        ".stats-grid .stat-info h2"
    );

    if (stats.length < 4) return;

    const bookings = getBookings();

    const totalBookings = bookings.length;

    const activeBookings = bookings.filter(function (booking) {
        return booking.status === "Pending" ||
            booking.status === "Confirmed";
    }).length;

    const completedBookings = bookings.filter(function (booking) {
        return booking.status === "Completed";
    }).length;

    stats[0].textContent = totalBookings;
    stats[1].textContent = activeBookings;
    stats[2].textContent = completedBookings;

    // Demo available room count
    stats[3].textContent = "8";

    // Regular Customer Discount
    const validBookings = bookings.filter(function (booking) {
        return booking.status !== "Cancelled";
    });

    const quickGrid = document.querySelector(".quick-grid");

    if (quickGrid) {

        const discount = validBookings.length >= 3 ? 10 : 0;

        const discountCard = document.createElement("div");

        discountCard.className = "quick-card";

        discountCard.innerHTML = `
            <h3>Regular Customer Discount</h3>
            <p>
                ${discount > 0
                    ? "You qualify for " + discount + "% discount."
                    : "Complete 3 bookings to qualify for 10% discount."
                }
            </p>
        `;

        quickGrid.appendChild(discountCard);

    }

});
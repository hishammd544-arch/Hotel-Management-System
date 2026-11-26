
const bookings = [
    {
        id: "BK-001",
        guestName: "Guest One",
        roomNo: "101",
        checkOut: "12-05-2025",
        roomCharge: 8000,
        airportService: 1000,
        discount: 800,
        paymentMethod: "Cash",
        paymentStatus: "Paid"
    },
    {
        id: "BK-002",
        guestName: "Guest Two",
        roomNo: "203",
        checkOut: "15-05-2025",
        roomCharge: 4000,
        airportService: 1000,
        discount: 400,
        paymentMethod: "bKash",
        paymentStatus: "Pending"
    }
];

let selectedBooking = bookings[0];

function renderBills() {
    let search = document.getElementById("billSearch").value.toLowerCase();
    let rows = "";
    let count = 0;

    for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i];

        if (
            booking.id.toLowerCase().includes(search) ||
            booking.guestName.toLowerCase().includes(search)
        ) {
            rows += "<tr>" +
                "<td>" + booking.id + "</td>" +
                "<td>" + booking.guestName + "</td>" +
                "<td>" + booking.roomNo + "</td>" +
                "<td>" + booking.checkOut + "</td>" +
                "<td>" + booking.paymentMethod + "</td>" +
                "<td>" +
                "<button type='button' onclick='viewBill(" + i + ")'>View</button>" +
                "</td>" +
                "</tr>";

            count++;
        }
    }

    if (count === 0) {
        rows = "<tr><td colspan='6'>No booking found.</td></tr>";
    }

    document.getElementById("billTableBody").innerHTML = rows;
    document.getElementById("billCount").innerHTML = "Total Bills: " + count;
}

function viewBill(index) {
    selectedBooking = bookings[index];

    document.getElementById("billBookingId").innerHTML = selectedBooking.id;
    document.getElementById("billGuestName").innerHTML = selectedBooking.guestName;
    document.getElementById("billRoomNo").innerHTML = selectedBooking.roomNo;
    document.getElementById("billCheckOut").innerHTML = selectedBooking.checkOut;

    document.getElementById("roomCharge").innerHTML = "$" + selectedBooking.roomCharge;
    document.getElementById("airportCharge").innerHTML = "$" + selectedBooking.airportService;
    document.getElementById("discountAmount").innerHTML = "$" + selectedBooking.discount;

    let total = selectedBooking.roomCharge +
                selectedBooking.airportService -
                selectedBooking.discount;

    document.getElementById("totalAmount").innerHTML = "$" + total;

    document.getElementById("paymentMethod").value = selectedBooking.paymentMethod;
    document.getElementById("paymentStatus").value = selectedBooking.paymentStatus;
}

function updatePayment() {
    let method = document.getElementById("paymentMethod").value;
    let status = document.getElementById("paymentStatus").value;

    selectedBooking.paymentMethod = method;
    selectedBooking.paymentStatus = status;

    renderBills();
}

function generateReceipt() {
    let total = selectedBooking.roomCharge +
                selectedBooking.airportService -
                selectedBooking.discount;

    let receipt = `
        <h2>Hotel Paradise</h2>
        <h3>Payment Receipt</h3>
        <p>Booking ID: ${selectedBooking.id}</p>
        <p>Guest Name: ${selectedBooking.guestName}</p>
        <p>Room Number: ${selectedBooking.roomNo}</p>
        <p>Check-out Date: ${selectedBooking.checkOut}</p>
        <hr>
        <p>Room Charges: $${selectedBooking.roomCharge}</p>
        <p>Airport Service: $${selectedBooking.airportService}</p>
        <p>Discount: $${selectedBooking.discount}</p>
        <h3>Total Amount: $${total}</h3>
        <p>Payment Method: ${selectedBooking.paymentMethod}</p>
        <p>Payment Status: ${selectedBooking.paymentStatus}</p>
        <hr>
        <p>Thank you for staying with Hotel Paradise.</p>
    `;

    let receiptWindow = window.open("", "", "width=600,height=600");

    receiptWindow.document.write(
        "<html><head><title>Hotel Receipt</title></head><body>" +
        receipt +
        "</body></html>"
    );

    receiptWindow.document.close();
    receiptWindow.print();
}

document.getElementById("billSearch").addEventListener("input", renderBills);

document.getElementById("paymentMethod").addEventListener("change", updatePayment);

document.getElementById("paymentStatus").addEventListener("change", updatePayment);

renderBills();
viewBill(0);

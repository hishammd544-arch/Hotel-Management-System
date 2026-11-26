
const roomCategories = [
    {
        id: "standard",
        name: "Standard Room",
        size: "250 sq. ft.",
        price: 2500,
        available: 5,
        services: ["TV", "WiFi", "AC", "Attached Bathroom"],
        image: "../image/standard-room.jpg"
    },
    {
        id: "deluxe",
        name: "Deluxe Room",
        size: "400 sq. ft.",
        price: 4000,
        available: 3,
        services: ["TV", "Mini Fridge", "AC", "Attached Bathroom"],
        image: "../image/deluxe-room.jpg"
    },
    {
        id: "suite",
        name: "Suite Room",
        size: "700 sq. ft.",
        price: 7000,
        available: 2,
        services: ["TV", "Sofa", "AC", "Attached Bathroom"],
        image: "../image/suite-room.jpg"
    }
];

const bookings = [
    {
        id: "BK-001",
        guestName: "Guest One",
        roomNo: "101",
        roomType: "Standard",
        checkIn: "12-05-2025",
        checkOut: "14-05-2025",
        status: "Confirmed"
    },
    {
        id: "BK-002",
        guestName: "Guest Two",
        roomNo: "203",
        roomType: "Deluxe",
        checkIn: "12-05-2025",
        checkOut: "15-05-2025",
        status: "Checked-in"
    }
];

let selectedRoom = "standard";

function renderRoomCategories() {
    let container = document.getElementById("roomCategories");
    let output = "";

    for (let i = 0; i < roomCategories.length; i++) {
        let room = roomCategories[i];

        output += `
            <div class="room-card">

                <label>
                    <input type="radio"
                        name="roomCategory"
                        value="${room.id}"
                        ${selectedRoom === room.id ? "checked" : ""}
                        onchange="selectRoom('${room.id}')">

                    <strong>${room.name}</strong>
                </label>

                <img src="${room.image}"
                     alt="${room.name}"
                     id="image-${room.id}"
                     width="100%"
                     height="150">

                <input type="file"
                    accept="image/*"
                    onchange="uploadRoomImage(event, '${room.id}')">

                <p>Size: ${room.size}</p>

                <p>Price: Tk ${room.price.toLocaleString()}/night</p>

                <p>Available Rooms: ${room.available}</p>

                <strong>Services:</strong>

                <ul>
                    ${room.services.map(service => `<li>${service}</li>`).join("")}
                </ul>

            </div>
        `;
    }

    container.innerHTML = output;
}

function selectRoom(roomId) {
    selectedRoom = roomId;
}

function uploadRoomImage(event, roomId) {
    let file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
        let imageURL = URL.createObjectURL(file);

        document.getElementById("image-" + roomId).src = imageURL;
    }
}

function goToCreateBooking() {
    let room = roomCategories.find(function(item) {
        return item.id === selectedRoom;
    });

    if (room && room.available > 0) {
        sessionStorage.setItem("selectedRoom", JSON.stringify(room));
        window.location.href = "create-booking.html";
    } else {
        alert("No rooms available in this category.");
    }
}

function getRoomBookings() {
    return bookings;
}

renderRoomCategories();

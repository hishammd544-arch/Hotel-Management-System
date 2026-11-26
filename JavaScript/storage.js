
const KEYS = {
    FOOD: "foodOrders",
    ISSUES: "roomIssues",
    AMENITIES: "amenityRequests",
    USER: "currentUser"            // { name: "...", role: "..." }
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


/* ---------- Tiny database helper ---------- */
const DB = {

    // Read a list (returns [] if nothing saved yet)
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            return [];
        }
    },

    // Save a list
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Next ID like FO004, IR004, AR004
    nextId(prefix, list) {
        const highest = list.reduce((max, item) => {
            const num = parseInt(String(item.id).replace(/\D/g, ""), 10) || 0;
            return Math.max(max, num);
        }, 0);
        return prefix + String(highest + 1).padStart(3, "0");
    },

    // Save demo data only the very first time
    init(key, seed) {
        if (localStorage.getItem(key) === null) {
            DB.set(key, seed);
        }
    },

    // Type DB.reset() in the browser console to get the demo data back
    reset() {
        [KEYS.FOOD, KEYS.ISSUES, KEYS.AMENITIES].forEach(key => localStorage.removeItem(key));
        location.reload();
    }
};


/* ---------- Helper functions ---------- */

function pad(n) {
    return String(n).padStart(2, "0");
}

// Current time as  "2026-11-07 10:30 AM"
function formatNow() {
    const d = new Date();
    let hours = d.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(hours)}:${pad(d.getMinutes())} ${ampm}`;
}

// "2026-11-07 10:30 AM"  ->  timestamp (number). Returns 0 if it can't be read.
function parseTime(str) {
    const m = /(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(str || "");
    if (!m) return 0;
    let hours = parseInt(m[4], 10) % 12;
    if (m[6].toUpperCase() === "PM") hours += 12;
    return new Date(+m[1], +m[2] - 1, +m[3], hours, +m[5]).getTime();
}

// "2026-11-07 10:30 AM"  ->  "10:30 AM"
function timeOnly(str) {
    return String(str || "").replace(/^\d{4}-\d{2}-\d{2}\s+/, "");
}

// Today -> "10:30 AM", other days -> "07 Nov, 10:30 AM"
function friendlyTime(str) {
    const ts = parseTime(str);
    if (!ts) return str || "";
    const d = new Date(ts);
    if (d.toDateString() === new Date().toDateString()) {
        return timeOnly(str);
    }
    return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}, ${timeOnly(str)}`;
}

// Stops user text from being run as HTML (use it whenever you build rows with innerHTML)
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// "Eating Finished" -> "eating-finished" (matches the CSS .status classes)
function statusClass(status) {
    return String(status).toLowerCase().replace(/\s+/g, "-");
}

// Room numbers like 305, 12, A101
function isValidRoom(value) {
    return /^[A-Za-z0-9-]{1,6}$/.test(value);
}


/* ---------- Demo data (copied from your HTML pages) ---------- */

function foodOrder(id, room, item, qty, status, time, trayStatus = "", collectedTime = "") {
    return {
        id, room, item, qty, status, time, trayStatus, collectedTime,
        createdAt: parseTime(time)
    };
}

function simpleRow(fields) {
    return { ...fields, createdAt: parseTime(fields.time) };
}

DB.init(KEYS.FOOD, [
    foodOrder("FO001", "305", "Chicken Burger", 2, "Pending",   "2026-11-07 10:30 AM"),
    foodOrder("FO002", "302", "Fried Rice",     1, "Preparing", "2026-11-07 09:15 AM"),
    foodOrder("FO003", "308", "Pasta",          2, "Delivered", "2026-11-06 08:20 PM"),

    // Tray alerts (customer finished eating)
    foodOrder("FO101", "305", "Chicken Burger", 1, "Delivered", "2026-11-07 10:00 AM", "Eating Finished"),
    foodOrder("FO102", "308", "Fried Rice",     1, "Delivered", "2026-11-07 10:15 AM", "Eating Finished"),

    // Tray collection history
    foodOrder("FO098", "302", "Pasta",    1, "Delivered", "2026-11-07 10:30 AM", "Tray Collected", "2026-11-07 11:05 AM"),
    foodOrder("FO099", "307", "Soup",     1, "Delivered", "2026-11-07 10:40 AM", "Tray Collected", "2026-11-07 11:10 AM"),
    foodOrder("FO100", "305", "Sandwich", 1, "Delivered", "2026-11-07 10:45 AM", "Tray Collected", "2026-11-07 11:20 AM")
]);

DB.init(KEYS.ISSUES, [
    simpleRow({ id: "IR001", room: "305", description: "AC not working",    status: "Solved",     time: "2026-11-07 08:45 AM" }),
    simpleRow({ id: "IR002", room: "308", description: "TV not working",    status: "Processing", time: "2026-11-07 09:30 AM" }),
    simpleRow({ id: "IR003", room: "301", description: "Water supply issue", status: "Solved",    time: "2026-11-06 07:50 PM" })
]);

DB.init(KEYS.AMENITIES, [
    simpleRow({ id: "AR001", room: "305", item: "Extra Towel",  time: "2026-11-07 09:10 AM" }),
    simpleRow({ id: "AR002", room: "301", item: "Water Bottle", time: "2026-11-07 09:20 AM" }),
    simpleRow({ id: "AR003", room: "308", item: "Soap",         time: "2026-11-07 10:05 AM" })
]);


// Order placement er 10 minute pore automatically Tray Collection e pathiye dey
function checkAutoTrayCollection() {
    const orders = DB.get(KEYS.FOOD);
    const now = Date.now();
    const TEN_MINUTES = 10 * 60 * 1000;
    let changed = false;

    orders.forEach(order => {
        const placedAt = order.createdAt || parseTime(order.time);

        if (!order.trayStatus && placedAt && (now - placedAt >= TEN_MINUTES)) {
            order.trayStatus = "Eating Finished";
            changed = true;
        }
    });

    if (changed) {
        DB.set(KEYS.FOOD, orders);
        window.dispatchEvent(new Event("storage")); // sob page ke janiye dibe je data change hoise
    }
}
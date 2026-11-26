
const REQUIRE_LOGIN = false;


/* ---------- Toast message (small popup, bottom-right) ---------- */

(function addToastStyles() {
    const style = document.createElement("style");
    style.textContent = `
        #toast {
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 9999;
            padding: 12px 18px;
            border-radius: 8px;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: translateY(12px);
            transition: opacity 0.25s ease, transform 0.25s ease;
            pointer-events: none;
        }
        #toast.show    { opacity: 1; transform: none; }
        #toast.success { background: #19a34a; }
        #toast.error   { background: #d62835; }
        #toast.info    { background: #0875dc; }
    `;
    document.head.appendChild(style);
})();


/* ---------- Auto Tray Collection (order place howar 10 min pore automatic alert) ---------- */

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


// showToast("Order added", "success")   types: success | error | info
function showToast(message, type = "success") {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `${type} show`;

    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}


/* ---------- Login check, profile name, logout ---------- */

document.addEventListener("DOMContentLoaded", () => {

    checkAutoTrayCollection();                      // page load hobar shathe shathe ekbar check
    setInterval(checkAutoTrayCollection, 15000);     // tarpor every 15 sec check hote thakbe

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem(KEYS.USER));
    } catch (error) {
        user = null;
    }

    // Not logged in -> back to the login page
    if (REQUIRE_LOGIN && !user) {
        window.location.href = "login.html";
        return;
    }

    // Show the logged-in name in the top-right profile box
    const nameBox = document.querySelector(".profile span:nth-child(2)");
    if (user && user.name && nameBox) {
        nameBox.textContent = user.name;
    }

    // Logout link: clear the session, then let the link go to login.html
    const logoutLink = document.querySelector('.sidebar-menu a[href="login.html"]');
    if (logoutLink) {
        logoutLink.addEventListener("click", () => {
            localStorage.removeItem(KEYS.USER);
        });
    }
});
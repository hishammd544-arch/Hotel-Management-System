

document.addEventListener("DOMContentLoaded", () => {

    const alertBody = document.querySelector(".tray-alert-section tbody");
    const historyBody = document.querySelector(".tray-history-section tbody");


    /* ---------- Show both tables ---------- */

    function render() {

        const orders = DB.get(KEYS.FOOD);

        const alerts = orders.filter(order => order.trayStatus === "Eating Finished");

        const history = orders
            .filter(order => order.trayStatus === "Tray Collected")
            .sort((a, b) => parseTime(b.collectedTime) - parseTime(a.collectedTime));   // latest first

        /* Alerts */
        if (alerts.length === 0) {
            alertBody.innerHTML = `<tr><td colspan="6">No trays waiting for collection.</td></tr>`;
        } else {
            alertBody.innerHTML = alerts.map(order => `
                <tr data-id="${escapeHTML(order.id)}">
                    <td>${escapeHTML(order.id)}</td>
                    <td>${escapeHTML(order.room)}</td>
                    <td>${escapeHTML(order.item)}</td>
                    <td>${escapeHTML(timeOnly(order.time))}</td>
                    <td><span class="status eating-finished">Eating Finished</span></td>
                    <td><button type="button" class="collect-btn">Collect Tray</button></td>
                </tr>
            `).join("");
        }

        /* History */
        if (history.length === 0) {
            historyBody.innerHTML = `<tr><td colspan="5">No trays collected yet.</td></tr>`;
        } else {
            historyBody.innerHTML = history.map(order => `
                <tr>
                    <td>${escapeHTML(order.id)}</td>
                    <td>${escapeHTML(order.room)}</td>
                    <td>${escapeHTML(order.item)}</td>
                    <td>${escapeHTML(timeOnly(order.collectedTime))}</td>
                    <td><span class="status tray-collected">Tray Collected</span></td>
                </tr>
            `).join("");
        }
    }


    /* ---------- Collect Tray button ---------- */

    alertBody.addEventListener("click", (event) => {

        const button = event.target.closest(".collect-btn");
        if (!button) return;

        const id = button.closest("tr").dataset.id;

        const orders = DB.get(KEYS.FOOD);
        const order = orders.find(o => o.id === id);

        if (!order) {
            showToast("This order no longer exists", "error");
            render();
            return;
        }

        order.trayStatus = "Tray Collected";
        order.collectedTime = formatNow();
        DB.set(KEYS.FOOD, orders);

        showToast(`Tray collected from room ${order.room}`);
        render();
    });

    // New alerts from the customer page show up without a refresh
    window.addEventListener("storage", render);

    render();
});

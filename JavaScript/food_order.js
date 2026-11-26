
document.addEventListener("DOMContentLoaded", () => {

    const STATUSES = ["Pending", "Preparing", "Delivered"];

    const form = document.querySelector(".order-form-section form");
    const roomInput = document.getElementById("room-number");
    const itemSelect = document.getElementById("food-item");
    const qtyInput = document.getElementById("quantity");
    const submitBtn = form.querySelector(".add-order-btn");

    const searchForm = document.querySelector(".food-order-list .search-filter form");
    const searchInput = searchForm.querySelector('input[name="search"]');
    const statusFilter = document.getElementById("status-filter");
    const tbody = document.querySelector(".food-order-list tbody");

    let editingId = null;     // ID of the order being edited (null = adding a new one)
    let statusGroup = null;   // "Status" dropdown, created only when editing
    let cancelBtn = null;     // "Cancel" button, created only when editing


    /* ---------- Show the table ---------- */

    function render() {

        const query = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;

        const orders = DB.get(KEYS.FOOD).filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(query) ||
                String(order.room).toLowerCase().includes(query);
            const matchesStatus = status === "" || order.status === status;
            return matchesSearch && matchesStatus;
        });

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8">No orders found.</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr data-id="${escapeHTML(order.id)}">
                <td>${escapeHTML(order.id)}</td>
                <td>${escapeHTML(order.room)}</td>
                <td>${escapeHTML(order.item)}</td>
                <td>${escapeHTML(order.qty)}</td>
                <td>${escapeHTML(order.time)}</td>
                <td>
                    <span class="status ${statusClass(order.status)}">${escapeHTML(order.status)}</span>
                </td>
                <td><button type="button" class="edit-btn">Edit</button></td>
                <td><button type="button" class="delete-btn">Delete</button></td>
            </tr>
        `).join("");
    }


    /* ---------- Edit mode ---------- */

    function enterEditMode(order) {

        editingId = order.id;

        roomInput.value = order.room;
        qtyInput.value = order.qty;

        // If the item is not in the dropdown (e.g. added from another page), add it
        const hasItem = Array.from(itemSelect.options).some(option => option.value === order.item);
        if (!hasItem) {
            itemSelect.add(new Option(order.item, order.item));
        }
        itemSelect.value = order.item;

        submitBtn.textContent = "Update Order";

        // Status dropdown (only while editing)
        if (!statusGroup) {
            statusGroup = document.createElement("div");
            statusGroup.className = "form-group";
            statusGroup.innerHTML = `
                <label for="order-status">Status</label>
                <select id="order-status" name="status">
                    ${STATUSES.map(s => `<option value="${s}">${s}</option>`).join("")}
                </select>
            `;
        }
        statusGroup.querySelector("select").value = order.status;
        submitBtn.before(statusGroup);

        // Cancel button (only while editing)
        if (!cancelBtn) {
            cancelBtn = document.createElement("button");
            cancelBtn.type = "button";
            cancelBtn.className = "delete-btn";
            cancelBtn.textContent = "Cancel";
            cancelBtn.addEventListener("click", exitEditMode);
        }
        submitBtn.after(cancelBtn);

        form.scrollIntoView({ behavior: "smooth", block: "start" });
        roomInput.focus();
    }

    function exitEditMode() {
        editingId = null;
        form.reset();                       // quantity goes back to 1
        submitBtn.textContent = "Add Order";
        if (statusGroup) statusGroup.remove();
        if (cancelBtn) cancelBtn.remove();
    }


    /* ---------- Add / Update ---------- */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const room = roomInput.value.trim();
        const item = itemSelect.value;
        const qty = parseInt(qtyInput.value, 10);

        if (!isValidRoom(room)) {
            showToast("Enter a valid room number, for example 305", "error");
            roomInput.focus();
            return;
        }
        if (!item) {
            showToast("Select a food item", "error");
            itemSelect.focus();
            return;
        }
        if (!Number.isInteger(qty) || qty < 1) {
            showToast("Quantity must be 1 or more", "error");
            qtyInput.focus();
            return;
        }

        const orders = DB.get(KEYS.FOOD);

        if (editingId) {

            const order = orders.find(o => o.id === editingId);

            if (!order) {
                showToast("This order no longer exists", "error");
                exitEditMode();
                render();
                return;
            }

            order.room = room;
            order.item = item;
            order.qty = qty;
            order.status = statusGroup.querySelector("select").value;

            // A tray alert only makes sense for a delivered order
            if (order.status !== "Delivered") {
                order.trayStatus = "";
                order.collectedTime = "";
            }

            showToast(`Order ${order.id} updated`);

        } else {

            const newOrder = {
                id: DB.nextId("FO", orders),
                room,
                item,
                qty,
                status: "Pending",
                trayStatus: "",
                collectedTime: "",
                time: formatNow(),
                createdAt: Date.now()
            };

            orders.push(newOrder);
            showToast(`Order ${newOrder.id} added`);
        }

        DB.set(KEYS.FOOD, orders);
        exitEditMode();
        render();
    });


    /* ---------- Edit / Delete buttons inside the table ---------- */

    tbody.addEventListener("click", (event) => {

        const row = event.target.closest("tr[data-id]");
        if (!row) return;

        const id = row.dataset.id;

        if (event.target.closest(".edit-btn")) {
            const order = DB.get(KEYS.FOOD).find(o => o.id === id);
            if (order) enterEditMode(order);
        }

        if (event.target.closest(".delete-btn")) {
            if (!confirm(`Delete order ${id}?`)) return;

            DB.set(KEYS.FOOD, DB.get(KEYS.FOOD).filter(o => o.id !== id));

            if (editingId === id) exitEditMode();

            showToast(`Order ${id} deleted`);
            render();
        }
    });


    /* ---------- Search and filter ---------- */

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        render();
    });
    searchInput.addEventListener("input", render);
    statusFilter.addEventListener("change", render);

    // If another tab changes the data, refresh the table
    window.addEventListener("storage", render);

    render();
});

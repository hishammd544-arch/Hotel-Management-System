
document.addEventListener("DOMContentLoaded", () => {

    // To add a new item, add it here. Dropdown and list both update.
    const AVAILABLE_ITEMS = ["Extra Towel", "Water Bottle", "Soap", "Toiletries Kit", "Pillow"];

    const form = document.querySelector(".add-amenities-card form");
    const roomInput = document.getElementById("room-number");
    const itemSelect = document.getElementById("item-name");
    const availableList = document.querySelector(".available-items-list");

    const searchForm = document.querySelector(".amenities-request-list .search-section form");
    const searchInput = searchForm.querySelector('input[name="search"]');
    const tbody = document.querySelector(".amenities-request-list tbody");


    /* ---------- Fill the dropdown and the Available Items list ---------- */

    itemSelect.innerHTML =
        `<option value="">Select Item</option>` +
        AVAILABLE_ITEMS.map(item => `<option value="${item}">${item}</option>`).join("");

    availableList.innerHTML = AVAILABLE_ITEMS.map(item => `<li>✔ ${item}</li>`).join("");


    /* ---------- Show the table ---------- */

    function render() {

        const query = searchInput.value.trim().toLowerCase();

        const requests = DB.get(KEYS.AMENITIES).filter(request =>
            String(request.room).toLowerCase().includes(query)
        );

        if (requests.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No requests found.</td></tr>`;
            return;
        }

        tbody.innerHTML = requests.map(request => `
            <tr data-id="${escapeHTML(request.id)}">
                <td>${escapeHTML(request.id)}</td>
                <td>${escapeHTML(request.room)}</td>
                <td>${escapeHTML(request.item)}</td>
                <td>${escapeHTML(request.time)}</td>
                <td><button type="button" class="delete-btn">Delete</button></td>
            </tr>
        `).join("");
    }


    /* ---------- Add a request ---------- */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const room = roomInput.value.trim();
        const item = itemSelect.value;

        if (!isValidRoom(room)) {
            showToast("Enter a valid room number, for example 305", "error");
            roomInput.focus();
            return;
        }
        if (!item) {
            showToast("Select an item", "error");
            itemSelect.focus();
            return;
        }

        const requests = DB.get(KEYS.AMENITIES);

        const newRequest = {
            id: DB.nextId("AR", requests),
            room,
            item,
            time: formatNow(),
            createdAt: Date.now()
        };

        requests.push(newRequest);
        DB.set(KEYS.AMENITIES, requests);

        form.reset();
        showToast(`Request ${newRequest.id} added`);
        render();
    });


    /* ---------- Delete button inside the table ---------- */

    tbody.addEventListener("click", (event) => {

        if (!event.target.closest(".delete-btn")) return;

        const id = event.target.closest("tr").dataset.id;

        if (!confirm(`Delete request ${id}?`)) return;

        DB.set(KEYS.AMENITIES, DB.get(KEYS.AMENITIES).filter(r => r.id !== id));

        showToast(`Request ${id} deleted`);
        render();
    });


    /* ---------- Search ---------- */

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        render();
    });
    searchInput.addEventListener("input", render);

    // If another tab changes the data, refresh the table
    window.addEventListener("storage", render);

    render();
});

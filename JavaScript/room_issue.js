

document.addEventListener("DOMContentLoaded", () => {

    const STATUSES = ["Pending", "Processing", "Solved"];

    const form = document.querySelector(".report-form-card form");
    const roomInput = document.getElementById("room-number");
    const descInput = document.getElementById("problem-description");

    const searchForm = document.querySelector(".issue-report-list .search-section form");
    const searchInput = searchForm.querySelector('input[name="search"]');
    const tbody = document.querySelector(".issue-report-list tbody");


    /* ---------- Show the table ---------- */

    function render() {

        const query = searchInput.value.trim().toLowerCase();

        const issues = DB.get(KEYS.ISSUES).filter(issue =>
            String(issue.room).toLowerCase().includes(query)
        );

        if (issues.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No issues found.</td></tr>`;
            return;
        }

        tbody.innerHTML = issues.map(issue => `
            <tr data-id="${escapeHTML(issue.id)}">
                <td>${escapeHTML(issue.id)}</td>
                <td>${escapeHTML(issue.room)}</td>
                <td>${escapeHTML(issue.description)}</td>
                <td>
                    <select>
                        ${STATUSES.map(status => `
                            <option value="${status}" ${status === issue.status ? "selected" : ""}>${status}</option>
                        `).join("")}
                    </select>
                </td>
                <td><button type="button" class="update-btn">Update</button></td>
                <td><button type="button" class="delete-btn">Delete</button></td>
            </tr>
        `).join("");
    }


    /* ---------- Report a new issue ---------- */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const room = roomInput.value.trim();
        const description = descInput.value.trim();

        if (!isValidRoom(room)) {
            showToast("Enter a valid room number, for example 305", "error");
            roomInput.focus();
            return;
        }
        if (description.length < 3) {
            showToast("Describe the problem in a few words", "error");
            descInput.focus();
            return;
        }

        const issues = DB.get(KEYS.ISSUES);

        const newIssue = {
            id: DB.nextId("IR", issues),
            room,
            description,
            status: "Pending",
            time: formatNow(),
            createdAt: Date.now()
        };

        issues.push(newIssue);
        DB.set(KEYS.ISSUES, issues);

        form.reset();
        showToast(`Issue ${newIssue.id} reported`);
        render();
    });


    /* ---------- Update / Delete buttons inside the table ---------- */

    tbody.addEventListener("click", (event) => {

        const row = event.target.closest("tr[data-id]");
        if (!row) return;

        const id = row.dataset.id;

        if (event.target.closest(".update-btn")) {

            const issues = DB.get(KEYS.ISSUES);
            const issue = issues.find(i => i.id === id);

            if (!issue) {
                showToast("This issue no longer exists", "error");
                render();
                return;
            }

            issue.status = row.querySelector("select").value;
            DB.set(KEYS.ISSUES, issues);

            showToast(`Issue ${id} set to ${issue.status}`);
        }

        if (event.target.closest(".delete-btn")) {
            if (!confirm(`Delete issue ${id}?`)) return;

            DB.set(KEYS.ISSUES, DB.get(KEYS.ISSUES).filter(i => i.id !== id));

            showToast(`Issue ${id} deleted`);
            render();
        }
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

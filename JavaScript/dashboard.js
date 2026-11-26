
document.addEventListener("DOMContentLoaded", () => {

    const counters = document.querySelectorAll(".summary-card h2");
    const activityList = document.querySelector(".activity-list");

    function render() {

        const orders = DB.get(KEYS.FOOD);
        const issues = DB.get(KEYS.ISSUES);
        const amenities = DB.get(KEYS.AMENITIES);
        const trayAlerts = orders.filter(order => order.trayStatus === "Eating Finished");

        /* Summary cards: Orders, Issues, Tray Alerts, Amenities (same order as the HTML) */
        const totals = [orders.length, issues.length, trayAlerts.length, amenities.length];

        counters.forEach((counter, index) => {
            if (totals[index] !== undefined) {
                counter.textContent = totals[index];
            }
        });

        /* Recent activities: merge all three lists, newest first, keep 5 */
        const activities = [

            ...orders.map(order => ({
                icon: "🍗",
                room: order.room,
                text: `Food order placed (${order.item})`,
                time: order.time,
                stamp: order.createdAt || parseTime(order.time)
            })),

            ...issues.map(issue => ({
                icon: "🔧",
                room: issue.room,
                text: `Issue reported (${issue.description})`,
                time: issue.time,
                stamp: issue.createdAt || parseTime(issue.time)
            })),

            ...amenities.map(request => ({
                icon: "🧳",
                room: request.room,
                text: `Amenities requested (${request.item})`,
                time: request.time,
                stamp: request.createdAt || parseTime(request.time)
            }))

        ]
            .sort((a, b) => b.stamp - a.stamp)
            .slice(0, 5);

        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <span class="activity-description">No activity yet. New orders, issues and requests will show up here.</span>
                </div>`;
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-icon">${activity.icon}</span>
                <span class="room-number">Room ${escapeHTML(activity.room)}</span>
                <span class="activity-description">- ${escapeHTML(activity.text)}</span>
                <span class="activity-time">${escapeHTML(friendlyTime(activity.time))}</span>
            </div>
        `).join("");
    }

    render();

    // If another tab (e.g. the customer page) changes the data, refresh the numbers
    window.addEventListener("storage", render);
});

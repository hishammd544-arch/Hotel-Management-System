document.addEventListener("DOMContentLoaded", function () {
    let user = null;
    try { user = JSON.parse(localStorage.getItem("hmsCurrentUser")); } catch (error) { user = null; }
    const profileName = document.querySelectorAll(".profile span");
    if (user && user.name) { profileName.forEach(item => { item.textContent = user.name; }); }
});

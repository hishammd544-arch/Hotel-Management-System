document.addEventListener("DOMContentLoaded", function () {
    // Customer sidebar Logout link points to login.html and is handled here.
    document.querySelectorAll('.sidebar-menu a[href="login.html"]').forEach(function (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("hmsCurrentUser");
                sessionStorage.clear();
                alert("Logout successful.");
                window.location.href = "login.html";
            }
        });
    });
});

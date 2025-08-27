// student-serch/student.js

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.removeItem("user");

        window.location.href = "../index.html";
    });
});

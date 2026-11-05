
const loginForm = document.getElementById("loginForm");
const closeBtn = document.getElementById("closeBtn");

// Close login popup
closeBtn.addEventListener("click", function () {
    window.parent.postMessage("closeLoginModal", "*");
});

// Login form submission
loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Email:", email);
    console.log("Password:", password);

    alert("Login form submitted successfully!");

});

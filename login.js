const authForm = document.getElementById("authForm");

const nameGroup = document.getElementById("nameGroup");
const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

const submitBtn = document.getElementById("submitBtn");
const switchMode = document.getElementById("switchMode");
const switchMessage = document.getElementById("switchMessage");

const message = document.getElementById("message");

let isSignup = false;

// Check whether user is already logged in
const currentUser = JSON.parse(
    localStorage.getItem("campusQuizCurrentUser")
);

if (currentUser && currentUser.email) {
    window.location.href = "Home.html";
}

// Switch between Login and Signup
switchMode.addEventListener("click", function (event) {

    event.preventDefault();

    isSignup = !isSignup;

    message.textContent = "";

    if (isSignup) {

        formTitle.textContent = "Create Account";
        formSubtitle.textContent = "Join Campus Quiz Arena today.";

        nameGroup.hidden = false;
        nameInput.required = true;

        submitBtn.textContent = "Create Account";
        switchMessage.textContent = "Already have an account?";
        switchMode.textContent = "Login";

    } else {

        formTitle.textContent = "Welcome Back!";
        formSubtitle.textContent = "Login to continue your learning journey.";

        nameGroup.hidden = true;
        nameInput.required = false;

        submitBtn.textContent = "Login";
        switchMessage.textContent = "Don't have an account?";
        switchMode.textContent = "Create Account";
    }

});

// Form Submit
authForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    let users = JSON.parse(
        localStorage.getItem("campusQuizUsers")
    ) || [];

    // Create Account
    if (isSignup) {

        if (name.length < 2) {
            showMessage("Please enter your full name.", "red");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters.", "red");
            return;
        }

        const existingUser = users.find(function (user) {
            return user.email === email;
        });

        if (existingUser) {
            showMessage("This email is already registered.", "red");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem(
            "campusQuizUsers",
            JSON.stringify(users)
        );

        localStorage.setItem(
            "campusQuizCurrentUser",
            JSON.stringify({
                name: name,
                email: email
            })
        );

        showMessage("Account created successfully!", "green");

        setTimeout(function () {
            window.location.href = "Home.html";
        }, 700);

    }

    // Login
    else {

        const user = users.find(function (user) {

            return user.email === email &&
                   user.password === password;

        });

        if (!user) {
            showMessage("Invalid email or password.", "red");
            return;
        }

        localStorage.setItem(
            "campusQuizCurrentUser",
            JSON.stringify({
                name: user.name,
                email: user.email
            })
        );

        showMessage("Login successful!", "green");

        setTimeout(function () {
            window.location.href = "Home.html";
        }, 700);

    }

});

// Display messages
function showMessage(text, color) {

    message.textContent = text;
    message.style.color = color;

}
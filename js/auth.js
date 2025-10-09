// auth.js

// --- Helper Functions ---
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// --- Registration ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = getUsers();
    const userExists = users.find(u => u.email === email);

    if (userExists) {
      alert("Email already registered!");
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html"; // Redirect to login
  });
}

// --- Login ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password!");
      return;
    }

    // Save current logged-in user
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Welcome, ${user.name}!`);
    window.location.href = "dashboard.html"; // Redirect to dashboard
  });
}

const demoCredentials = {
  email: "traveler@everycityplan.com",
  password: "demo123",
};

const loginForm = document.getElementById("login-form");
const statusEl = document.getElementById("status");
const togglePasswordBtn = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

function showStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.dataset.type = type;
}

function validateCredentials(email, password) {
  if (!email || !password) {
    showStatus("Email and password are required.", "error");
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isDemo =
    normalizedEmail === demoCredentials.email && password === demoCredentials.password;

  if (isDemo) {
    showStatus("Login successful. Opening your plan…", "success");
    return true;
  }

  showStatus("Invalid credentials. Try the demo login to preview the experience.", "error");
  return false;
}

function togglePassword() {
  const currentlyHidden = passwordInput.type === "password";
  passwordInput.type = currentlyHidden ? "text" : "password";
  togglePasswordBtn.textContent = currentlyHidden ? "Hide" : "Show";
  togglePasswordBtn.setAttribute("aria-pressed", String(currentlyHidden));
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  const isValid = loginForm.reportValidity();
  if (!isValid) return;

  validateCredentials(email, password);
});

togglePasswordBtn.addEventListener("click", togglePassword);

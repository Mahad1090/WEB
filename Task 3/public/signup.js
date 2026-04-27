const form = document.getElementById("signupForm");
const statusText = document.getElementById("status");

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#b91c1c" : "#065f46";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ username, password }),
  });

  const message = await response.text();
  if (!response.ok) {
    setStatus(message, true);
    return;
  }

  setStatus(`${message}. Redirecting to login...`);
  setTimeout(() => {
    window.location.href = "/login";
  }, 700);
});

const welcome = document.getElementById("welcome");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

function setWelcome(message, isError = false) {
  welcome.textContent = message;
  welcome.style.color = isError ? "#b91c1c" : "#065f46";
}

async function loadDashboard() {
  const response = await fetch("/api/dashboard", {
    method: "GET",
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    const message = await response.text();
    setWelcome(message || "Could not load dashboard", true);
    return;
  }

  const data = await response.json();
  setWelcome(data.message);
}

refreshBtn.addEventListener("click", loadDashboard);

logoutBtn.addEventListener("click", async () => {
  const response = await fetch("/api/logout", {
    method: "GET",
    credentials: "same-origin",
  });

  const message = await response.text();
  if (!response.ok) {
    setWelcome(message, true);
    return;
  }

  window.location.href = "/login";
});

loadDashboard();

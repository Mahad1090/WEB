const output = document.getElementById("output");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const dashboardBtn = document.getElementById("dashboardBtn");
const logoutBtn = document.getElementById("logoutBtn");

function show(message) {
  output.textContent = message;
}

async function callApi(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const message = await response.text();
    return { ok: response.ok, status: response.status, message };
  } catch (error) {
    return { ok: false, status: 0, message: `Network error: ${error.message}` };
  }
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;

  const result = await callApi("/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  show(`Register (${result.status}): ${result.message}`);
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const result = await callApi("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  show(`Login (${result.status}): ${result.message}`);
});

dashboardBtn.addEventListener("click", async () => {
  const result = await callApi("/dashboard", { method: "GET" });
  show(`Dashboard (${result.status}): ${result.message}`);
});

logoutBtn.addEventListener("click", async () => {
  const result = await callApi("/logout", { method: "GET" });
  show(`Logout (${result.status}): ${result.message}`);
});

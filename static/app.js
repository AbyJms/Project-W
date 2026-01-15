function goTo(path) {
  window.location.href = path;
}

function selectRole(role) {
  // 🔥 PLAYER FLOW — DO NOT TOUCH BACKEND
  if (role === "player") {
    window.location.href = "http://172.17.105.224:8000/";
    return;
  }

  // Household / Collector → Auth
  sessionStorage.setItem("selectedRole", role);
  goTo("/auth");
}

document.getElementById("authForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  // Login first
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  .then(r => {
    if (r.ok) return r.json();

    // Not found → register (ONLY for non-player)
    return fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone })
    }).then(r => r.json());
  })
  .then(d => {
    if (d.role === "collector") {
      goTo("/collector");
    } else {
      goTo("/household");
    }
  });
});

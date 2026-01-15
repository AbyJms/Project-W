function goTo(path) {
  window.location.href = path;
}

function selectRole(role) {
  sessionStorage.setItem("selectedRole", role);
  goTo("/auth");
}

document.getElementById("authForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  // Try login first
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  .then(r => {
    if (r.ok) return r.json();
    // If not found → register
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

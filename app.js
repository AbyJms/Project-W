// Global navigation helper
function goTo(page) {
  window.location.href = page;
}

// Landing page
function startProject() {
  goTo("/role");
}

// Role selection
function selectRole(role) {
  // store role for later (dashboard routing)
  localStorage.setItem("projectW_role", role);
  goTo("/auth");
}

// Auth page
function goBackHome() {
  goTo("/");
}

function signIn(e) {
  e.preventDefault();

  fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: document.querySelector("input[type=email]").value,
      password: document.querySelector("input[type=password]").value,
      role: localStorage.getItem("projectW_role")
    })
  })
  .then(r => r.json())
  .then(d => {
    if (!d.ok) return alert("Invalid login");
    alert("Logged in as " + d.role);
  });
}

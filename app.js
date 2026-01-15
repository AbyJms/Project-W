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

  const role = localStorage.getItem("projectW_role");

  // demo only
  alert(`Signed in as ${role}`);

  // later:
  // if (role === "household") goTo("/household-dashboard");
  // if (role === "collector") goTo("/collector-dashboard");
  // if (role === "admin") goTo("/admin-dashboard");
}

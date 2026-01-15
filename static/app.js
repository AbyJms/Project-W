function goTo(path) {
  window.location.href = path;
}

function selectRole(role) {
  localStorage.setItem("projectW_role", role);
  goTo("/auth");
}

function signIn(e) {
  e.preventDefault();

  const role = localStorage.getItem("projectW_role");
  alert(`Logged in as ${role}`);

  // future redirect:
  // if (role === "household") goTo("/household-dashboard");
}

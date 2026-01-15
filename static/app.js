function goTo(path) {
  window.location.href = path;
}

function selectRole(role) {
  // Player → direct Stranger Trash / Trash Dash
  if (role === "player") {
    window.location.href = "http://172.17.105.224:8000/"; // 🔴 REPLACE WITH REAL SERVER IP
    return;
  }

  // Household & Collector → Auth page
  sessionStorage.setItem("selectedRole", role);
  window.location.href = "/auth";
}

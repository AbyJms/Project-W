function selectRole(role) {
  // store role for later use after login
  sessionStorage.setItem("selectedRole", role);

  // redirect to sign-in page
  window.location.href = "/auth";
}

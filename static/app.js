function goTo(path) {
  window.location.href = path;
}

function selectRole(role) {
  if (role === "player") {
    window.location.href = "http://172.17.105.224:8000/";
    return;
  }

  if (role === "collector") {
    goTo("/collector-auth");
    return;
  }

  goTo("/auth");
}

/* ---------- HOUSEHOLD LOGIN ---------- */
document.getElementById("authForm")?.addEventListener("submit", e => {
  e.preventDefault();

  fetch("/api/login/household", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: document.getElementById("number").value,
      password: document.getElementById("password").value
    })
  })
  .then(r => {
    if (!r.ok) throw 0;
    return r.json();
  })
  .then(() => goTo("/household"))
  .catch(() => alert("Invalid household login"));
});

/* ---------- COLLECTOR LOGIN ---------- */
document.getElementById("collectorAuthForm")?.addEventListener("submit", e => {
  e.preventDefault();

  fetch("/api/login/collector", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: document.getElementById("number").value,
      password: document.getElementById("password").value
    })
  })
  .then(r => {
    if (!r.ok) throw 0;
    return r.json();
  })
  .then(() => goTo("/collector"))
  .catch(() => alert("Invalid collector login"));
});

/* ---------- SIGNUP ---------- */
document.getElementById("signupForm")?.addEventListener("submit", e => {
  e.preventDefault();

  fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
      location: document.getElementById("location").value
    })
  })
  .then(r => {
    if (!r.ok) throw 0;
    return r.json();
  })
  .then(() => goTo("/household"))
  .catch(() => alert("Account already exists"));
});

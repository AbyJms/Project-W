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
const authForm = document.getElementById("authForm");

if (authForm) {
  authForm.addEventListener("submit", e => {
    e.preventDefault();

    const phone = document.getElementById("number");
    const password = document.getElementById("password");

    if (!phone || !password) {
      alert("Login form broken");
      return;
    }

    fetch("/api/login/household", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone.value,
        password: password.value
      })
    })
    .then(r => {
      if (!r.ok) throw 0;
      return r.json();
    })
    .then(() => goTo("/household"))
    .catch(() => alert("Invalid household login"));
  });
}

/* ---------- COLLECTOR LOGIN ---------- */
const collectorForm = document.getElementById("collectorAuthForm");

if (collectorForm) {
  collectorForm.addEventListener("submit", e => {
    e.preventDefault();

    const phone = document.getElementById("number");
    const password = document.getElementById("password");

    if (!phone || !password) {
      alert("Collector form broken");
      return;
    }

    fetch("/api/login/collector", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone.value,
        password: password.value
      })
    })
    .then(r => {
      if (!r.ok) throw 0;
      return r.json();
    })
    .then(() => goTo("/collector"))
    .catch(() => alert("Invalid collector login"));
  });
}

/* ---------- SIGNUP ---------- */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const location = document.getElementById("location");

    if (!name || !phone || !password || !location) {
      alert("Signup form broken");
      return;
    }

    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        phone: phone.value,
        password: password.value,
        location: location.value
      })
    })
    .then(r => {
      if (!r.ok) throw 0;
      return r.json();
    })
    .then(() => goTo("/household"))
    .catch(() => alert("Account already exists"));
  });
}

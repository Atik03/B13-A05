document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin123") {
    alert("Login Successful! Redirecting to Dashboard...");
  } else {
    alert("Invalid Username or Password. Please try again.");
  }
});

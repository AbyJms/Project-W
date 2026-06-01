import React from "react";
import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">
        <div className="login-card">
            <h1>Login</h1>
            <p>Email</p>
            <input
                type="email"
                placeholder="Enter your email"
            />

            <p>Password</p>
            <input
                type="password"
                placeholder="Enter your password"
            />
        </div>
    </div>
  );
}

export default Login;
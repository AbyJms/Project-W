import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const location = useLocation();
  const role = location.state?.role || "No role selected";
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        <p>Role: {role}</p>

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
        <button
          onClick={()=>
            navigate("/dashboard",{
              state: {role}
            })
          }
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
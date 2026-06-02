import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const location = useLocation();
  const role = location.state?.role || "Unknown";
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Project W</h1>
        <p>{role} Dashboard</p>
      </header>

      <main className="dashboard-content">
        <div className="card" onClick={() => navigate("/profile")}>
          <h2>Profile</h2>
        </div>

        <div className="card" onClick={() => navigate("/requests")}>
          <h2>Requests</h2>
        </div>

        <div className="card" onClick={() => navigate("/complaints")}>
          <h2>Complaints</h2>
        </div>

        <div className="card" onClick={() => navigate("/schedule")}>
          <h2>Schedule</h2>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
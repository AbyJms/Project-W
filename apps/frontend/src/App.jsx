import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoleSelect from "./pages/RoleSelect";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/role" element={<RoleSelect />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/complaints" element={<Complaints />} />
      <Route path="/schedule" element={<Schedule />} />
    </Routes>
  );
}

export default App;
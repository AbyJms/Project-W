import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RoleSelect() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      <h1>Select Your Role</h1>

      <button onClick={() => setSelectedRole("Household")}>
        Household
      </button>

      <button onClick={() => setSelectedRole("Collector")}>
        Collector
      </button>

      <p>Selected Role: {selectedRole}</p>

      <br /><br />

      <button
        disabled={!selectedRole}
        onClick={() =>
            navigate("/login", {
                state: { role: selectedRole },
            })
        }
      >
  Login
</button>

      <button disabled={!selectedRole}>
        Sign Up
      </button>
    </div>
  );
}

export default RoleSelect;
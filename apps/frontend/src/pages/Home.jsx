import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";


function Home(){
 return (
  <div className="home-container">
    <div className="home-card">
      <h1 className="home-title">Project W</h1>
      <p className="home-subtitle">
        Waste Management Platform
      </p>

      <Link to="/role">
        <button className="home-button">
          Get Started
        </button>
      </Link>
      
    </div>
  </div>
 );
}

export default Home;
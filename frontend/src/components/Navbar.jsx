import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
        
      <Link to="/">
        <div>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            width="50"
            height="50"
          />
        </div>
      </Link>
      <div className="navbar-links">
        <Link to="/create">
          <p style={{color: "rgb(4, 4, 4)"}}>Create a Repository</p>
        </Link>
        <Link to="/profile">
          <p style={{color: "rgb(4, 4, 4)"}}>Profile</p>
        </Link>
      </div>
    
    </div>
  );
};

export default Navbar;
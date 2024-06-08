import React from "react";
import { NavLink } from "react-router-dom";
import '../styles/Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar "style={{backgroundColor: 'black'}}>
      <div className="container" style={{backgroundColor: 'black'}}>
        <div className="navbar-brand">
        <img src="../N.png" alt="logo"></img>
        </div>
        <ul className="navbar-nav" style={{backgroundColor: 'black'}}>
          <li className="nav-item">
          
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" style={{backgroundColor: 'black'}} to="/Homepage">
              Page d'accueil
            </NavLink>
          </li>
          <li className="nav-item">
          
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

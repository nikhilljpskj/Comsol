import React from 'react';
import '../styles/NavbarLeft.css';
import { Link } from 'react-router-dom';

const NavbarLeft = () => {
  return (
    <div className="navbar-left">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/add-employee">Register Employee</Link></li>
        <li><Link to="/complaint-reg">Complaint Registration</Link></li>
        <li><Link to="/views-complaints">View Complaint</Link></li>
      </ul>
    </div>
  );
};

export default NavbarLeft;

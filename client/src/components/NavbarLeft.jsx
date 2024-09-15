import {React, useState, useEffect} from 'react';
import '../styles/NavbarLeft.css';
import { Link } from 'react-router-dom';

const NavbarLeft = () => {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user object from localStorage
    }
  }, []);

  function isAdmin(){
    return user.user_type === "Admin"? true : false 
  }
  function isManager(){
    return user.user_type === "Manager"? true : false 
  }
  function isStaff(){
    return user.user_type === "Staff"? true : false 
  }
  

  return (
    <div className="navbar-left">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
        {/* Conditional rendering for Register Employee link */}
        {(isAdmin() || isManager()) && (
          <li><Link to="/add-employee">Register Employee</Link></li>
        )}
        <li><Link to="/complaint-reg">Complaint Registration</Link></li>
        <li><Link to="/views-complaints">View Complaint</Link></li>
      </ul>
    </div>
  );
};

export default NavbarLeft;

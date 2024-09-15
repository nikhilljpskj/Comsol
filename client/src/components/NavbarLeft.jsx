import {React, useState, useEffect} from 'react';
import '../styles/NavbarLeft.css';
import { Link, useNavigate } from 'react-router-dom';

const NavbarLeft = () => {
  
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user object from localStorage
    }
    else{
      navigate('/login');
    }
  }, []);

  function isAdmin() {
    return user && user.user_type === "Admin";
  }

  function isManager() {
    return user && user.user_type === "Manager";
  }
  function isStaff() {
    return user && user.user_type === "Staff";
  }

  const viewComplaintsLink = isStaff ? '/views-complaints-staff' : '/views-complaints';
  

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
        <li><Link to={viewComplaintsLink}>View Complaint</Link></li>
      </ul>
    </div>
  );
};

export default NavbarLeft;

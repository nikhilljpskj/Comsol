import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';


function Profile() {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem('user')); // Retrieve user from local storage
      if (loggedInUser) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${loggedInUser.id}`);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setMessage('Failed to fetch user data.');
        }
      }
    };
    fetchUserData();
  }, []);
  

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/users/update-password`, {
        id: user.id,
        password
      });

      if (response.data.success) {
        setMessage('Password updated successfully.');
      } else {
        setMessage('Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password.');
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobile}</p>
        <p><strong>Office:</strong> {user.office}</p>
        <p><strong>Office Address:</strong> {user.office_address}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
      </div>

      <h3>Update Password</h3>
      <form onSubmit={handlePasswordUpdate}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;

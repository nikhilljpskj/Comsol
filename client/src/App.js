import {React, useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import AddEmployee from './components/AddEmployee';
import axios from 'axios';
import AppLayout from './components/AppLayout';
import AdminDashboard from './components/AdminDashboard'
import StaffDashboard from './components/StaffDashboard'
import StatsPage from './components/StatsPage';
import {LoginPage} from './components/LoginPage'
import ComplaintStatus from './components/ComplaintStatus'

import './App.css';
import ComplaintRegistration from './components/ComplaintRegistration';
import ViewComplaints from './components/ViewComplaints';
import Profile from './components/Profile';
import ViewComplaintsStaff from './components/ViewComplaintsStaff';

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/users/current-user', { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
        console.log("Successfully fetched data");
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
      setLoading(false); // Set loading to false if user is in local storage
    } else {
      fetchCurrentUser();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator or spinner
  }

  // If no user is logged in, redirect to login page
  if (!user) {
    return (
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/customer/complaint-registration"
              element={<ComplaintRegistration />}
            />
            <Route
              path="/customer/complaint-status/:id"
              element={<ComplaintStatus id={id} />}
            />
          </Routes>
        </AppLayout>
      </Router>
    );
  }


  return (
    <Router>
      <div className="App">
        <div className="main-container">
          <AppLayout>
            <Routes>
              <Route path="/" element={user.user_type === 'Admin' ? <AdminDashboard /> : <StaffDashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/dashboard" element={user.user_type === 'Admin' ? <AdminDashboard /> : <StaffDashboard />} />
              <Route
                path="/customer/complaint-registration"
                element={<ComplaintRegistration />}
              />
              <Route path="/views-complaints" element={<ViewComplaints />} />
              <Route path="/reports" element={<StatsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/views-complaints-staff" element={<ViewComplaintsStaff />} />
              <Route path="/customer/complaint-status/:id" element={<ComplaintStatus id={id}/>} />
            </Routes>
          </AppLayout>
        </div>
      </div>
    </Router>
  );
}

export default App;

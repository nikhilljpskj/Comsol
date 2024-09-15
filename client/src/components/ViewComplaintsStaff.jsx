import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ViewComplaintsStaff.css'; // Add your CSS file for styling

function ViewComplaintsStaff() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [additionalComment, setAdditionalComment] = useState('');
  const [staffLocation, setStaffLocation] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch the complaints assigned to the logged-in staff
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser && loggedInUser.id) {
          const response = await axios.get(`http://localhost:5000/api/viewcomplaintsstaff/${loggedInUser.id}`);
          setComplaints(response.data);
        } else {
          setError('User is not logged in.');
        }
      } catch (error) {
        setError('Failed to fetch complaints.');
      }
    };
    fetchComplaints();
  }, []);

  // Convert status value to human-readable format
  const getStatusLabel = (status) => {
    switch (status) {
      case '1':
        return 'Open';
      case '2':
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

  // Handle the view button click to open popup and pre-fill input fields
  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setDiagnosis(complaint.diagnosis || ''); // Pre-fill Diagnosis if available
    setAdditionalComment(complaint.additional_comments || ''); // Pre-fill Additional Comment if available
    setStaffLocation(complaint.staff_location || ''); // Pre-fill Staff Location if available
    setShowPopup(true);
  };

  // Fetch the current location of the staff
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStaffLocation(`https://www.google.com/maps/place/${latitude},${longitude}/`);
        },
        (error) => {
          setError('Failed to fetch location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Handle updating the complaint with diagnosis, additional comments, and location
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/viewcomplaintsstaff/update/${selectedComplaint.id}`, {
        diagnosis,
        additionalComment,
        staffLocation
      });
      if (response.data.success) {
        setSuccessMessage('Complaint updated successfully.');
        setShowPopup(false); // Close popup on success
      }
    } catch (error) {
      setError('Failed to update complaint.');
    }
  };

  return (
    <div>
      <h2>Assigned Complaints</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Customer Name</th>
            <th>Complaint</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.customer_name}</td>
              <td>{complaint.complaint}</td>
              <td>{getStatusLabel(complaint.status)}</td> {/* Display status label */}
              <td>
                <button onClick={() => handleView(complaint)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Complaint Details</h3>
            <p><strong>Name:</strong> {selectedComplaint.customer_name}</p>
            <p><strong>Mobile:</strong> {selectedComplaint.mobile_number}</p>
            <p><strong>Complaint:</strong> {selectedComplaint.complaint}</p>

            <div>
              <label>Diagnosis:</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>

            <div>
              <label>Additional Comment:</label>
              <input
                type="text"
                value={additionalComment}
                onChange={(e) => setAdditionalComment(e.target.value)}
              />
            </div>

            <div>
              <label>Staff Location:</label>
              <input type="text" value={staffLocation} readOnly />
              <button onClick={fetchLocation}>Fetch Location</button>
            </div>

            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewComplaintsStaff;

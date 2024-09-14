import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViewComplaints.css';

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // Complaint to show in popup
  const [assignedEmployee, setAssignedEmployee] = useState(''); // Selected employee
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Control popup visibility

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/complaints');
        setComplaints(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch complaints.');
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/staff');
        setEmployees(response.data);
      } catch (error) {
        setError('Failed to fetch employees.');
      }
    };

    fetchComplaints();
    fetchEmployees();
  }, []);

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setAssignedEmployee(complaint.staff_assigned || ''); // Set the assigned employee
    setIsPopupOpen(true); // Open popup
  };

  const handleAssignEmployee = async () => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${selectedComplaint.id}/assign`, {
        staff_assigned: assignedEmployee,
      });

      // Refresh complaints after successful assignment
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === selectedComplaint.id
            ? { ...complaint, staff_assigned: assignedEmployee }
            : complaint
        )
      );
      setIsPopupOpen(false); // Close the popup after assignment
    } catch (error) {
      setError('Failed to assign employee.');
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="view-complaints">
      <h2>Complaints</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Mobile Number</th>
            <th>WhatsApp Number</th>
            <th>Complaint</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.customer_name}</td>
              <td>{complaint.customer_email}</td>
              <td>{complaint.mobile_number}</td>
              <td>{complaint.whatsapp_number}</td>
              <td>{complaint.complaint}</td>
              <td>
                <a href={complaint.location} target="_blank" rel="noopener noreferrer">
                  View Location
                </a>
              </td>
              <td>
                <button onClick={() => handleViewComplaint(complaint)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && selectedComplaint && (
        <div className="popup">
          <div className="popup-content">
            <h3>Complaint Details</h3>
            <p><strong>Customer Name:</strong> {selectedComplaint.customer_name}</p>
            <p><strong>Complaint:</strong> {selectedComplaint.complaint}</p>
            <p><strong>Location:</strong> {selectedComplaint.location}</p>

            <label>Assign Employee:</label>
            {selectedComplaint.staff_assigned ? (
              <p>
                Assigned to:{' '}
                {employees.find((emp) => emp.id === selectedComplaint.staff_assigned)?.first_name}{' '}
                {employees.find((emp) => emp.id === selectedComplaint.staff_assigned)?.last_name}
              </p>
            ) : (
              <p>No employee assigned yet</p>
            )}

            <select
              value={assignedEmployee}
              onChange={(e) => setAssignedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>

            <div className="popup-actions">
              <button onClick={handleAssignEmployee}>Assign</button>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewComplaints;

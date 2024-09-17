import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ComplaintStatus.css'; // Create CSS to style this page
import ComplaintTimeline from './ComplaintTimeline'

function ComplaintStatus() {
  const { id } = useParams(); // Get complaint ID from URL params
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch complaint data
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/complaints/${id}`);
        setComplaint(response.data);
      } catch (error) {
        setError('Failed to fetch complaint details.');
        console.error(error);
      }
    };

    fetchComplaint();
  }, [id]);

  // Function to display the status in a user-friendly way
  const renderStatus = (status) => {
    switch (status) {
      case 0:
        return <span className="status unassigned">Unassigned</span>;
      case 1:
        return <span className="status assigned">Assigned</span>;
      case 2:
        return <span className="status completed">Completed & Archived</span>;
      default:
        return <span className="status unknown">Unknown</span>;
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!complaint) {
    return <div className="loading-message">Loading complaint details...</div>;
  }

  return (
    <>
    <div className="complaint-status-container">
      <h2>Complaint Status</h2>
      <div className="complaint-details">
        <p><strong>Customer Name:</strong> {complaint.customer_name}</p>
        <p><strong>Complaint ID:</strong> {complaint.id}</p>
        <p><strong>Complaint Description:</strong> {complaint.complaint_description}</p>
        <p><strong>Assigned Staff:</strong> {complaint.staff_assigned || 'Not Assigned'}</p>
        <p><strong>Status:</strong> {renderStatus(complaint.status)}</p>
      </div>
    </div>
    <ComplaintTimeline/>
    </>

  );
}

export default ComplaintStatus;

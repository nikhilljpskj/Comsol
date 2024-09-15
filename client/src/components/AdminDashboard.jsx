import {React, useState} from 'react';
import { Card, CardContent, Typography, Grid, LinearProgress, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Select, MenuItem, FormControl, IconButton } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
// import NavbarTop from '../components/NavbarTop';
import ConfirmationModal from '../components/ConfirmationModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ViewComplaints from './ViewComplaints';

import '../styles/Dashboard.css'; // Keep this if you have other custom styles

const AdminDashboard = () => {

  const [selectedItems, setSelectedItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentComplaintId, setCurrentComplaintId] = useState(null);


  const dummyData = {
    activeComplaints: 15,
    staffCount: 12,
    pendingComplaints: 7,
    maxComplaints: 100, // Define a maximum complaint threshold for the progress bar

  };

  const calculateProgress = (value, max) => (value / max) * 100;


  return (
    <>
      {/* <NavbarTop /> */}
      <div className="dashboard-container">
        <Grid container spacing={3}>
          {/* Active Complaints Card */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card" elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ReportProblemIcon color="error" fontSize="large" />
                  <Typography variant="h5" component="div" sx={{ ml: 1 }}>
                    Active Complaints
                  </Typography>
                </Box>
                <Typography variant="h2" color="primary">
                  {dummyData.activeComplaints}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(
                      dummyData.activeComplaints,
                      dummyData.maxComplaints
                    )}
                    color="error"
                  />
                  <Typography variant="caption" color="textSecondary">
                    Complaints Progress
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Complaints Card */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card" elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PendingActionsIcon color="warning" fontSize="large" />
                  <Typography variant="h5" component="div" sx={{ ml: 1 }}>
                    Pending Assignment
                  </Typography>
                </Box>
                <Typography variant="h2" color="primary">
                  {dummyData.pendingComplaints}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {/* Compare pending complaints to active complaints */}
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(
                      dummyData.pendingComplaints,
                      dummyData.activeComplaints
                    )}
                    color="warning"
                  />
                  <Typography variant="caption" color="textSecondary">
                    Pending Complaints Progress
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Number of Staff Card */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card" elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PeopleIcon color="primary" fontSize="large" />
                  <Typography variant="h5" component="div" sx={{ ml: 1 }}>
                    Number of Staff
                  </Typography>
                </Box>
                <Typography variant="h2" color="primary">
                  {dummyData.staffCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Active Complaints Table */}
        <Box sx={{ mt: 4 }}>
        <ViewComplaints/>
        </Box>
      </div>
    </>
  );
};

export default AdminDashboard;

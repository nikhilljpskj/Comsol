import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { Typography, Box } from '@mui/material';
import { CheckCircleOutline, PersonAdd, PhoneCallback, Build } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './ComplaintTimeline.css'; // Create custom CSS

// Timeline step data
const timelineSteps = [
  {
    label: 'Complaint Registered',
    icon: <CheckCircleOutline fontSize="large" />,
    description: 'Your complaint has been successfully registered with us.',
  },
  {
    label: 'Assigned to a Professional',
    icon: <PersonAdd fontSize="large" />,
    description: 'We have assigned your complaint to one of our professionals.',
  },
  {
    label: 'Professional Contacts You',
    icon: <PhoneCallback fontSize="large" />,
    description: 'The assigned professional will contact you to schedule a visit.',
  },
  {
    label: 'Repair Visit Scheduled',
    icon: <Build fontSize="large" />,
    description: 'The professional will visit your location to carry out the repair.',
  },
];

const ComplaintTimeline = () => {
  return (
    <Box className="timeline-container">
      <Typography variant="h4" align="center" gutterBottom>
        Complaint Progress Timeline
      </Typography>
      <Timeline position="alternate">
        {timelineSteps.map((step, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent>
              <Typography variant="body1">{step.description}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" className="timeline-dot">
                {step.icon}
              </TimelineDot>
              {index < timelineSteps.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Typography variant="h6" className="timeline-label">
                  {step.label}
                </Typography>
              </motion.div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default ComplaintTimeline;

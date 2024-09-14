const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

// Define the route for complaints
router.post('/', complaintsController.registerComplaint);

router.get('/', complaintsController.getAllComplaints);

router.put('/:id/assign', complaintsController.assignStaffToComplaint);

module.exports = router;

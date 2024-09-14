const db = require('../db/db');
const twilio = require('twilio');
require('dotenv').config()

// Twilio configuration
const accountSid = process.env.ACCOUNT_SID; // Your Account SID
const authToken = process.env.AUTH_TOKEN; // Your Auth Token
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Your Twilio WhatsApp number

const client = twilio(accountSid, authToken);

// Register a new complaint
exports.registerComplaint = (req, res) => {
  const { customerName, customerEmail, mobileNumber, whatsappNumber, complaint, location } = req.body;

  // Ensure the whatsappNumber is in E.164 format with '+' sign
  const formattedWhatsappNumber = whatsappNumber.startsWith('+') ? whatsappNumber : `+91${whatsappNumber}`;

  const sql = 'INSERT INTO complaints (customer_name, customer_email, mobile_number, whatsapp_number, complaint, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [customerName, customerEmail, mobileNumber, formattedWhatsappNumber, complaint, location, 0], (err, result) => {
    if (err) {
      console.error('Error inserting complaint:', err);
      return res.status(500).send({ message: 'Failed to register complaint.' });
    }

    // Send WhatsApp message
    client.messages
      .create({
        body: `Your complaint has been registered successfully. Complaint details: \nCustomer Name: ${customerName}\nComplaint: ${complaint}`,
        from: `whatsapp:${twilioWhatsAppNumber}`,
        to: `whatsapp:${formattedWhatsappNumber}`
      })
      .then(message => {
        console.log('WhatsApp message sent:', message.sid);
        res.status(200).send({ message: 'Complaint registered successfully and WhatsApp message sent.' });
      })
      .catch(err => {
        console.error('Failed to send WhatsApp message:', err);
        res.status(500).send({ message: 'Complaint registered successfully, but failed to send WhatsApp message.' });
      });
  });
};


// Fetch all complaints
exports.getAllComplaints = (req, res) => {
  const sql = 'SELECT * FROM complaints ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Assign staff to complaint and send WhatsApp message
exports.assignStaffToComplaint = (req, res) => {
  const { id } = req.params; // Complaint ID
  const { staff_assigned } = req.body;

  // Fetch the complaint to get the WhatsApp number and customer name
  const getComplaintSql = 'SELECT whatsapp_number, customer_name FROM complaints WHERE id = ?';
  db.query(getComplaintSql, [id], (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to fetch complaint.' });

    const complaint = results[0];
    const whatsappNumber = complaint.whatsapp_number;
    const customerName = complaint.customer_name;

    // Ensure the WhatsApp number is in E.164 format
    const formattedWhatsAppNumber = whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber}`;

    // Update the complaint with the assigned staff and set status to 1 (assigned)
    const updateSql = 'UPDATE complaints SET staff_assigned = ?, status = 1 WHERE id = ?';
    db.query(updateSql, [staff_assigned, id], (err, result) => {
      if (err) return res.status(500).send({ message: 'Failed to assign employee.' });

      // Send WhatsApp message
      client.messages
        .create({
          body: `The complaint from ${customerName} has been assigned to staff member with ID: ${staff_assigned}.`,
          from: `whatsapp:${twilioWhatsAppNumber}`,
          to: `whatsapp:${formattedWhatsAppNumber}`
        })
        .then(message => {
          console.log('WhatsApp message sent:', message.sid);
          res.status(200).send({ message: 'Employee assigned successfully and WhatsApp message sent.' });
        })
        .catch(err => {
          console.error('Failed to send WhatsApp message:', err);
          res.status(500).send({ message: 'Employee assigned successfully, but failed to send WhatsApp message.' });
        });
    });
  });
};

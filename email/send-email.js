// send-email.js

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key here
const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY';
sgMail.setApiKey(SENDGRID_API_KEY);

// Function to read the email template file
function readEmailTemplate() {
  const templatePath = path.join(__dirname, 'email-template.html');
  return fs.readFileSync(templatePath, 'utf8');
}

router.post('/send-email', async (req, res) => {
  const { fullName, email } = req.body;

  // Validate that both fullName and email are provided in the request body
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required.' });
  }

  // Read the email template
  const emailTemplate = readEmailTemplate();

  // Replace the placeholder {{fullName}} in the template with the actual fullName
  const emailContent = emailTemplate.replace('{{fullName}}', fullName);

  // Send the email using SendGrid
  const msg = {
    to: email,
    from: 'your-email@example.com', // Set your verified sender email here
    subject: 'Thanks for signing up!',
    html: emailContent, // Use the modified email template content
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;

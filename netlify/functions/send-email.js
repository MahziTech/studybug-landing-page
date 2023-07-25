const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key here
const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { fullName, email } = JSON.parse(event.body);

  // Validate that both fullName and email are provided in the request body
  if (!fullName || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Full name and email are required.' }),
    };
  }

  // Send the email using SendGrid
  const msg = {
    to: email,
    from: 'your-email@example.com', // Set your verified sender email here
    subject: 'Thanks for signing up!',
    html: `<p>Hello ${fullName},</p><p>Thank you for signing up!</p>`,
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};

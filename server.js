const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));  // Assuming CSS is inside the 'public' folder


// Home route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission and send email
app.post('/submit-appointment', (req, res) => {
    const { name, email, appointmentDate, details } = req.body;

    // Generate email content
    const subject = 'New Appointment Booking';
    const body = `
    A new appointment has been booked with the following details:
    - Name: ${name}
    - Email: ${email}
    - Appointment Date: ${appointmentDate}
    - Details: ${details}
    `;

    // Send the email (update the transporter with your actual credentials)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ferchodlt1971@hotmail.com',  // Your email address
            pass: 'vnbnwqnirqrllcdn',  // Your app password  
        },
    });

    const mailOptions = {
        from: 'ferchodlt1971@hotmail.com',
        to: 'ferchodlt1971@hotmail.com', // Admin's email
        subject: subject,
        text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
            res.status(500).send('Error sending email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Appointment submitted successfully!');
        }
    });
});

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
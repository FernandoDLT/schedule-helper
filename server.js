const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path'); // Required to handle file paths

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Serve the home page (default page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/book', (req, res) => {
    const { name, service, date, time, phone, email } = req.body;

    // Redirect to home page after booking
    res.redirect('/');
    // Respond to the client immediately
    res.status(200).send('Appointment booked successfully!');

    const adminEmail = 'ferchodlt1971@gmail.com'; // Replace with your admin email
    const subject = 'New Appointment Booking';
    const body = `
        A new appointment has been booked:
        Name: ${name}
        Service: ${service}
        Date: ${date}
        Time: ${time}
        Phone: ${phone}
        Email: ${email}
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ferchodlt1971@gmail.com',
            pass: 'vnbnwqnirqrllcdn',
        },
    });

    const mailOptions = {
        from: 'ferchodlt1971@gmail.com',
        to: adminEmail,
        subject: subject,
        text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Handle form submission
app.post('/book', (req, res) => {
    const { name, service, date, time, phone, email } = req.body;

    // Respond to the client immediately
    res.send('Appointment booked successfully!');

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
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Appointment booked successfully');
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

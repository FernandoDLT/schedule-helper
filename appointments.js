// Calls this function on page load in appointments.index.html
document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = $('#calendar');

    if (calendarElement.length) {
        calendarElement.fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay' // Include the view buttons
            },
            defaultView: 'month', // Sets the default view to month
            editable: true, // Allows dragging and resizing of events
            eventLimit: true, // Adds "more" link when too many events exist for a day
            events: loadAppointments(), // Dynamically loads appointments from localStorage

            // Handles event click to load details into the form for modification
            eventClick: function (event) {
                const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

                // Populate the form with the selected event's details
                const selectedAppointment = appointments[event.id];
                document.getElementById('name').value = selectedAppointment.name;
                document.getElementById('service').value = selectedAppointment.service;
                document.getElementById('date').value = selectedAppointment.date;
                document.getElementById('time').value = selectedAppointment.time;
                document.getElementById('phone').value = selectedAppointment.phone;

                // Stores the event ID for later use (for modification and deletion)
                window.currentEventId = event.id;

                // Shows modify and delete buttons
                document.getElementById('modify-button').style.display = 'inline';
                document.getElementById('delete-button').style.display = 'inline';
            }
        });
    }
});

// Function to load appointments from localStorage
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Map appointments to the format required by fullCalendar
    return appointments.map((appointment, index) => {
        const startDateTime = `${appointment.date}T${appointment.time}`;
        return {
            id: index, // Use the array index as the event ID
            title: `${appointment.name} - ${appointment.service}`,
            start: startDateTime,
            allDay: false
        };
    });
}

// Adds new appointment functionality
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents form from reloading the page on submission

    // Captures form values
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const phone = document.getElementById('phone').value;

    // Ensures all form fields are filled
    if (!name || !service || !date || !time || !phone) {
        alert('Please fill in all fields, including phone number.');
        return;
    }

    // Creates an appointment object with date as a full datetime string
    const appointment = {
        name,
        service,
        date,
        time,
        phone
    };

    // Checks if we are adding a new appointment
    addNewAppointment(appointment);

    // Clears the form fields after submission
    clearForm();
});

function formatTimeTo24Hour(time) {
    const [timePart, modifier] = time.trim().split(' '); // Split time and AM/PM
    let [hours, minutes] = timePart.split(':'); // Split into hours and minutes

    hours = parseInt(hours, 10); // Convert hours to an integer

    if (modifier === 'PM' && hours < 12) {
        hours += 12; // Add 12 to PM times except for 12 PM
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0; // Convert 12 AM to 00
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`; // Return in HH:mm format
}

function isValidTime(time) {
    const [hours, minutes] = time.split(':').map(Number); // Split time into hours and minutes
    return hours >= 10 && hours <= 17; // Allow only times from 08:00 to 17:00
}

// Add new appointment
function addNewAppointment(appointment) {
    // Convert time to 24-hour format if necessary
    const formattedTime = formatTimeTo24Hour(appointment.time); // Convert to 24-hour format
    appointment.time = formattedTime;

    // Retrieve appointments from localStorage
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Add new appointment to localStorage
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Add the new event to the calendar
    $('#calendar').fullCalendar('renderEvent', {
        id: appointments.length - 1, // Assign the ID based on the new length
        title: `${appointment.name} - ${appointment.service}`,
        start: new Date(`${appointment.date}T${formattedTime}`),
        allDay: false
    }, true);

    alert('Appointment successfully booked!');
}

// Modifies existing appointment when Modify button is clicked
document.getElementById('modify-button').addEventListener('click', function() {
    // Check if there is an event to modify
    if (window.currentEventId !== undefined) {
        // Captures updated form values
        const name = document.getElementById('name').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const phone = document.getElementById('phone').value;

        // Ensures all form fields are filled
        if (!name || !service || !date || !time || !phone) {
            alert('Please fill in all fields.');
            return;
        }

        // Creates the updated appointment object
        const updatedAppointment = {
            name,
            service,
            date,
            time,
            phone
        };

        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

        // Updates the selected appointment in localStorage
        appointments[window.currentEventId] = updatedAppointment;
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Gets the existing event in the calendar
        const event = $('#calendar').fullCalendar('clientEvents', window.currentEventId)[0];

        // Updates event properties in the calendar
        event.title = `${updatedAppointment.name} - ${updatedAppointment.service}`;
        event.start = new Date(`${updatedAppointment.date}T${updatedAppointment.time}`);

        // Updates the event in the calendar in real-time
        $('#calendar').fullCalendar('updateEvent', event);

        alert('Appointment modified successfully!');

        // Clears the form after modification
        clearForm();
    } else {
        alert('No event selected to modify.');
    }
});

// Clear the form fields
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('service').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('phone').value = '';

    // Hide modify and delete buttons
    document.getElementById('modify-button').style.display = 'none';
    document.getElementById('delete-button').style.display = 'none';

    // Clear the stored event ID
    window.currentEventId = undefined;
}

// Delete button functionality
document.getElementById('delete-button').addEventListener('click', function() {
    if (window.currentEventId !== undefined) {
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

        // Remove the selected appointment from the array
        appointments.splice(window.currentEventId, 1);

        // Store the updated appointments in localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Remove the event from the calendar
        $('#calendar').fullCalendar('removeEvents', window.currentEventId);

        alert('Appointment deleted successfully!');

        // Clear the form fields
        clearForm();
    } else {
        alert('No appointment selected for deletion.');
    }
});
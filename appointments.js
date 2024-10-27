// Load appointments from localStorage and display them on the appointment tracker page
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    const events = appointments.map((appointment, index) => {
        return {
            id: index, // Use index as an ID to track the specific event
            title: `${appointment.name} - ${appointment.service}`,
            start: new Date(`${appointment.date}T${appointment.time}`), // Combine date and time
            allDay: false // Set to false for specific time slots
        };
    });

    // Initialize the calendar with these events
    $('#calendar').fullCalendar('renderEvents', events, true); // Render events dynamically
}

// Call this function on page load in appointments.index.html
document.addEventListener('DOMContentLoaded', function() {
    const calendarElement = $('#calendar');
    
    if (calendarElement.length) {
        calendarElement.fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay' // Include the view buttons
            },
            defaultView: 'month', // Set the default view to month
            events: [], // Initialize with an empty array
            editable: true, // Optional: allows dragging and resizing of events
            eventLimit: true, // Allow "more" link when too many events

            // Handle event click to load details into the form for modification
            eventClick: function(event) {
                const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
                
                // Populate the form with the selected event's details
                const selectedAppointment = appointments[event.id];
                document.getElementById('name').value = selectedAppointment.name;
                document.getElementById('service').value = selectedAppointment.service;
                document.getElementById('date').value = selectedAppointment.date;
                document.getElementById('time').value = selectedAppointment.time;
                document.getElementById('phone').value = selectedAppointment.phone;

                // Store the event ID for later use (for modification and deletion)
                window.currentEventId = event.id;

                // Show modify and delete buttons
                document.getElementById('modify-button').style.display = 'inline';
                document.getElementById('delete-button').style.display = 'inline';
            }
        });

        loadAppointments(); // Load all appointments into the calendar after initialization
    }
});

// Add new appointment functionality
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents form from reloading the page on submission

    // Capture form values
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const phone = document.getElementById('phone').value;

    // Ensure all form fields are filled
    if (!name || !service || !date || !time || !phone) {
        alert('Please fill in all fields, including phone number.');
        return;
    }

    // Create an appointment object with date as a full datetime string
    const appointment = {
        name,
        service,
        date,
        time,
        phone
    };

    // Check if we are adding a new appointment
    addNewAppointment(appointment);

    // Clear the form fields after submission
    clearForm();
});

// Add new appointment
function addNewAppointment(appointment) {
    // Retrieve appointments from localStorage
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Add new appointment to localStorage
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Add the new event to the calendar
    $('#calendar').fullCalendar('renderEvent', {
        id: appointments.length - 1, // Assign the ID based on the new length
        title: `${appointment.name} - ${appointment.service}`,
        start: new Date(`${appointment.date}T${appointment.time}`),
        allDay: false
    }, true);

    alert('Appointment successfully booked!');
}

// Modify existing appointment when Modify button is clicked
document.getElementById('modify-button').addEventListener('click', function() {
    // Check if there is an event to modify
    if (window.currentEventId !== undefined) {
        // Capture updated form values
        const name = document.getElementById('name').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const phone = document.getElementById('phone').value;

        // Ensure all form fields are filled
        if (!name || !service || !date || !time || !phone) {
            alert('Please fill in all fields.');
            return;
        }

        // Create the updated appointment object
        const updatedAppointment = {
            name,
            service,
            date,
            time,
            phone
        };

        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

        // Update the selected appointment in localStorage
        appointments[window.currentEventId] = updatedAppointment;
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Get the existing event in the calendar
        const event = $('#calendar').fullCalendar('clientEvents', window.currentEventId)[0];

        // Update event properties in the calendar
        event.title = `${updatedAppointment.name} - ${updatedAppointment.service}`;
        event.start = new Date(`${updatedAppointment.date}T${updatedAppointment.time}`);

        // Update the event in the calendar in real-time
        $('#calendar').fullCalendar('updateEvent', event);

        alert('Appointment modified successfully!');

        // Clear the form after modification
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
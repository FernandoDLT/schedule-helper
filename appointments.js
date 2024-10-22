// Load appointments from localStorage and display them on the appointment tracker page
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    const events = appointments.map(appointment => {
        return {
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
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay' // Include the view buttons
        },
        defaultView: 'month', // Set the default view to month
        events: [], // Initialize with an empty array
        editable: true, // Optional: allows dragging and resizing of events
        eventLimit: true, // Allow "more" link when too many events
    });

    loadAppointments(); // Load all appointments into the calendar after initialization
});

// Booking form submission event
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents form from reloading the page on submission

    // Capture form values
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Ensure all form fields are filled
    if (!name || !service || !date || !time) {
        alert('Please fill in all fields.');
        return;
    }

    // Create an appointment object with date as a full datetime string
    const appointment = {
        name,
        service,
        date: new Date(`${date}T${time}`), // Combine date and time into a Date object
        time
    };

    // Store appointment in localStorage
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Clear the form fields
    document.getElementById('name').value = '';
    document.getElementById('service').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';

    // Display a success message
    alert('Appointment successfully booked!');

    // Add the new event to the calendar
    $('#calendar').fullCalendar('renderEvent', {
        title: `${name} - ${service}`,
        start: appointment.date,
        allDay: false
    }, true);
});

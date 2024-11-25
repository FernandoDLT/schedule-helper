// DO NOT TOUCH THIS CODE!!!!!!!!!
// Has an effect on page-load
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#carousel");
  const carouselItems = document.querySelectorAll("#carousel li"); // li wraps the img
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  let currentIndex = 0;
  let isTransitioning = false;
  const totalItems = carouselItems.length;

  // Clones the first and last images to create a seamless transition
  const firstClone = carouselItems[0].cloneNode(true);
  const lastClone = carouselItems[totalItems - 1].cloneNode(true);

  // Appends and prepends the clones
  carousel.appendChild(firstClone);
  carousel.insertBefore(lastClone, carouselItems[0]);

  const updatedTotalItems = totalItems + 2; // Account for the clones

  // Function to update the carousel
  function updateCarousel() {
    if (isTransitioning) return; // Prevent multiple transitions at once

    isTransitioning = true;
    const offset = -currentIndex * 100; // Move the carousel based on index
    carousel.style.transition = "transform 0.5s ease";
    carousel.style.transform = `translateX(${offset}%)`;
  }

  // Handles the transition end only once
  carousel.addEventListener("transitionend", () => {
    isTransitioning = false;

    if (currentIndex === 0) {
      // If we're at the fake first slide, jump to the real last slide
      carousel.style.transition = "none";
      currentIndex = totalItems;
      const offset = -currentIndex * 100;
      carousel.style.transform = `translateX(${offset}%)`;
    } else if (currentIndex === updatedTotalItems - 1) {
      // If we're at the fake last slide, jump to the real first slide
      carousel.style.transition = "none";
      currentIndex = 1;
      const offset = -currentIndex * 100;
      carousel.style.transform = `translateX(${offset}%)`;
    }
  });

  // Next button click
  nextButton.addEventListener("click", () => {
    if (!isTransitioning) {
      currentIndex = (currentIndex + 1) % updatedTotalItems;
      updateCarousel();
    }
  });

  // Previous button click
  prevButton.addEventListener("click", () => {
    if (!isTransitioning) {
      currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
      updateCarousel();
    }
  });

  // Touch event handling for mobile
  let startX = 0;
  let endX = 0;

  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    endX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    const threshold = 50; // Minimum swipe distance in pixels to trigger a change
    if (startX - endX > threshold) {
      // Swiped left, go to the next item
      currentIndex = (currentIndex + 1) % updatedTotalItems;
      updateCarousel();
    } else if (endX - startX > threshold) {
      // Swiped right, go to the previous item
      currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
      updateCarousel();
    }
  }

  // Applies touch events only on small screens
  if (window.innerWidth <= 770) {
    // Keep the event on li, which wraps the image
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
  }

  // Initializs with the first image displayed (which is the real second image due to clones)
  currentIndex = 1;
  carousel.style.transform = `translateX(-100%)`; // Show the real first image
});

const burgerMenu = document.querySelector('.burger-menu');
const navContainer = document.querySelector('.nav-container');
const servicesSection = document.querySelector('#services-carousel');

burgerMenu.addEventListener('click', function() {
  navContainer.classList.toggle('nav-open');

  if (navContainer.classList.contains('nav-open')) {
    servicesSection.style.marginTop = '260px'
  } else {
    servicesSection.style.marginTop ='0'
  }
});
// DO NOT TOUCH THIS CODE!!!!!!!!!



document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const appointmentsList = document.getElementById('appointments-list'); // For displaying appointments

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevents default form submission

            // Captures form values
            const nameField = document.getElementById('name');
            const name = nameField.value;
            const service = document.getElementById('service').value;
            const dateInput = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const phone = document.getElementById('phone').value;

            // Clears previous error messages
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach((error) => (error.textContent = ''));

            // Validates form fields
            let hasError = false;

            if (!name) {
                hasError = true;
                nameField.classList.add('error');
                const error = nameField.nextElementSibling || document.createElement('span');
                error.className = 'error-message';
                error.textContent = 'Name is required.';
                nameField.after(error);
            }

            if (!service || !dateInput || !time || !phone) {
                alert('Please fill in all fields, including the phone number.');
                return; // Stops further execution if any field is empty
            }

            // Validates date and time
            const selectedDateTime = new Date(`${dateInput}T${time}`);
            if (selectedDateTime <= new Date()) {
                alert('Please select a future date and time.');
                return;
            }

            // Normalizes the date to YYYY-MM-DD format
            const date = new Date(dateInput).toISOString().split('T')[0];

            // Creates an appointment object
            const appointment = { name, service, date, time, phone };

            // Error handling for localStorage access
            try {
                // Retrieve existing appointments or initialize as an empty array
                let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

                // Check for conflicts
                const isConflict = appointments.some(
                    (appt) => appt.date === date && appt.time === time
                );
                
                if (isConflict) {
                    alert('The selected time slot is already booked. Please choose another.');
                    return;
                }

                // Add new appointment and save
                appointments.push(appointment);
                localStorage.setItem('appointments', JSON.stringify(appointments));

                // Optional: Display a success message
                alert('Appointment successfully booked!');

                // Clear the form fields
                form.reset(); // Clears all form fields
                document.getElementById('time').selectedIndex = 0; // Resets time dropdown to the default option

                // Display updated appointments
                displayAppointments(appointmentsList, appointments);

            } catch (error) {
                console.error('Error accessing localStorage:', error);
                alert('An error occurred while saving the appointment. Please try again.');
            }
        });
    }

    // Display existing appointments on page load
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    displayAppointments(appointmentsList, appointments);
});

// Function to display appointments
function displayAppointments(appointmentsList, appointments) {
    if (appointmentsList) {
        appointmentsList.innerHTML = ''; // Clear existing appointments
        appointments.forEach((appointment) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${appointment.date} ${appointment.time} - ${appointment.name} (${appointment.service}, ${appointment.phone})`;
            appointmentsList.appendChild(listItem);
        });
    }
}
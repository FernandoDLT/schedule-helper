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
    carousel.style.transition = "transform 0.9s ease";
    carousel.style.transform = `translateX(${offset}%)`;
  }

  // Handles the transition end only once
  carousel.addEventListener("transitionend", () => {
    isTransitioning = false;

    if (currentIndex === 0 || currentIndex === updatedTotalItems - 1) {
      // Reset position for seamless looping at boundaries
      carousel.style.transition = "none";
      currentIndex = (currentIndex === 0) ? totalItems : 1;
      const offset = -currentIndex * 100;
      carousel.style.transform = `translateX(${offset}%)`;
    }
  });

  // Button event listeners (next and previous)
  function handleButtonClick(direction) {
    if (!isTransitioning) {
      currentIndex = (currentIndex + direction + updatedTotalItems) % updatedTotalItems;
      updateCarousel();
    }
  }

  nextButton.addEventListener("click", () => handleButtonClick(1));
  prevButton.addEventListener("click", () => handleButtonClick(-1));

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
    if (Math.abs(startX - endX) > threshold) {
      handleButtonClick(startX - endX > 0 ? 1 : -1); // Determine swipe direction
    }
  }

  if (window.innerWidth <= 770) {
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
  }

  // Initial setup with the first image displayed
  currentIndex = 1;
  carousel.style.transform = `translateX(-100%)`; // Show the real first image

  // Autoplay: Automatically move to the next slide every 3 seconds
  const autoplayInterval = setInterval(() => {
    if (!isTransitioning) {
      currentIndex = (currentIndex + 1) % updatedTotalItems;
      updateCarousel();
    }
  }, 5000); // Change the slide every 3 seconds

  // Stop autoplay on user interaction
  nextButton.addEventListener("click", () => clearInterval(autoplayInterval));
  prevButton.addEventListener("click", () => clearInterval(autoplayInterval));
});


// Function to convert 12-hour format to 24-hour format
function convertTo24HourFormat(time12hr) {
    const [time, period] = time12hr.split(" ");
    let [hours, minutes] = time.split(":").map(num => parseInt(num));

    if (period === "PM" && hours !== 12) {
        hours += 12; // Convert PM times to 24-hour format, except for 12 PM
    }
    if (period === "AM" && hours === 12) {
        hours = 0; // Convert 12 AM to 00 hours
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Function to retrieve appointments from localStorage
function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments')) || [];
}

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

// Function to fetch and update the time slots for a specific date
// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.querySelector('form');
    
//     if (form) {
//         form.addEventListener('submit', async function (event) {
//             event.preventDefault(); // Prevent default navigation behavior

//             const formData = new FormData(form);
//             const appointment = {
//                 name: formData.get('name'),
//                 service: formData.get('service'),
//                 date: formData.get('date'),
//                 time: formData.get('time'),
//                 phone: formData.get('phone'),
//                 email: formData.get('email')
//             };

//             if (Object.values(appointment).some(value => !value.trim())) {
//                 alert('Please fill out all fields.');
//                 return;
//             }

//             try {
//                 const response = await fetch('/book', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(appointment)
//                 });

//                 if (response.ok) {
//                   // alert('Appointment booked successfully!');
//                   alert(`Appointment booked successfully!
//                   Name: ${appointment.name}
//                   Service: ${appointment.service}
//                   Date: ${appointment.date}
//                   Time: ${appointment.time}
//                   Phone: ${appointment.phone}
//                   Email: ${appointment.email}`);
                  
//                   // Explicitly redirect to the home page
//                   window.location.href = '/';
                  
//                 } else {
//                     alert('Error booking appointment. Please try again.');
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 alert('An error occurred. Please try again.');
//             }
//         });
//     }
// });


document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const confirmationCard = document.getElementById('confirmation-card');
    const submitButton = form.querySelector('button');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission (no page reload)

            const formData = new FormData(form);
            const appointment = {
                name: formData.get('name'),
                service: formData.get('service'),
                date: formData.get('date'),
                time: formData.get('time'),
                phone: formData.get('phone'),
                email: formData.get('email')
            };

            if (Object.values(appointment).some(value => !value.trim())) {
                alert('Please fill out all fields.');
                return;
            }

            try {
                const response = await fetch('/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointment)
                });

                if (response.ok) {
                    // Hide the form and show the success card
                    form.style.display = 'none';
                    confirmationCard.classList.remove('hide'); // Show success card

                } else {
                    alert('Error booking appointment. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});



function updateTimeSlots(dateInput) {
    // Get all appointments from localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Get the time slots dropdown
    const timeDropdown = document.getElementById('time');
    
    // Clear existing options in the dropdown
    timeDropdown.innerHTML = '';

    // Define available time slots (you can modify this to suit your needs)
    const availableTimes = [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
      '06:00 PM'
    ];

    // Normalize the selected date to match the format used in the appointments
    const selectedDate = dateInput.split('T')[0];  // e.g., "2024-12-06"

    // Loop through the available times and check if they are booked for the selected date
    availableTimes.forEach((time) => {
        // Check if the time is already booked on the selected date
        const isBooked = appointments.some(
            (appt) => appt.date === selectedDate && appt.time === convertTo24HourFormat(time)
        );

        // Create the option element for the dropdown
        const option = document.createElement('option');
        option.value = convertTo24HourFormat(time); // Store time in 24-hour format
        // option.textContent = time;
        option.textContent = isBooked ? `${time} - Unavailable` : `${time} - Available`;
        
        if (isBooked) {
          option.disabled = true;  // Disable the option if it's already booked
          option.style.color = 'gray';  // Optionally, gray out the text
        }
        else {
          option.disabled = false;
          option.style.color = 'green';
        }              

        // Append the option to the dropdown
        timeDropdown.appendChild(option);
    });
}

// Event listener for when the user selects a date
document.getElementById('date').addEventListener('change', function (event) {
    const selectedDate = event.target.value;
    updateTimeSlots(selectedDate);
});

// Convert 12-hour time to 24-hour time (helper function)
function convertTo24HourFormat(time12hr) {
    const [time, period] = time12hr.split(" ");
    let [hours, minutes] = time.split(":").map(num => parseInt(num));

    if (period === "PM" && hours !== 12) {
        hours += 12; // Convert PM times to 24-hour format, except for 12 PM
    }
    if (period === "AM" && hours === 12) {
        hours = 0; // Convert 12 AM to 00 hours
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

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
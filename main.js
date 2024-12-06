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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const appointmentsList = document.getElementById('appointments-list'); // For displaying appointments

    // Initialize appointments
    const appointments = getAppointments();
    displayAppointments(appointmentsList, appointments);

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevents default form submission

            // Captures form values
            const formElements = {
                name: document.getElementById('name').value.trim(),
                service: document.getElementById('service').value.trim(),
                date: document.getElementById('date').value.trim(),
                time: document.getElementById('time').value.trim(),
                phone: document.getElementById('phone').value.trim()
            };

            // Validates form fields
            if (Object.values(formElements).some(value => !value)) {
                alert('Please fill in all fields, including the phone number.');
                return;
            }

            // Convert 12-hour time to 24-hour time
            const adjustedTime = convertTo24HourFormat(formElements.time);

            console.log('Converted Time:', adjustedTime); // Log converted time to verify

            // Combine the date and adjusted time, then ensure consistent format
            const selectedDateTime = new Date(`${formElements.date}T${adjustedTime}:00`);

            // Validate if the selected time is in the future
            if (selectedDateTime <= new Date()) {
                alert('Please select a future date and time.');
                return;
            }

            // Normalize date and time for conflict checking (store time consistently)
            const normalizedDate = new Date(formElements.date).toISOString().split('T')[0]; // Date in YYYY-MM-DD format
            const normalizedTime = adjustedTime.padStart(5, '0'); // Ensure time format is HH:mm

            // Check for conflicts: Corrected comparison to check both date and time
            const isConflict = appointments.some(
                (appt) => appt.date === normalizedDate && appt.time === normalizedTime
            );

            if (isConflict) {
                alert('The selected time slot is already booked. Please choose another.');
                return;
            }

            // Create an appointment object
            const appointment = {
                name: formElements.name,
                service: formElements.service,
                date: normalizedDate,
                time: normalizedTime,
                phone: formElements.phone
            };

            try {
                // Add new appointment and save to localStorage
                appointments.push(appointment);
                localStorage.setItem('appointments', JSON.stringify(appointments));

                // Success message
                alert('Appointment successfully booked!');

                // Clear the form fields
                form.reset();

                // Update displayed appointments
                displayAppointments(appointmentsList, appointments);
            } catch (error) {
                console.error('Error accessing localStorage:', error);
                alert('An error occurred while saving the appointment. Please try again.');
            }
        });
    }
});


// Function to fetch and update the time slots for a specific date
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
// document.addEventListener("DOMContentLoaded", () => {
//   const carousel = document.querySelector("#carousel");
//   const carouselItems = document.querySelectorAll("#carousel li"); // li wraps the img
//   const prevButton = document.querySelector(".prev");
//   const nextButton = document.querySelector(".next");

//   let currentIndex = 0;
//   let isTransitioning = false;
//   const totalItems = carouselItems.length;

//   // Clones the first and last images to create a seamless transition
//   const firstClone = carouselItems[0].cloneNode(true);
//   const lastClone = carouselItems[totalItems - 1].cloneNode(true);

//   // Appends and prepends the clones
//   carousel.appendChild(firstClone);
//   carousel.insertBefore(lastClone, carouselItems[0]);

//   const updatedTotalItems = totalItems + 2; // Account for the clones

//   // Function to update the carousel
//   function updateCarousel() {
//     if (isTransitioning) return; // Prevent multiple transitions at once

//     isTransitioning = true;
//     const offset = -currentIndex * 100; // Move the carousel based on index
//     carousel.style.transition = "transform .8s ease";
//     carousel.style.transform = `translateX(${offset}%)`;
//   }

//   // Handles the transition end only once
//   carousel.addEventListener("transitionend", () => {
//     isTransitioning = false;

//     if (currentIndex === 0) {
//       // If we're at the fake first slide, jump to the real last slide
//       carousel.style.transition = "none";
//       currentIndex = totalItems;
//       const offset = -currentIndex * 100;
//       carousel.style.transform = `translateX(${offset}%)`;
//     } else if (currentIndex === updatedTotalItems - 1) {
//       // If we're at the fake last slide, jump to the real first slide
//       carousel.style.transition = "none";
//       currentIndex = 1;
//       const offset = -currentIndex * 100;
//       carousel.style.transform = `translateX(${offset}%)`;
//     }
//   });

//   // Next button click
//   nextButton.addEventListener("click", () => {
//     if (!isTransitioning) {
//       currentIndex = (currentIndex + 1) % updatedTotalItems;
//       updateCarousel();
//     }
//   });

//   // Previous button click
//   prevButton.addEventListener("click", () => {
//     if (!isTransitioning) {
//       currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
//       updateCarousel();
//     }
//   });

//   // Touch event handling for mobile
//   let startX = 0;
//   let endX = 0;

//   function handleTouchStart(event) {
//     startX = event.touches[0].clientX;
//   }

//   function handleTouchMove(event) {
//     endX = event.touches[0].clientX;
//   }

//   function handleTouchEnd() {
//     const threshold = 50; // Minimum swipe distance in pixels to trigger a change
//     if (startX - endX > threshold) {
//       // Swiped left, go to the next item
//       currentIndex = (currentIndex + 1) % updatedTotalItems;
//       updateCarousel();
//     } else if (endX - startX > threshold) {
//       // Swiped right, go to the previous item
//       currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
//       updateCarousel();
//     }
//   }

//   // Applies touch events only on small screens
//   if (window.innerWidth <= 770) {
//     carousel.addEventListener("touchstart", handleTouchStart);
//     carousel.addEventListener("touchmove", handleTouchMove);
//     carousel.addEventListener("touchend", handleTouchEnd);
//   }

//   // Initial setup with the first image displayed
//   currentIndex = 1;
//   carousel.style.transform = `translateX(-100%)`; // Show the real first image

//   // Autoplay: Automatically moves to the next slide every 5 seconds
//   const autoplayInterval = setInterval(() => {
//     if (!isTransitioning) {
//       currentIndex = (currentIndex + 1) % updatedTotalItems;
//       updateCarousel();
//     }
//   }, 5000); // Change the slide every 3 seconds

//   // Stop autoplay when the user manually interacts with the carousel (optional)
//   prevButton.addEventListener("click", () => clearInterval(autoplayInterval));
//   nextButton.addEventListener("click", () => clearInterval(autoplayInterval));
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const carousel = document.querySelector("#carousel");
//   const carouselItems = document.querySelectorAll("#carousel li"); // li wraps the img
//   const prevButton = document.querySelector(".prev");
//   const nextButton = document.querySelector(".next");

//   let currentIndex = 0;
//   let isTransitioning = false;
//   const totalItems = carouselItems.length;

//   // Clones the first and last images to create a seamless transition
//   const firstClone = carouselItems[0].cloneNode(true);
//   const lastClone = carouselItems[totalItems - 1].cloneNode(true);

//   // Appends and prepends the clones
//   carousel.appendChild(firstClone);
//   carousel.insertBefore(lastClone, carouselItems[0]);

//   const updatedTotalItems = totalItems + 2; // Account for the clones

//   // Function to update the carousel
//   function updateCarousel() {
//     if (isTransitioning) return; // Prevent multiple transitions at once

//     isTransitioning = true;
//     const offset = -currentIndex * 100; // Move the carousel based on index
//     carousel.style.transition = "transform 0.5s ease";
//     carousel.style.transform = `translateX(${offset}%)`;
//   }

//   // Handles the transition end only once
//   carousel.addEventListener("transitionend", () => {
//     isTransitioning = false;

//     if (currentIndex === 0) {
//       // If we're at the fake first slide, jump to the real last slide
//       carousel.style.transition = "none";
//       currentIndex = totalItems;
//       const offset = -currentIndex * 100;
//       carousel.style.transform = `translateX(${offset}%)`;
//     } else if (currentIndex === updatedTotalItems - 1) {
//       // If we're at the fake last slide, jump to the real first slide
//       carousel.style.transition = "none";
//       currentIndex = 1;
//       const offset = -currentIndex * 100;
//       carousel.style.transform = `translateX(${offset}%)`;
//     }
//   });

//   // Next button click
//   nextButton.addEventListener("click", () => {
//     if (!isTransitioning) {
//       currentIndex = (currentIndex + 1) % updatedTotalItems;
//       updateCarousel();
//     }
//   });

//   // Previous button click
//   prevButton.addEventListener("click", () => {
//     if (!isTransitioning) {
//       currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
//       updateCarousel();
//     }
//   });

//   // Touch event handling for mobile
//   let startX = 0;
//   let endX = 0;

//   function handleTouchStart(event) {
//     startX = event.touches[0].clientX;
//   }

//   function handleTouchMove(event) {
//     endX = event.touches[0].clientX;
//   }

//   function handleTouchEnd() {
//     const threshold = 50; // Minimum swipe distance in pixels to trigger a change
//     if (startX - endX > threshold) {
//       // Swiped left, go to the next item
//       currentIndex = (currentIndex + 1) % updatedTotalItems;
//       updateCarousel();
//     } else if (endX - startX > threshold) {
//       // Swiped right, go to the previous item
//       currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
//       updateCarousel();
//     }
//   }

//   // Applies touch events only on small screens
//   if (window.innerWidth <= 770) {
//     // Keep the event on li, which wraps the image
//     carousel.addEventListener("touchstart", handleTouchStart);
//     carousel.addEventListener("touchmove", handleTouchMove);
//     carousel.addEventListener("touchend", handleTouchEnd);
//   }

//   // Initializs with the first image displayed (which is the real second image due to clones)
//   currentIndex = 1;
//   carousel.style.transform = `translateX(-100%)`; // Show the real first image
// });

// const burgerMenu = document.querySelector('.burger-menu');
// const navContainer = document.querySelector('.nav-container');
// const servicesSection = document.querySelector('#services-carousel');

// burgerMenu.addEventListener('click', function() {
//   navContainer.classList.toggle('nav-open');

//   if (navContainer.classList.contains('nav-open')) {
//     servicesSection.style.marginTop = '260px'
//   } else {
//     servicesSection.style.marginTop ='0'
//   }
// });
// DO NOT TOUCH THIS CODE!!!!!!!!!




// function convertTo24HourFormat(time12hr) {
//     const [time, period] = time12hr.split(" ");
//     let [hours, minutes] = time.split(":").map(num => parseInt(num));

//     if (period === "PM" && hours !== 12) {
//         hours += 12; // Convert PM times to 24-hour format, except for 12 PM
//     }
//     if (period === "AM" && hours === 12) {
//         hours = 0; // Convert 12 AM to 00 hours
//     }

//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.querySelector('form');
//     const appointmentsList = document.getElementById('appointments-list'); // For displaying appointments

//     if (form) {
//         form.addEventListener('submit', function (event) {
//             event.preventDefault(); // Prevents default form submission

//             // Captures form values
//             const nameField = document.getElementById('name');
//             const name = nameField.value.trim();
//             const service = document.getElementById('service').value.trim();
//             const dateInput = document.getElementById('date').value.trim();
//             const timeInput = document.getElementById('time').value.trim();
//             const phone = document.getElementById('phone').value.trim();

//             // Validates form fields
//             if (!name || !service || !dateInput || !timeInput || !phone) {
//                 alert('Please fill in all fields, including the phone number.');
//                 return;
//             }

//             // Convert 12-hour time to 24-hour time
//             const adjustedTime = convertTo24HourFormat(timeInput);

//             console.log('Converted Time:', adjustedTime); // Log converted time to verify

//             // Combine the date and adjusted time, then ensure consistent format
//             const selectedDateTime = new Date(`${dateInput}T${adjustedTime}:00`);

//             // Validate if the selected time is in the future
//             if (selectedDateTime <= new Date()) {
//                 alert('Please select a future date and time.');
//                 return;
//             }

//             // Normalize date and time for conflict checking (store time consistently)
//             const normalizedDate = new Date(dateInput).toISOString().split('T')[0]; // Date in YYYY-MM-DD format
//             const normalizedTime = adjustedTime.padStart(5, '0'); // Ensure time format is HH:mm

//             // Create an appointment object
//             const appointment = {
//                 name,
//                 service,
//                 date: normalizedDate,
//                 time: normalizedTime,
//                 phone,
//             };

//             try {
//                 // Retrieve existing appointments or initialize as an empty array
//                 let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

//                 // Check for conflicts: Corrected comparison to check both date and time
//                 const isConflict = appointments.some(
//                     (appt) => appt.date === normalizedDate && appt.time === normalizedTime
//                 );

//                 if (isConflict) {
//                     alert('The selected time slot is already booked. Please choose another.');
//                     return;
//                 }

//                 // Add new appointment and save to localStorage
//                 appointments.push(appointment);
//                 localStorage.setItem('appointments', JSON.stringify(appointments));

//                 // Success message
//                 alert('Appointment successfully booked!');

//                 // Clear the form fields
//                 form.reset();

//                 // Update displayed appointments
//                 displayAppointments(appointmentsList, appointments);
//             } catch (error) {
//                 console.error('Error accessing localStorage:', error);
//                 alert('An error occurred while saving the appointment. Please try again.');
//             }
//         });
//     }

//     // Display existing appointments on page load
//     const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
//     displayAppointments(appointmentsList, appointments);
// });

// // Function to display appointments
// function displayAppointments(appointmentsList, appointments) {
//     if (appointmentsList) {
//         appointmentsList.innerHTML = ''; // Clear existing appointments
//         appointments.forEach((appointment) => {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${appointment.date} ${appointment.time} - ${appointment.name} (${appointment.service}, ${appointment.phone})`;
//             appointmentsList.appendChild(listItem);
//         });
//     }
// }
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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const appointmentsList = document.getElementById('appointments-list'); // For displaying appointments

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevents default form submission

            // Captures form values
            const nameField = document.getElementById('name');
            const name = nameField.value.trim();
            const service = document.getElementById('service').value.trim();
            const dateInput = document.getElementById('date').value.trim();
            const timeInput = document.getElementById('time').value.trim();
            const phone = document.getElementById('phone').value.trim();

            // Validates form fields
            if (!name || !service || !dateInput || !timeInput || !phone) {
                alert('Please fill in all fields, including the phone number.');
                return;
            }

            // Convert 12-hour time to 24-hour time
            const adjustedTime = convertTo24HourFormat(timeInput);

            console.log('Converted Time:', adjustedTime); // Log converted time to verify

            // Combine the date and adjusted time, then ensure consistent format
            const selectedDateTime = new Date(`${dateInput}T${adjustedTime}:00`);

            // Validate if the selected time is in the future
            if (selectedDateTime <= new Date()) {
                alert('Please select a future date and time.');
                return;
            }

            // Normalize date and time for conflict checking (store time consistently)
            const normalizedDate = new Date(dateInput).toISOString().split('T')[0]; // Date in YYYY-MM-DD format
            const normalizedTime = adjustedTime.padStart(5, '0'); // Ensure time format is HH:mm

            // Create an appointment object
            const appointment = {
                name,
                service,
                date: normalizedDate,
                time: normalizedTime,
                phone,
            };

            try {
                // Retrieve existing appointments or initialize as an empty array
                let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

                // Check for conflicts: Corrected comparison to check both date and time
                const isConflict = appointments.some(
                    (appt) => appt.date === normalizedDate && appt.time === normalizedTime
                );

                if (isConflict) {
                    alert('The selected time slot is already booked. Please choose another.');
                    return;
                }

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



// Handles appinments (Modify/Delete)
// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.querySelector('form');
//     const appointmentsList = document.getElementById('appointments-list'); // For displaying appointments

//     if (form) {
//         form.addEventListener('submit', function (event) {
//             event.preventDefault(); // Prevents default form submission

//             // Captures form values
//         const nameField = document.getElementById('name');
//         const name = nameField.value.trim();
//         const service = document.getElementById('service').value.trim();
//         const dateInput = document.getElementById('date').value.trim();
//         const timeInput = document.getElementById('time').value.trim();
//         console.log('Time Input:', timeInput);
//         const phone = document.getElementById('phone').value.trim();

//         // Validates form fields
//         if (!name || !service || !dateInput || !timeInput || !phone) {
//             alert('Please fill in all fields, including the phone number.');
//             return;
//         }

//           // Time formatting adjustment: Ensure times after 11:00 AM are converted to PM
//           // Time formatting adjustment: Ensure times after 11:00 AM are converted to PM
//           // let adjustedTime = timeInput;

//           // if (timeInput.includes("AM")) {
//           //     // Keep AM times as is for 10:00 and 11:00 AM
//           //     if (timeInput === "10:00" || timeInput === "11:00") {
//           //         adjustedTime = timeInput; // 10:00 AM and 11:00 AM should remain unchanged
//           //     } else {
//           //         // Other AM times should remain unchanged
//           //         adjustedTime = timeInput;
//           //     }
//           // } else if (timeInput.includes("PM")) {
//           //     // PM times should remain unchanged
//           //     adjustedTime = timeInput;
//           // }
//           let adjustedTime = timeInput;

//           // If the time is AM, keep AM times as is, but convert non-11 AM times to PM.
//           if (timeInput.includes("AM") && timeInput !== "10:00 AM" && timeInput !== "11:00 AM") {
//             adjustedTime = timeInput.replace("AM", "PM");
//           }

//           // If the time is PM, it stays the same.
//           // The original code logic for PM is correct.
//           if (timeInput.includes("PM")) {
//             adjustedTime = timeInput;
//           }

//           console.log('Adjusted Time:', adjustedTime);  // Log adjusted time to see what value is stored


//           // Now, you can handle the selected date and time, ensuring it's consistent for all cases.
//           // const selectedDateTime = new Date(`${dateInput}T${adjustedTime}:00`);
//           const selectedDateTime = new Date(`${dateInput}T${adjustedTime}:00`);
//           console.log('Selected Date and Time:', selectedDateTime);  // Log the combined Date and Time


//             // let adjustedTime = timeInput;
          
//             // if (timeInput.includes("AM")) {
//             //     if (timeInput === "10:00" || timeInput === "11:00") {
//             //         adjustedTime = timeInput; // 10:00 AM and 11:00 AM should remain unchanged
//             //     } else {
//             //         // All other AM times should be converted to PM
//             //         adjustedTime = timeInput.replace("AM", "PM");
//             //     }
//             // }

//             // // Combine the date and adjusted time, then ensure consistent format
//             // const selectedDateTime = new Date(`${dateInput}T${adjustedTime}:00`);

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


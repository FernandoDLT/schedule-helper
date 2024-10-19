// document.addEventListener("DOMContentLoaded", () => {
// const carousel = document.querySelector("#carousel");
// const carouselItems = document.querySelectorAll("#carousel li");
// const prevButton = document.querySelector(".prev");
// const nextButton = document.querySelector(".next");
    
//   let currentIndex = 0;
//   const totalItems = carouselItems.length;

//   // Function to update the carousel
//   function updateCarousel() {
//     const offset = -currentIndex * 100; // Move the carousel based on index
//     carousel.style.transform = `translateX(${offset}%)`;
//   }

//   // Next button click
//   nextButton.addEventListener("click", () => {
//     currentIndex = (currentIndex + 1) % totalItems;
//     updateCarousel();
//   });

//   // Previous button click
//   prevButton.addEventListener("click", () => {
//     currentIndex = (currentIndex - 1 + totalItems) % totalItems;
//     updateCarousel();
//   });

//   // Initialize with the first image displayed
//   updateCarousel();
// });

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#carousel");
  const carouselItems = document.querySelectorAll("#carousel li");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  let currentIndex = 0;
  let isTransitioning = false;
  const totalItems = carouselItems.length;

  // Clone the first and last images to create a seamless transition
  const firstClone = carouselItems[0].cloneNode(true);
  const lastClone = carouselItems[totalItems - 1].cloneNode(true);

  // Append and prepend the clones
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

    // When the transition ends, check for the cloned items
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
  }

  // Next button click
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % updatedTotalItems;
    updateCarousel();
  });

  // Previous button click
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
    updateCarousel();
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

  // Apply touch events only on small screens
  if (window.innerWidth <= 770) {
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
  }

  // Initialize with the first image displayed (which is the real second image due to clones)
  currentIndex = 1;
  carousel.style.transform = `translateX(-100%)`; // Show the real first image
});

// document.addEventListener("DOMContentLoaded", () => {
//   const carousel = document.querySelector("#carousel");
//   const carouselItems = document.querySelectorAll("#carousel li");
//   const prevButton = document.querySelector(".prev");
//   const nextButton = document.querySelector(".next");

//   let currentIndex = 0;
//   let isTransitioning = false;
//   const totalItems = carouselItems.length;

//   // Clone the first and last images to create a seamless transition
//   const firstClone = carouselItems[0].cloneNode(true);
//   const lastClone = carouselItems[totalItems - 1].cloneNode(true);

//   // Append and prepend the clones
//   carousel.appendChild(firstClone);
//   carousel.insertBefore(lastClone, carouselItems[0]);

//   const updatedTotalItems = totalItems + 2; // Account for the clones

//   // Function to update the carousel
//   function updateCarousel() {
//     if (isTransitioning) return; // Prevent multiple transitions at once

//     isTransitioning = true;
//     const offset = -currentIndex * 100; // Move the carousel based on index
//     carousel.style.transition = "transform 0.5s ease"; // Re-enable transition
//     carousel.style.transform = `translateX(${offset}%)`;

//     // When the transition ends, check for the cloned items
//     carousel.addEventListener("transitionend", () => {
//       isTransitioning = false;
//       if (currentIndex === 0) {
//         // If we're at the fake first slide, jump to the real last slide
//         carousel.style.transition = "none"; // Disable transition for jump
//         currentIndex = totalItems;
//         const offset = -currentIndex * 100;
//         carousel.style.transform = `translateX(${offset}%)`;
//       } else if (currentIndex === updatedTotalItems - 1) {
//         // If we're at the fake last slide, jump to the real first slide
//         carousel.style.transition = "none"; // Disable transition for jump
//         currentIndex = 1;
//         const offset = -currentIndex * 100;
//         carousel.style.transform = `translateX(${offset}%)`;
//       }
//     });
//   }

//   // Next button click
//   nextButton.addEventListener("click", () => {
//     currentIndex = (currentIndex + 1) % updatedTotalItems;
//     updateCarousel();
//   });

//   // Previous button click
//   prevButton.addEventListener("click", () => {
//     currentIndex = (currentIndex - 1 + updatedTotalItems) % updatedTotalItems;
//     updateCarousel();
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

//   // Apply touch events only on small screens
//   if (window.innerWidth <= 770) {
//     carousel.addEventListener("touchstart", handleTouchStart);
//     carousel.addEventListener("touchmove", handleTouchMove);
//     carousel.addEventListener("touchend", handleTouchEnd);
//   }

//   // Initialize without transition
//   carousel.style.transition = "none"; // Disable transition for the initial setup
//   currentIndex = 1;
//   carousel.style.transform = `translateX(-100%)`; // Show the real first image

//   // Re-enable transition after initialization
//   setTimeout(() => {
//     carousel.style.transition = "transform 0.5s ease"; // Re-enable transition
//   }, 50); // Slight delay to ensure transition is applied after initial setup
// });


const burgerMenu = document.querySelector('.burger-menu');
const navContainer = document.querySelector('.nav-container');
const servicesSection = document.querySelector('#services-carousel');

burgerMenu.addEventListener('click', function() {
  navContainer.classList.toggle('nav-open');

  if (navContainer.classList.contains('nav-open')) {
    servicesSection.style.marginTop = '100px'
  } else {
    servicesSection.style.marginTop ='0'
  }
});


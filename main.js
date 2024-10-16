document.addEventListener("DOMContentLoaded", () => {
const carousel = document.querySelector("#carousel");
const carouselItems = document.querySelectorAll("#carousel li");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
  
const burgerMenu = document.querySelector('.burger-menu');
const navContainer = document.querySelector('.nav-container');

burgerMenu.addEventListener('click', () => {
   navContainer.classList.toggle('nav-open');
});


// const burgerMenu = document.querySelector('.burger-menu');
// const nav = document.querySelector('.nav-container nav');

// burgerMenu.addEventListener('click', () => {
//    nav.classList.toggle('active');  // Toggles the "active" class to show/hide the menu
// });
  
  let currentIndex = 0;
  const totalItems = carouselItems.length;

  // Function to update the carousel
  function updateCarousel() {
    const offset = -currentIndex * 100; // Move the carousel based on index
    carousel.style.transform = `translateX(${offset}%)`;
  }

  // Next button click
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  });

  // Previous button click
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  });

  // Initialize with the first image displayed
  updateCarousel();
});


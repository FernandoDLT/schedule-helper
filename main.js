document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#carousel");
  const carouselItems = document.querySelectorAll("#carousel li");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  
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


document.addEventListener('DOMContentLoaded', () => {
   const carousel = document.getElementById('carousel');
   const ul = carousel ? carousel.querySelector('ul') : null;
   const prevBtn = document.querySelector('.prev');
   const nextBtn = document.querySelector('.next');

   let currentIndex = 0;
   const slideWidth = carousel.offsetWidth;

   if (ul) {
      // Initialize the carousel to show only the first image
      ul.children.forEach((li, index) => {
         if (index !== currentIndex) {
            li.style.display = 'none';
         }
      });

      prevBtn.addEventListener('click', () => {
         currentIndex = (currentIndex - 1 + ul.children.length) % ul.children.length;
         updateCarousel();
      });

      nextBtn.addEventListener('click', () => {
         currentIndex = (currentIndex + 1) % ul.children.length;
         updateCarousel();
      });

      function updateCarousel() {
         ul.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }
   } else {
      console.error("The 'ul' element could not be found.");
   }
});

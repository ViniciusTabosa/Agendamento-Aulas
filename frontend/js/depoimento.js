const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next-button');
const prevButton = document.querySelector('.prev-button');

let currentIndex = 0;

const moveToSlide = (index) => {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
};

nextButton.addEventListener('click', () => {
  if (currentIndex < slides.length - 2) {
    currentIndex += 2;
  } else {
    currentIndex = 0;
  }
  moveToSlide(currentIndex);
});

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex -= 2;
  } else {
    currentIndex = slides.length - 2;
  }
  moveToSlide(currentIndex);
});

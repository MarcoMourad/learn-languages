const slides = [...document.querySelectorAll(".intro-slide")];
const dots = [...document.querySelectorAll(".dot")];
const nextButton = document.getElementById("nextSlide");
let currentSlide = 0;
function showSlide(index) {
  currentSlide = index;
  slides.forEach((slide, position) => slide.classList.toggle("active", position === index));
  dots.forEach((dot, position) => dot.classList.toggle("active", position === index));
  nextButton.textContent = index === slides.length - 1 ? "ابدأ الآن" : "التالي";
}
nextButton.addEventListener("click", () => {
  if (currentSlide === slides.length - 1) window.location.href = "../loading/index.html";
  else showSlide(currentSlide + 1);
});
dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));

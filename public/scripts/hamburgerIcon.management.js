const hamburger = document.getElementById("hamburger");
const closeNav = document.getElementById("close-nav");
const mobileNavbar = document.getElementById("mobile-navbar");
const backdrop = document.getElementById("backdrop");

// Open mobile navbar
hamburger.addEventListener("click", () => {
  mobileNavbar.classList.remove("-translate-x-full");
  backdrop.classList.remove("hidden");
});

// Close mobile navbar
closeNav.addEventListener("click", () => {
  mobileNavbar.classList.add("-translate-x-full");
  backdrop.classList.add("hidden");
});

// Close mobile navbar when clicking on the backdrop
backdrop.addEventListener("click", () => {
  mobileNavbar.classList.add("-translate-x-full");
  backdrop.classList.add("hidden");
});

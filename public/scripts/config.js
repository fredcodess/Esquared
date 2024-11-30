const bookingConfigElement = document.getElementById("booking-overlay");
const backdropElement = document.getElementById("backdrop");

const editBookingBtn = document.getElementById("edit-booking");
const cancelBookingBtn = document.getElementById("cancel-booking");

function openBookingConfig() {
  bookingConfigElement.style.display = "block";
  backdropElement.style.display = "block";
}

function closeBookingConfig() {
  bookingConfigElement.style.display = "none";
  backdropElement.style.display = "none";
}

editBookingBtn.addEventListener("click", openBookingConfig);
cancelBookingBtn.addEventListener("click", closeBookingConfig);
backdropElement.addEventListener("click", closeBookingConfig);

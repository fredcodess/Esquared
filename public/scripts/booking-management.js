const deleteBookingButtonElements = document.querySelectorAll(".delete-btn");

async function deleteBooking(event) {
  const buttonElement = event.target;
  const bookingId = buttonElement.dataset.bookingid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/admin/manage-bookings/" + bookingId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );

  buttonElement.parentElement.parentElement.remove();
}

for (const deleteBookingButtonElement of deleteBookingButtonElements) {
  deleteBookingButtonElement.addEventListener("click", deleteBooking);
}

const deleteContactButtonElements = document.querySelectorAll(".send-btn");

async function deleteContact(event) {
  const buttonElement = event.target;
  const contactId = buttonElement.dataset.contactid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/admin/enquiries/" + contactId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );

  buttonElement.parentElement.parentElement.remove();
}

for (const deleteContactButtonElement of deleteContactButtonElements) {
  deleteContactButtonElement.addEventListener("click", deleteContact);
}

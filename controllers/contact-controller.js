const Contact = require("../models/contactModel");
const nodemailer = require("nodemailer");
const sessionFlash = require("../util/sessionFlash");

function getContactPage(req, res) {
  res.render("customer/contact");
}

async function contact(req, res) {
  const contact = new Contact(
    req.body.fullname,
    req.body.email,
    req.body.subject,
    req.body.message
  );

  await contact.contact();

  res.redirect("/");
}

async function getAllEnquiries(req, res, next) {
  try {
    const contacts = await Contact.findAll();
    console.log(contacts);
    res.render("admin/enquiries", { contacts: contacts });
  } catch (error) {
    next(error);
  }
}

async function getEnquiriesDetails(req, res, next) {
  try {
    const contact = await Contact.findById(req.params.id);
    res.render("customer/products/product-details", { contact: contact });
  } catch (error) {
    next(error);
  }
}

async function getEnquiriesResponse(req, res, next) {
  const { contactId, response } = req.body; // Extract data from the form submission

  try {
    // Save the response to the database (assuming you have a response field in the Contact model)
    await Contact.saveResponse(contactId, response);

    // Optional: Send email to the customer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@example.com", // Replace with your email
        pass: "your-email-password", // Replace with your email password or app password
      },
    });

    const mailOptions = {
      from: "your-email@example.com",
      to: contact.email,
      subject: `Response to: ${contact.subject}`,
      text: `Dear ${contact.fullname},\n\n${response}\n\nBest regards,\nSupport Team`,
    };

    await transporter.sendMail(mailOptions);

    // Redirect back to the inquiries page with a success message
    req.flash("success", "Response sent successfully!");
    res.redirect("/admin/enquiries");
  } catch (error) {
    next(error); // Handle errors
  }
}

module.exports = {
  getContactPage: getContactPage,
  contact: contact,
  getAllEnquiries: getAllEnquiries,
  getEnquiriesDetails: getEnquiriesDetails,
  getEnquiriesResponse: getEnquiriesResponse,
};

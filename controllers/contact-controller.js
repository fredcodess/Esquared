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

async function getUpdateContact(req, res, next) {
  try {
    const contact = await Contact.findById(req.params.id);
    res.render("admin/respond", { contact: contact });
  } catch (error) {
    next(error);
  }
}

async function sendEmailResponse(req, res, next) {
  try {
    const contact = await Contact.findById(req.params.id); // Find contact by ID
    if (!contact) {
      return res.status(404).send("Contact not found");
    }

    // Get admin's response from the form
    const { response } = req.body;
    const adminEmail = "ee.squaredd@gmail.com"; // Admin email address

    // Create a Nodemailer transporter
    var transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: adminEmail,
        pass: "irxoyzhtxyiwkyhz", // Ensure this is handled securely in production
      },
    });

    // Mail options
    const mailOptions = {
      from: `E-Squared <${adminEmail}>`,
      to: contact.email, // Contact's email retrieved from the database
      subject: contact.subject,
      text: response,
    };

    // Send the email
    await transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return next(error); // Handle errors in email sending
      }
      contact.update();
      res.redirect("/admin/enquiries"); // Redirect to the contacts list after sending email
    });
  } catch (error) {
    next(error); // Handle other errors
  }
}
async function deleteContact(req, res, next) {
  let contact;
  try {
    contact = await Contact.findById(req.params.id);
    await contact.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted Product!" });
}

module.exports = {
  getContactPage: getContactPage,
  contact: contact,
  getAllEnquiries: getAllEnquiries,
  deleteContact: deleteContact,
  getUpdateContact: getUpdateContact,
  sendEmailResponse: sendEmailResponse,
};

const Booking = require("../models/bookingsModel");
const Contact = require("../models/contactModel");
const nodemailer = require("nodemailer");
const sessionFlash = require("../util/sessionFlash");
const BookingCount = require("../models/bookingCount");
const VisitorCount = require("../models/visitorCount");

async function getAllBookings(req, res, next) {
  try {
    const bookings = await Booking.findAll();
    console.log(bookings);
    res.render("admin/manage-bookings", { bookings: bookings });
  } catch (error) {
    next(error);
  }
}

function getEnquiries(req, res) {
  res.render("admin/enquiries");
}

async function deleteBooking(req, res, next) {
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    await booking.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted Booking!" });
}

async function enquiriesResponse(req, res) {
  const contact = new Contact(
    req.body.fullname,
    req.body.email,
    req.body.subject,
    req.body.message
  );

  const adminEmail = "ee.squaredd@gmail.com";

  var transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: adminEmail,
      pass: "irxoyzhtxyiwkyhz",
    },
  });

  const mailOptions = {
    from: `${req.body.fullname} <${adminEmail}>`,
    to: "fredickobroni@gmail.com",
    subject: `${req.body.subject}`,
    text: `${req.body.message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  console.log(contact);
  res.redirect("");
}

async function sendEmailResponse(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send("Contact not found");
    }

    // Get admin's response from the form
    const { status } = req.body;
    const adminEmail = "ee.squaredd@gmail.com"; // Admin email address

    // Determine the email message based on the booking status
    let emailMessage = "";

    if (status === "approved") {
      emailMessage = `Your booking for ${booking.event_type} has been approved. We look forward to seeing you on ${booking.event_date} at ${booking.appointment_time}.`;
    } else if (status === "cancelled") {
      emailMessage = `We're sorry to inform you that your booking for ${booking.event_type} has been cancelled. If you need further assistance, please feel free to contact us.`;
    } else {
      emailMessage = `Your booking status is currently pending.`;
    }

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
      to: booking.email, // Contact's email retrieved from the database
      subject: booking.subject,
      text: emailMessage,
    };

    // Send the email
    await transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return next(error); // Handle errors in email sending
      }
      booking.update();
      res.redirect("/admin/manage-bookings"); // Redirect to the contacts list after sending email
    });
  } catch (error) {
    next(error); // Handle other errors
  }
}

async function getUpdateBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    res.render("admin/confirm-booking", { booking: booking });
  } catch (error) {
    next(error);
  }
}

async function getAnalyticsPage(req, res) {
  try {
    // Fetch booking counts for each day of the week
    const bookingCounts = await BookingCount.getCounts();
    const visitorCounts = await VisitorCount.getCounts();

    // Render the bookings page and pass the booking counts to the template
    res.render("admin/analytics", {
      bookingCounts: bookingCounts,
      visitorCounts: visitorCounts, // Pass the bookingCounts object directly
    });
  } catch (error) {
    console.error("Error fetching booking counts:", error);
    res.redirect("/error"); // Handle errors gracefully
  }
}

module.exports = {
  getAllBookings: getAllBookings,
  getEnquiries: getEnquiries,
  deleteBookings: deleteBooking,
  enquiriesResponse: enquiriesResponse,
  sendEmailResponse: sendEmailResponse,
  getUpdateBooking: getUpdateBooking,
  getAnalyticsPage: getAnalyticsPage,
};

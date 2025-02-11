const mongodb = require("mongodb");
const db = require("../data/database");

class Booking {
  constructor(
    fullname,
    email,
    event_type,
    service_type,
    event_date,
    appointment_time,
    event_location,
    additional_info,
    id = null
  ) {
    this.fullname = fullname;
    this.email = email;
    this.event_type = event_type;
    this.service_type = service_type;
    this.event_date = event_date;
    this.appointment_time = appointment_time;
    this.event_location = event_location;
    this.additional_info = additional_info;

    if (id) {
      this.id = id.toString();
    }
  }

  // Method to save a new booking to the database
  async bookings() {
    await db.getDb().collection("bookings").insertOne({
      fullname: this.fullname,
      email: this.email,
      event_type: this.event_type,
      service_type: this.service_type,
      event_date: this.event_date,
      appointment_time: this.appointment_time,
      event_location: this.event_location,
      additional_info: this.additional_info,
    });
  }

  // Static method to retrieve all bookings
  static async findAll() {
    const bookings = await db.getDb().collection("bookings").find().toArray();
    return bookings.map((bookingDoc) => {
      return new Booking(
        bookingDoc.fullname,
        bookingDoc.email,
        bookingDoc.event_type,
        bookingDoc.service_type,
        bookingDoc.event_date,
        bookingDoc.appointment_time,
        bookingDoc.event_location,
        bookingDoc.additional_info,
        bookingDoc._id
      );
    });
  }

  // Static method to find a booking by its ID
  static async findById(bookingId) {
    let bookId;
    try {
      bookId = new mongodb.ObjectId(bookingId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const booking = await db
      .getDb()
      .collection("bookings")
      .findOne({ _id: bookId });

    if (!booking) {
      const error = new Error("Could not find booking with provided id.");
      error.code = 404;
      throw error;
    }

    return new Booking(
      booking.fullname,
      booking.email,
      booking.event_type,
      booking.service_type,
      booking.event_date,
      booking.appointment_time,
      booking.event_location,
      booking.additional_info,
      booking._id
    );
  }

  // Method to update booking status (e.g., "responded")
  async update() {
    if (this.id) {
      const bookingId = new mongodb.ObjectId(this.id);
      const responded = "responded";
      await db
        .getDb()
        .collection("bookings")
        .updateOne(
          { _id: bookingId },
          {
            $set: {
              status: responded,
            },
          }
        );
    }
  }

  // Method to remove a booking
  async remove() {
    const bookingId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("bookings").deleteOne({ _id: bookingId });
  }

  // Static method to get the booking counts for each day of the week (e.g., Monday to Sunday)
  static async getBookingCounts() {
    const bookings = await db.getDb().collection("bookings").find().toArray();

    const counts = {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    };

    bookings.forEach((booking) => {
      const eventDate = new Date(booking.event_date);
      const dayOfWeek = eventDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      counts[daysOfWeek[dayOfWeek]]++;
    });

    return counts;
  }
}

module.exports = Booking;

// const mongodb = require("mongodb");
// const db = require("../data/database");

// class Booking {
//   constructor(
//     fullname,
//     email,
//     event_type,
//     service_type,
//     event_date,
//     appointment_time,
//     event_location,
//     additional_info,
//     id = null
//   ) {
//     this.fullname = fullname;
//     this.email = email;
//     this.event_type = event_type;
//     this.service_type = service_type;
//     this.event_date = event_date;
//     this.appointment_time = appointment_time;
//     this.event_location = event_location;
//     this.additional_info = additional_info;
//     if (id) {
//       this.id = id.toString();
//     }
//   }

//   async bookings() {
//     await db.getDb().collection("bookings").insertOne({
//       fullname: this.fullname,
//       email: this.email,
//       event_type: this.event_type,
//       service_type: this.service_type,
//       event_date: this.event_date,
//       appointment_time: this.appointment_time,
//       event_location: this.event_location,
//       additional_info: this.additional_info,
//     });
//   }

//   static async findAll() {
//     const bookings = await db.getDb().collection("bookings").find().toArray();
//     return bookings.map((bookingDoc) => {
//       return new Booking(
//         bookingDoc.fullname,
//         bookingDoc.email,
//         bookingDoc.event_type,
//         bookingDoc.service_type,
//         bookingDoc.event_date,
//         bookingDoc.appointment_time,
//         bookingDoc.event_location,
//         bookingDoc.additional_info,
//         bookingDoc._id
//       );
//     });
//   }

//   static async findById(bookingId) {
//     let bookId;
//     try {
//       bookId = new mongodb.ObjectId(bookingId);
//     } catch (error) {
//       error.code = 404;
//       throw error;
//     }
//     const booking = await db
//       .getDb()
//       .collection("bookings")
//       .findOne({ _id: bookId });

//     if (!booking) {
//       const error = new Error("Could not find booking with provided id.");
//       error.code = 404;
//       throw error;
//     }

//     return new Booking(
//       booking.fullname,
//       booking.email,
//       booking.event_type,
//       booking.service_type,
//       booking.event_date,
//       booking.appointment_time,
//       booking.event_location,
//       booking.additional_info,
//       booking._id
//     );
//   }

//   async update() {
//     if (this.id) {
//       const bookingId = new mongodb.ObjectId(this.id);
//       const responded = "responded";
//       await db
//         .getDb()
//         .collection("bookings")
//         .updateOne(
//           { _id: bookingId },
//           {
//             $set: {
//               status: responded,
//             },
//           }
//         );
//     }
//   }

//   remove() {
//     const bookingsId = new mongodb.ObjectId(this.id);
//     return db.getDb().collection("bookings").deleteOne({ _id: bookingsId });
//   }
// }

// module.exports = Booking;

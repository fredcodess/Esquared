const mongodb = require("mongodb");
const db = require("../data/database");

class Booking {
  constructor(
    event_type,
    service_type,
    event_date,
    appointment_time,
    event_location,
    additional_info
  ) {
    this.event_type = event_type;
    this.service_type = service_type;
    this.event_date = event_date;
    this.appointment_time = appointment_time;
    this.event_location = event_location;
    this.additional_info = additional_info;
  }

  async bookings() {
    await db.getDb().collection("bookings").insertOne({
      event_type: this.event_type,
      service_type: this.service_type,
      event_date: this.event_date,
      appointment_time: this.appointment_time,
      event_location: this.event_location,
      additional_info: this.additional_info,
    });
  }
}

module.exports = Booking;

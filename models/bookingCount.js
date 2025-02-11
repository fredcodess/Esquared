const mongodb = require("mongodb");
const db = require("../data/database");

class BookingCount {
  constructor() {
    this.bookingCounts = {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    };
  }

  // Increment count for the given day
  async incrementCount(day) {
    const dayMapping = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    if (dayMapping[day] === undefined) {
      throw new Error("Invalid day");
    }

    // Fetch the current booking counts from the database
    const existingCount = await db
      .getDb()
      .collection("bookingCounts")
      .findOne({});

    // If no counts exist yet, initialize them
    if (!existingCount) {
      this.bookingCounts[day] = 1; // Initialize the count for the specific day
      await db
        .getDb()
        .collection("bookingCounts")
        .insertOne({ bookingCounts: this.bookingCounts }); // Create a new entry
    } else {
      // Increment the booking count for the specific day
      const newBookingCounts = { ...existingCount.bookingCounts };
      newBookingCounts[day] += 1;

      // Update the database with the new counts
      await db
        .getDb()
        .collection("bookingCounts")
        .updateOne({}, { $set: { bookingCounts: newBookingCounts } });
    }
  }

  // Get the booking counts
  static async getCounts() {
    const result = await db.getDb().collection("bookingCounts").findOne({});
    if (!result) {
      return {
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
      };
    }
    return result.bookingCounts;
  }
}

module.exports = BookingCount;

const db = require("../data/database");

class VisitorCount {
  constructor() {
    this.visitorCounts = {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    };
  }

  // Increment the count for the specific day
  async incrementCount(day) {
    // Validate if the day is correct
    if (!this.visitorCounts.hasOwnProperty(day)) {
      throw new Error("Invalid day provided");
    }

    try {
      // Increment the count for the specified day
      const updateResult = await db
        .getDb()
        .collection("visitorCounts")
        .updateOne(
          {}, // Update the first document (assuming only one exists)
          {
            $inc: { [`visitorCounts.${day}`]: 1 }, // Increment only the specific day's count
          },
          { upsert: true } // Create the document if it doesn't exist
        );

      // Check if the document was upserted or updated
      if (updateResult.upsertedCount > 0) {
        console.log(`New visitor count document created.`);
      } else {
        console.log(`Visitor count for ${day} updated.`);
      }
    } catch (err) {
      console.error("Error incrementing visitor count:", err);
      throw err;
    }
  }

  // Retrieve the current counts from the database
  static async getCounts() {
    try {
      const result = await db.getDb().collection("visitorCounts").findOne({});
      if (!result) {
        // Return default counts if no data is found
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
      return result.visitorCounts; // Return the saved booking counts
    } catch (err) {
      console.error("Error fetching visitor counts:", err);
      throw err;
    }
  }
}

module.exports = VisitorCount;

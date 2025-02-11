const VisitorCount = require("../models/visitorCount");

async function getHomePage(req, res) {
  try {
    // Get the current day of the week (e.g., 'sunday', 'monday', etc.)
    const currentDay = new Date()
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase();

    // Increment the visitor count for the current day
    const visitorCountInstance = new VisitorCount();
    await visitorCountInstance.incrementCount(currentDay); // Increment the count for today

    // Render the homepage without showing the count
    res.render("customer/index");
  } catch (err) {
    console.error("Error updating visitor count:", err);
    res.status(500).send("Error updating visitor count.");
  }
}

async function getPriceList(req, res) {
  res.render("customer/price");
}
module.exports = {
  getHomePage,
  getPriceList,
};

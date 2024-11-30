function getHomePage(req, res) {
  res.render("customer/index");
}

module.exports = {
  getHomePage: getHomePage,
};

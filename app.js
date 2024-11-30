const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthenticationStatusMiddleware = require("./middlewares/check-authentication");
const authenticationRoutes = require("./routes/authentication-routes");
const indexRoutes = require("./routes/index-routes");
const contactRoutes = require("./routes/contact-routes");
const teamRoutes = require("./routes/team-routes");
const adminRoutes = require("./routes/admin-routes");
const bookingsRoutes = require("./routes/bookings-routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.static("media"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthenticationStatusMiddleware);

app.use(authenticationRoutes);
app.use(indexRoutes);
app.use(contactRoutes);
app.use(teamRoutes);
app.use(adminRoutes);
app.use(bookingsRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to database");
    console.log(error);
  });

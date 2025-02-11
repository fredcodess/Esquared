const User = require("../models/userModel");
const authenticationUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/sessionFlash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
      confirm_password: "",
      fullname: "",
      street: "",
      postalCode: "",
      city: "",
    };
  }
  res.render("customer/authentication/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    confirm_password: req.body["confirm_password"],
    fullname: req.body.fullname,
    street: req.body.street,
    postalCode: req.body.postalCode,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreCorrect(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postalCode,
      req.body.city
    ) ||
    !validation.passwordIsConfirmed(
      req.body.password,
      req.body["confirm_password"]
    )
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Passsword must be at least 6 characters long, postal code must be 6 characrters long.",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postalCode,
    req.body.city
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already! Try logging in instead!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/authentication/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;

  try {
    existingUser = await user.getUserWithSameEmail();
    console.log("Looking for user with email:", this.email);
    console.log("Found user:", existingUser);
  } catch (error) {
    next(error);
    return;
  }

  // Check if the user exists
  if (!existingUser) {
    console.log("User not found");
    return res.redirect("/login"); // You can also send a custom error message
  }

  const sessionErrorData = {
    errorMessage: "Invalid credentials - please check your details",
    email: user.email,
    password: user.password,
  };

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authenticationUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authenticationUtil.destroyUserAuthenticationSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};

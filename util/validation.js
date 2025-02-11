function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
}

function userDetailsAreCorrect(
  email,
  password,
  fullname,
  street,
  postalCode,
  city
) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(fullname) &&
    !isEmpty(street) &&
    !isEmpty(postalCode) &&
    !isEmpty(city)
  );
}

function passwordIsConfirmed(password, confirm_password) {
  return password === confirm_password;
}

module.exports = {
  userCredentialsAreValid: userCredentialsAreValid,
  userDetailsAreCorrect: userDetailsAreCorrect,
  passwordIsConfirmed: passwordIsConfirmed,
};

const validateDate = require("validate-date");

////////////////////////////////////////////////////////////////

const HttpError = require("../models/http-error");

////////////////////////////////////////////////////////////////

// checkDate(date date) checks if date is valid and formats it correctly yyyy-mm-dd
const checkDate = (date) => {
  let dateIsValid = validateDate(date, (responseType = "boolean"));
  if (!dateIsValid) {
    return next(new HttpError("Invalid date was entered", 400));
  }

  let dateFormat1 = validateDate(
    date,
    (responseType = "boolean"),
    (dateFormat = "mm/dd/yyyy")
  );
  let dateFormat2 = validateDate(
    date,
    (responseType = "boolean"),
    (dateFormat = "yyyy-mm-dd")
  );
  if (!dateFormat1 && !dateFormat2) {
    return next(new HttpError("Invalid date format was entered", 422));
  } else if (!dateFormat2) {
    const dateParts = date.split("/");
    const newDate = `'${dateParts[2]}-${dateParts[0]}-${dateParts[1]}'`;
    return newDate;
  }
  return date;
};

////////////////////////////////////////////////////////////////

module.exports = checkDate;

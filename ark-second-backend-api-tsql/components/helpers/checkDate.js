const validateDate = require("validate-date");

////////////////////////////////////////////////////////////////

const HttpError = require("../models/http-error");

////////////////////////////////////////////////////////////////

// checkDate(date date) checks if date is valid and formats it correctly yyyy-mm-dd
const checkDate = (date) => {
  let dateIsValid = validateDate(date, (responseType = "boolean"));
  if (!dateIsValid) {
    throw new HttpError("Invalid date was entered", 400);
  }
  const format = date.includes("-") ? "yyyy-mm-dd" : "mm/dd/yyyy"
  let check = validateDate(
    date,
    responseType = "boolean",
    dateFormat = format
  );
  if (!check) {
    throw new HttpError("Invalid date format was entered", 422);
  } else if (date.includes("/")) {
    const dateParts = date.split("/");
    const newDate = `'${dateParts[2]}-${dateParts[0]}-${dateParts[1]}'`;
    return newDate;
  }
  return date;
};

////////////////////////////////////////////////////////////////

module.exports = checkDate;

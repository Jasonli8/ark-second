const validateDate = require("validate-date")

const checkDate = (date) => {
    let dateIsValid = validateDate(date, (responseType = "boolean"));
    if (!dateIsValid) {
      return next(new HttpError("Invalid date was entered", 400));
    }
    const format = date.includes("-") ? "yyyy-mm-dd" : "mm/dd/yyyy"
    console.log(date) // console.log
    let check = validateDate(
      date,
      responseType = "boolean",
      dateFormat = format
    );
    console.log(check) // console.log
    if (!check) {
      return next(new HttpError("Invalid date format was entered", 422));
    } else if (date.includes("/")) {
      const dateParts = date.split("/");
      const newDate = `'${dateParts[2]}-${dateParts[0]}-${dateParts[1]}'`;
      return newDate;
    }
    return date;
  };

  checkDate("06/23/2021");
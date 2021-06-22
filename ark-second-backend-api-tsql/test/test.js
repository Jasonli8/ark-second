const bcrypt = require("bcryptjs");

const test = async () => {
  try {
    const isValidPass = await bcrypt.compare('arksecond123', '$2a$12$/cteIffqVjDvhMDhDd8.4OeYbP.NCINs1fUCF7URC2KppkpmMhdeq');
    console.log(isValidPass);
  } catch (err) {
    console.log(err.message);
  }
};

test();
const Account = require("../models/Account");

const isAuthenticated = async (req, res, next) => {
  try {

    const getAuthorization = req.headers.authorization.replace("Bearer ", "");

    if (getAuthorization) {
      const user = await Account.findOne({ token: getAuthorization });
      req.user = user;
      next();
    } else {
      req.status(402).send("Unauthorized");
    }

  } catch (error) {
    res.status(402).send("No authorization had been requested");
  }
  
};

module.exports = isAuthenticated;

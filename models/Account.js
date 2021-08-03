const mongoose = require("mongoose");

const Account = mongoose.model("Account", {
  email: {
    required: true,
    unique: true,
    type: String,
  },

  account: {
    username: {
      required: true,
      type: String,
    },
    phone: String,
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = Account;

const mongoose = require("mongoose");

const Payment = mongoose.model("Payment", {
  purchase_id: String,
  purchase_description: String,
  purchase_amount: Number,
});

module.exports = Payment;

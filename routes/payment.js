const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Payment = require("../models/Payment");

router.post("/payment", async (req, res) => {
  try {
    const stripeToken = req.fields.stripe_token;

    const response = await stripe.charges.create({
      amount: req.fields.product_price * 100,
      currency: "eur",
      description: req.fields.product_description,
      source: stripeToken,
    });
    console.log(response.status);

    const newPayment = await new Payment({
      purchase_id: stripeToken,
      purchase_description: stripe.charges.amount,
      amount: stripe.charges.amount,
    });

    await newPayment.save();

    res.status(200).json(newPayment);
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.response);
  }
});

module.exports = router;

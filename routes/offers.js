const express = require("express");
const { Query } = require("mongoose");
const { title } = require("process");
const { countDocuments } = require("../models/Offer");
const Offer = require("../models/Offer");
const router = express.Router();



router.get("/offers", async (req, res) => {
  try {
    const filters = {};
    const totalFound = (value) => {
      const countValue = Object.keys(value);
      const total = countValue.length;
      return total;
    };

    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }

    if (req.query.priceMin) {
      filters.product_price = { $gte: req.query.priceMin };
    }
    if (req.query.priceMax) {
      if (filters.product_price) {
        filters.product_price.$lte = req.query.priceMax;
      } else {
        filters.product_price = { $lte: req.query.priceMax };
      }
    }

    const sort = {};

    if (req.query.sort) {
      if (req.query.sort === "price-desc") {
        sort.product_price = -1;
      } else if (req.query.sort === "price-asc") {
        sort.product_price = 1;
      }
    }

    let page = Number(req.query.page);
    if (req.query.page < 1) {
      page = 1;
    }

    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    const offers = await Offer.find(filters)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select("product_name product_price");

    if (totalFound(offers) < 1) {
      res.json({ message: "No more offers" });
    } else {
      res.status(200).json({
        count: totalFound(offers),
        offers: offers,
      });
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/offer/:_id", async (req, res) => {

  try {
    console.log(req.params);
    const offer = await Offer.findOne(req.params).populate("owner");
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).send(error.message);
  }

});



module.exports = router;

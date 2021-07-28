const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;


const token = uid2(16);
const salt = uid2(16);

const Account = require("../models/Account");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middlewares/isAuthenticated");


router.post("/user/signup", async (req, res) => {
  try {

    const verification = await Account.findOne({ email: req.fields.email });
    console.log(verification);
    if (verification === null) {
      const newUser = await new Account({
        email: req.fields.email,
        account: req.fields.account,
        token: token,
        hash: SHA256(req.fields.password + salt).toString(encBase64),
        salt: salt,
      });

      await newUser.save();
      const infosToDisplay = {
        id: newUser.id,
        token: newUser.token,
        account: newUser.account,
      };
      res.status(200).json({ "New Account created ": infosToDisplay });
      console.log("Account created");
      console.log(newUser);
    } else res.status(400).send("This email already has an account");
    console.log("This email already has an account linked to");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    if (req.fields.email && req.fields.password) {
      const user = await Account.findOne({ email: req.fields.email });

      if (
        user.hash ===
        SHA256(req.fields.password + user.salt).toString(encBase64)
      ) {
        const infosToDisplay = {
          id: user.id,
          token: user.token,
          account: user.account,
        };
        res.status(200).json({ "User connected": infosToDisplay });
        console.log("User Connected");
        console.log(infosToDisplay);
      } else res.status(400).send("Email or password is invalid");
    } else res.status(400).send("All the fields are required");
  } catch (error) {
    res.status(400).send("Invalid request");
  }
});

router.get("/user/search", async (req, res) => {

  try {
    const findUser = await Account.findOne({ email: req.query.email })
    console.log(findUser)

    if (findUser) {

      res.status(200).json({"User found": findUser}) 

    } else res.status(400).send("No user found")

    
  } catch (error) {
      res.status(400).send(error.message)
  }

})


router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const newOffer = await new Offer({
      product_name: req.fields.product_name,
      product_description: req.fields.product_description,
      product_price: req.fields.product_price,
      product_details: [
        { ETAT: req.fields.ETAT },
        { EMPLACEMENT: req.fields.EMPLACEMENT },
        { MARQUE: req.fields.MARQUE },
        { TAILLE: req.fields.TAILLE },
        { COULEUR: req.fields.COULEUR },
      ],
      owner: req.user._id,
    });
    let pictureToUpload = req.files.product_image.path;
    const result = await cloudinary.uploader.upload(pictureToUpload, {
      folder: `/vinted-app/offers/${newOffer.id}`,
    });
    newOffer.product_image = result;
    await newOffer.save();
    await res.status(200).json(newOffer);
    console.log("Your announce had been published");
    console.log(newOffer)
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;

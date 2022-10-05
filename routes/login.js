const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const { User } = require("../models/user");
const genAuthToken = require("../utils/genAuthToken");
const { route } = require("./register");

// const Token = require("../models/token");
// const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  try {
    const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid Email or Password...");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Invalid Email or Password...");
    

  // if(!user.verified){
  //   let token = await Token.findOne({userId: user._id});
  //   if(!token){
  //     token = await new Token({
  //       userId: user._id,
  //       token: crypto.randomBytes(32).toString("hex")
  //     }).save();
  //   }
  //   return res.status(400).send("An Email Sent to your account")
  // }

  const token = genAuthToken(user);
  res.send(token);
 
   
  } catch (error) {
    console.log("login-error")
  }
});

module.exports = router;

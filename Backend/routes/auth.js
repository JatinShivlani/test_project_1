const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const fetchUser = require("../middleware/fetchuser");
const secretKey = process.env.SECRET_KEY;

//***************************************************//
// ROUTE 1 :::::: for creating a new user with a unique email address :- createuser
router.post(
  "/createuser",
  // using express validator as a middleware to validate data with some conditions
  [
    body("name", "Please enter a valid name").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Invalid Password :- min 5 characters required").isLength({
      min: 5,
    }),
  ],
  // using async await syntax for running mongoose operations
  async (req, res) => {
    let success = false;
    // validating inputs and showing error if occured
    const result = validationResult(req);
    if (!result.isEmpty()) {
      success = false
      return res.status(400).json({ success, errors: result.array() });
    }
    // connecting to mongoDB database server and adding new user
    try {
      const { name, email, password } = req.body;
      //   for encypting password and generating salt
      const salt = await bcrypt.genSalt(10);
      const secretPass = await bcrypt.hash(password, salt);
      // entering the hash value of password into database
      const user = new User({
        name: name,
        email: email,
        password: secretPass,
      });
      //   saving user data

      await user
        .save()
        .then((value) => {
          success = true
          //   res.json(value);
          // creating auth token
          const userId = value.id;
          const authToken = jwt.sign(userId, secretKey);
          res.json({ success, authToken });
        })
        // cathcing any error while saving if any
        .catch((err) => {
          success = false
          res.json({ success, Error: err.message });
        });
    } catch (error) {
      success = false

      // catching error
      res.status(500).json({ success, Error: "Internal server error" });
    }
  }
);
//***************************************************//
// ROUTE 2 :::::: for authentication of user :- login
router.post(
  "/login",
  // using express validator as a middleware to validate data with some conditions
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  // using async await syntax for running mongoose operations
  async (req, res) => {
    let success = false
    // validating inputs and showing error if occured
    const result = validationResult(req);
    if (!result.isEmpty()) {
      success = false
      return res.status(400).json({ success, errors: result.array() });
    }
    const { email, password } = req.body;
    try {
      await User.findOne({ email }).then(async (value) => {
        if (!value) {
          return res
            .status(400)
            .json({ success, Error: "please try to login with correct credentials,1" });
        }
        const passwordDcrypt = await bcrypt.compare(password, value.password);

        if (!passwordDcrypt) {
          return res
            .status(400)
            .json({ success, Error: "please try to login with correct credentials 2" });
        } else {
          success = true;
          const userId = value.id;
          const authToken = jwt.sign(userId, secretKey);
          res.json({ success, authToken });
        }
      });
    } catch (error) {
      success = false
      // catching error
      res.status(500).json({ success, Error: "Internal server error" });
    }
  }
);
//***************************************************//
// ROUTE 3 :::::: Get user details :- getuser
router.post(
  "/getuser",
  fetchUser,
  // using async await syntax for running mongoose operations
  async (req, res) => {
    console.log(req.id)
    let success = false
    try {
      const id = req.id;
      await User.findOne({ _id: id })
        .select("-password")
        .then((value) => {
          success = true
          res.status(200).json({value})
        });
    } catch (error) {
      res.status(500).json({ success, Error: "Internal server error" });
    }
  }
);
module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation");

// @route    GET  /api/auth/test
// @desc     Test the auth route
// @access   Public
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

// @route    GET  /api/auth/register
// @desc     Create a new user
// @access   Public
router.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

    // console.log(isValid);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // check for existing user, 유저가 있는지 여부 확인, 정규 표현식을 사용해서 검색합니다.
    const existingEmail = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });

    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "there is already a user with this email" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // create a new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    //save the user to the database
    const savedUser = await newUser.save();

    //return the new user
    return res.json(savedUser);
  } catch (err) {
    //error here
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

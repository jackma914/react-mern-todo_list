const express = require("express");
const router = express.Router();
const User = require("../models/User");

//비밀번호 암호화
const bcrypt = require("bcryptjs");

// @route   GET / api/auth/test
// @desc    Test the auth route
// @access  Public
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

// @route   POST / api/auth/register
// @desc    Create a new user
// @access  Public
router.post("/register", async (req, res) => {
  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  try {
    // new user 생성
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    // 유저 정보 database에 저장
    const savedUser = await newUser.save();

    //return 새로운 유저
    return res.json(savedUser);
  } catch (err) {
    //에러 메시지
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

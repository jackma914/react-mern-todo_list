const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permission");
require("dotenv").config();

// @route    GET  /api/auth/test
// @desc     Test the auth route
// @access   Public
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

// @route    POST  /api/auth/register
// @desc     Create a new user
// @access   Public
router.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

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

    //---------------------------------------------------------------------------------------------------------

    //_doc속성은 각 문서 객체의 정보를 담고 있습니다.
    const userToReturn = { ...savedUser._doc };

    //Http Method메소드에는 get,post,put,delete가 있습니다. delete는 서버의 데이터를 삭제합니다.
    delete userToReturn.password;
    //return the new user
    return res.json(userToReturn);
  } catch (err) {
    //error here
    console.log(err);
    res.status(500).send(err.message);
  }
});

// @route    GET  /api/auth/login
// @desc     Login user and return a access token
// @access   Public

router.post("/login", async (req, res) => {
  try {
    //check for the user
    // 가입된 메일이 로그인 메일과 같은지를 검사합니다.
    const user = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }

    // 가입된 비밀번호가 로그인 비밀번호와 같은지 검사합니다.
    //  compare 암호화된 비밀번호를 비교하는 메소드입니다
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(400).json({
        error: "There was a problem with your login credentials",
      });
    }

    //모든 MongoDB의 컬렉션은 기본적으로 _id 필드에 인덱스가 존재합니다.
    //jwt.sign()은 토큰을 생성하는 메소드입니다.
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //HttpOnly 쿠키 속성은 자바스크립트를 통해 쿠키 값에 접근하는 것을 막습니다.
    //Secure 쿠키는 HTTPS 프로토콜 상에서 암호화된(encrypted ) 요청일 경우에만 전송됩니다.
    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const userToReturn = { ...user._doc };
    delete userToReturn.password;
    return res.json({
      token: token,
      user: userToReturn,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route    GET  /api/auth/current
// @desc     Return the currently authed user
// @access   Public

router.get("/current", requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }
  return res.json(req.user);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permission");
const validateRegisterInput = require("../validation/registerValidation");

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
  try {
    // 유효성 검사 모듈을 가져와서 받아온 데이터를 전달합니다.
    const { errors, isVlid } = validateRegisterInput(req.body);
    console.log(`유효성 : ${isVlid} `);

    if (!isVlid) {
      return res.status(400).json(errors);
    }

    // 유저 중복 확인
    // 아래 두가지 중복확인 변수가 있습니다. 첫번째 변수를 사용하면 로그인할때 첫글자를 대문자로하면 중복이 아닌걸로 됩니다. 이를 방지하기위해
    // 정규 표현실을 사용하여 같은 스펠링이라면 첫글자가 대문자인걸 무시하도록 구현했습니다.
    // const existingEmail = await User.findOne({ email: req.body.email });
    const existingEmail = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });

    if (existingEmail) {
      return res
        .status(400)
        .json({ err: "There is already a user with this email" });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    // new user 생성
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    // 유저 정보 database에 저장
    const savedUser = await newUser.save();

    // 토큰 생성
    // 회원가입시 즉시 로그인이 되는 기능입니다.
    const payload = { userId: savedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // 데이터 베이스에 저장된 비밀번호를 return res 하기전에 비밀번호를 삭제후 return 합니다. 이유는 단순 보안이슈입니다.
    const userToReturn = { ...savedUser._doc };
    delete userToReturn.password;

    //return 새로운 유저
    return res.json(userToReturn);
  } catch (err) {
    //에러 메시지
    console.log(err);
    res.status(500).send(err.message);
  }
});

// @route   POST / api/auth/login
// @desc    Login user and return a access token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    // 유저 확인
    const user = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }

    // bcrypt의 compare메서드를 이용한 비밀번호 비교확인
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }

    // 토큰 생성
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    const userToReturn = { ...user._doc };

    delete userToReturn.password;

    console.log(`토큰 생성 완료`);
    return res.json({
      token: token,
      user: userToReturn,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route   GET / api/auth/current
// @desc    Return the currently authed user
// @access  Private
router.get("/current", requiresAuth, (req, res) => {
  console.log(req.user);
  if (!req.user) {
    return res.status(401).send("권한이 없습니다.");
  }
  return res.json(req.user);
});

// @route   PUT / api/auth/logout
// @desc    Logout user a clear the cookie
// @access  Private
router.put("/logout", requiresAuth, async (req, res) => {
  try {
    res.clearCookie("access-token");
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;

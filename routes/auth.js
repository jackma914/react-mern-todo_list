const express = require("express");
const router = express.Router();
const User = require("../models/User");

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

    //return 새로운 유저
    return res.json(savedUser);
  } catch (err) {
    //에러 메시지
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

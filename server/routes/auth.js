const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const validateRegisterInput = require("../validation/registerValidation");

//@route  GET /api/auth/test
//@설명   route 테스트
//@access Public
router.get("/test", (req, res) => {
  res.send("route 작동");
});

//@route  POST /api/auth/register
//@설명   새로운 유저 생성
//@access Public
router.post("/register", async (req, res) => {
  try {
    // 받아오는 데이터를 validation 모듈에 넣어줍니다.
    const { errors, isValid } = validateRegisterInput(req.body);
    //isValid가 false이면 무언가가 양식에 어긋나서 error를 반환했다는 의미입니다. errors를 return 해줍니다.
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // 기존 사용자 확인
    const existingEmail = await User.findOne({
      //RegExp 정규표현식을 이용해 이미 만들어진 이메일과 대소문자도 같아야 하는 조건을 만듭니다.
      email: new RegExp("^" + req.body.email + "$", "i"),
    });

    if (existingEmail) {
      return res
        .status(400)
        .json({ err: "이 이메일을 가진 사용자가 이미 있습니다" });
    }

    //비밀번호 hash
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // 새로운 유저 생성
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    // 데이터 베이스에 저장 await 비동기를 이용하여 저장이 완료되면 다음 작업을 합니다.
    const savedUser = await newUser.save();

    //return 새로운 유저
    return res.json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

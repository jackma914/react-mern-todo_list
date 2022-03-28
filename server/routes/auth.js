const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permisstion");

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
    console.log(req.body);
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

    // 회원가입과 동시에 토큰을 생성합니다.
    //jwt 토큰 생성
    const payload = { userId: savedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // jwt토큰 cookie에 저장
    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    //_doc 속성은 각 문서의 객체 정보를 담고 있어 그 안에 있는 password 속성 값을 확인할 수 있습니다.
    //delete 연산자는 객체의 속성을 제거합니다.
    const userToReturn = { ...savedUser._doc };
    delete userToReturn.password;

    //return 새로운 유저
    return res.json(userToReturn);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

//@route  POST /api/auth/login
//@설명   사용자 로그인 및 액세스 토큰 반환
//@access Public
router.post("/login", async (req, res) => {
  try {
    // 사용자 이메일 확인합니다.
    const user = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });
    if (!user) {
      return res.status(400).json({ error: "아이디를 확인해 주세요." });
    }

    // 비밀번호를 확인합니다.
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: "비밀번호를 확인해 주세요." });
    }
    //jwt 토큰 생성
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // jwt토큰 cookie에 저장
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

//@route  GET /api/auth/current
//@설명   현재 인증된 사용자를 반환
//@access Private
router.get("/current", requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("권한이 없습니다.");
  }

  return res.json(req.user);
});

//@route  GET /api/auth/logout
//@설명   로그아웃과 사용자 쿠키 지우기
//@access Private
router.put("/logout", requiresAuth, async (req, res) => {
  try {
    res.clearCookie("access-token");

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

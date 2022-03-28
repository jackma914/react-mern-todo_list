const User = require("../models/User");
const jwt = require("jsonwebtoken");

const requiresAuth = async (req, res, next) => {
  // 쿠키 조회
  const token = req.cookies["access-token"];

  // 권한이 있는지 없는지를 확인하는 불리언 변수입니다.
  let isAuthed = false;

  if (token) {
    try {
      //jwt.verify()함수를 이용하여 토큰 유효성을 확인합니다. token 속에는 userId가 들어있습니다.
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);

      try {
        // id로만 검색하기 때문에 findOne 대신 findById를 사용합니다.
        const user = await User.findById(userId);

        if (user) {
          const userToReturn = { ...user._doc };
          delete userToReturn.password;

          //userId로 데이터 베이스에서 찾았다면 req.user에 데이터를 답아줍니다.
          req.user = userToReturn;
          isAuthed = true;
        }
      } catch {
        isAuthed = false;
      }
    } catch {
      isAuthed = false;
    }
  }

  // next 함수를 이용해서 다음 미들웨어로 현재 요청을 넘깁니다.
  if (isAuthed) {
    return next();
  } else {
    return res.status(400).send("권한이 없습니다.");
  }
};

module.exports = requiresAuth;

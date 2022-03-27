const User = require("../models/User");
const jwt = require("jsonwebtoken");

const requiresAuth = async (req, res, next) => {
  const token = req.cookies["access-token"];
  let isAuthed = false;

  if (token) {
    // do logic here
    try {
      //jwt.verify()함수를 이용하여 토큰 유효성을 확인할 수 있다.
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      try {
        const user = await User.findById(userId);
        if (user) {
          const userToReturn = { ...user._doc };
          delete userToReturn.password;
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
  if (isAuthed) {
    return next();
  } else {
    return res.status(401).send("허가되지 않았습니다.");
  }
};

module.exports = requiresAuth;

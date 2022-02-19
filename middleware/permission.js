const User = require("../models/User");
const jwt = require("jsonwebtoken");

const requiresAuth = async (req, res, next) => {
  const token = req.cookies["access-token"];
  let isAuthed = false;

  if (token) {
    try {
      //verify 메서드를 이용해 토큰 인증을 합니다.
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);

      //   console.log(userId);
      try {
        const user = await User.findById(userId);
        if (user) {
          const userToReturn = {
            ...user._doc,
          };
          delete userToReturn.password;

          //req.user로 password가 지워진 user값을 보냅니다.
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
    return res.status(401).send("권한이 없습니다.");
  }
};

module.exports = requiresAuth;

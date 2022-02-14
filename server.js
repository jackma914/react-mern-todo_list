//보안이 담긴 값들을 담은 .env파일을 프로젝트 상단에 아래 코드를 적어 환경 변수를 불러옵니다.
require("dotenv").config();

//import routes
const authRoute = require("./routes/auth");
const toDosRoute = require("./routes/todos");

//mongoose
const mongoose = require("mongoose");

//express
const express = require("express");
const app = express();

//cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//요청의 본문을 해석해주는 미들웨어이다
//body-parser의 일부 기능이 익스프레스에 내장되었기 때문이다.
app.use(express.json());

//bodyParser 미들웨어의 여러 옵션 중에 하나로 false 값일 시 node.js에 기본으로 내장된 queryString, true 값일 시 따로 설치가 필요한 npm qs 라이브러리를 사용합니다.
app.use(express.urlencoded());

//본문
app.get("/api", (req, res) => {
  res.send("fullstack react course express server");
});

// 라우트해줍니다.
app.use("/api/auth", authRoute);
app.use("/api/todos", toDosRoute);

//mongoose와 연결한뒤에 서버를 시작합니다.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to datebase");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

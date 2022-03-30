require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

// routes 임포트
const authRoute = require("./routes/auth");
const toDosRoute = require("./routes/todos");

//express.json()을 이용해 json 요청을 구현합니다.
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("서버 테스트입니다");
});

app.post("/name", (req, res) => {
  if (req.body.name) {
    return res.json({ name: req.body.name });
  } else {
    return res.status(400).json({ error: " 이름이 제공되지 않았습니다. " });
  }
});

app.use("/api/auth", authRoute);
app.use("/api/todos", toDosRoute);

// app.use(express.static(path.resolve(__dirname, "./client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("데이터 베이스와 연결되었습니다.");
    app.listen(process.env.PORT, () => {
      console.log(`${process.env.PORT} 서버가 실행 되었습니다. `);
    });
  })
  .catch((err) => {
    console.log(err);
  });

require("dotenv").config();

const mongoose = require("mongoose");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Fullstack React Course Express server");
});

app.post("/name", (req, res) => {
  console.log(req.body.name);
  if (req.body.name) {
    return res.json({ name: req.body.name });
  } else {
    return res.status(400).json({ error: "No name provided" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// server.js 

// .env 속의 환경설정을 사용하기 위해 dotenv를 임폴트 합니다.
require("dotenv").config();

// mongoDB와 서버를 연결하기위해 mongoose 라이브러리를 사용합니다.
const mongoose = require("mongoose");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Fullstack React Course Express server");
});
app.post("/name", (req, res) => {
  console.log(req.body.name);
  if (req.body.name) {
    return res.json({ name: req.body.name });
  } else {
    return res.status(400).json({ error: "No name provided" });
  }
});

// mongoose를 사용해서 서버와 데이터베이스를 연결합니다.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });





// .env

PORT = 5000
MONGO_URI=mongodb+srv://joon:K8c1KDVqj6jreB77@cluster0.h6nym.mongodb.net/main?retryWrites=true&w=majority


//MONGO_URI 에서 "K8c1KDVqj6jreB77" 부분은 mongoDB의 시크릿 번호입니다. "main"부분은 일종의 자리 표시자 입니다. Main으로 적어두었습니다. 그냥 사용해도 좋습니다.  <password> 부분은 시크릿번호로 입력해주어야합니다.


require("dotenv").config();

// cookie parser
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");

// import route
const authRoute = require("./routes/auth");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.send("Fullstack React Course Express server");
});

app.use("/api/auth", authRoute);

// mongoose 서버와 연결
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

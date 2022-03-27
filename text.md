1. 필요한 라이브러리를 인스톨합니다. express, dotenv, nodemon concurrently
   - express는 서버를 이용하기 위함입니다
   - dotenv는 .env 파일을 생성하여 비밀 키, 등등 숨겨야할 데이터를 넣습니다.
   - nodemon, concurrently는 서버와 클라이언트를 동시에 시작할수있고 서버를 자동으로 restart 해주는 모듈입니다.
     nodemon 설정은 따로 적지 않겠습니다.
2. 서버를 열고 postman을 이용해 테스트합니다.

   ```js
   app.get("/", (req, res) => {
     res.send("서버 테스트입니다.");
   });

   app.post("/name", (req, res) => {
     if (req.body.name) {
       return res.json({ name: req.body.name });
     } else {
       return res.status(400).json({ error: " 이름이 제공되지 않았습니다. " });
     }
   });

   app.listen(process.env.PORT, () => {
     console.log(`${process.env.PORT} 서버가 실행 되었습니다. `);
   });
   ```

3. mongoDB의 데이터베이스를 만들고 server와 연결하겠습니다.

   - 데이터 베이스 생성과정은 따로 적지 않겠습니다.
     mongoDB에서 connect에 필요한 연결 코드를 가져와 .env에 넣어줍니다.

     ```js
     // 몽고에서 데이터 베이스를 생성할떄 사용했던 비밀번호를 사용합니다.
      PORT=5000
      MONGO_URL=mongodb+srv://joon:O3yih8Elc7y2S0Ls@cluster0.xbdfa.mongodb.net/main?retryWrites=true&w=majority
     ```

   - mongoose를 인스톨한뒤 mongoose를 이용해 서버와 연결하겠습니다.

     ```js
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
     ```

4. User 스키마를 생성하고 서버 route를 구현합니다.

   - 스키마의 생성방법은 적지 않겠습니다.
   - route를 구현합니다. routes 폴더를 만들고 auth.js 를 생성합니다. 그리고 server.js에서 경로를 지정해줍니다.
     /api/auth 경로로 데이터가 오면 /test로 이동합니다.
     postman을 이용해 `http://localhost:5000/api/auth/test` 경로로 들어가면 "route 작동" 이라는 메시지를 볼수 있습니다.

   ```js
   const express = requre("express");
   const router = express.Router();

   router.get("/test", (req, res) => {
     res.send("route 작동");
   });
   // 모듈을 내보냅니다.
   module.exports = router;
   ```

   ```js
   // 모듈을 받아오면 두번째 인자로 연결해줍니다.
   app.use("/api/auth", authRoute);
   ```

5. 사용자 회원가입

   - /register 주소로 새로운 User를 생성하고 데이터 베이스에 저장합니다.

   ```js
   //@route  POST /api/auth/register
   //@설명   새로운 유저 생성
   //@access Public
   router.post("/register", async (req, res) => {
     try {
       // 새로운 유저 생성
       const newUser = new User({
         email: req.body.email,
         password: req.body.password,
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
   ```

   - 다음은 위에서 구현한 회원가입에서 보안을 위해 비밀번호를 hash로 만들겠습니다 bcryptjs 라이브러리를 이용하였습니다.

     ```js
      const bcrypt = require("bcryptjs");

      ...
        // 받아온 비밀번호를 hash 비밀번호로 바꾸어 새로운 유저를 생성합니다.
       const hashedPassword = await bcrypt.hash(req.body.password, 12);

       // 새로운 유저 생성
       const newUser = new User({
       email: req.body.email,
       password: hashedPassword,
       name: req.body.name,
     });
     ```

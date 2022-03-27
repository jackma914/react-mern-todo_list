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

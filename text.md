1. 필요한 라이브러리를 인스톨합니다. express, dotenv, nodemon concurrently
   - express는 서버를 이용하기 위함입니다
   - dotenv는 .env 파일을 생성하여 비밀 키, 등등 숨겨야할 데이터를 넣습니다.
   - nodemon, concurrently는 서버와 클라이언트를 동시에 시작할수있고 서버를 자동으로 restart 해주는 모듈입니다.
2. 서버를 열고 postman을 이용해 테스트합니다.

   ```js
   app.get("/", (req, res) => {
     res.send("서버 테스트입니다.");
   });

   app.listen(process.env.PORT, () => {
     console.log(`${process.env.PORT} 서버가 실행 되었습니다. `);
   });
   ```

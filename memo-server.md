1.  필요한 라이브러리를 인스톨합니다. express, dotenv, nodemon concurrently
    - express는 서버를 이용하기 위함입니다
    - dotenv는 .env 파일을 생성하여 비밀 키, 등등 숨겨야할 데이터를 넣습니다.
    - nodemon, concurrently는 서버와 클라이언트를 동시에 시작할수있고 서버를 자동으로 restart 해주는 모듈입니다.
      nodemon 설정은 따로 적지 않겠습니다.
2.  서버를 열고 postman을 이용해 테스트합니다.

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

3.  mongoDB의 데이터베이스를 만들고 server와 연결하겠습니다.

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

4.  User 스키마를 생성하고 서버 route를 구현합니다.

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

5.  사용자 회원가입

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

6.  사용자 유효성 검사를 구현합니다.

    - 먼저 회원가입 email 중복 검사를 구현합니다. mongoose의 findOne은 하나의 문서를 찾는 역할을 합니다 아래 코드는 문제가 있습니다. 데이터 베이스에 있는 이메일을 postman 으로 다시 회원가입하면 에러를 잘 반환합니다. 하지만 한글자를 대문자로 하면 회원가입이 가능합니다.

      ```js
      router.post("/register", async (req, res) => {
      try {
      // 기존 사용자 확인
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
      return res
      .status(400)
      .json({ err: "이 이메일을 가진 사용자가 이미 있습니다" });
      }

      ...
      ```

      이를 해겨랗기 위해 `new RegExp` 정규표현식을 이용해 패턴을 만듭니다.

      ```js
            email: new RegExp("^" + req.body.email + "$", "i"),

      ```

    - 기존 사용자가 있는지를 구현했다면 이번에는 회원가입 form에서의 이메일, 비밀번호, 비밀번호 확인 필드에서의 유효성을 구현합니다. validation 폴더를 만든뒤 isEmpty.js 파일과 registerValidation.js 파일을 만들었습니다. isEmpty 모듈은 필드가 비어있는지를 검사합는 모듈이고 registerValidation은 회원가입 양식입니다.

      ```js
      // isEmpty 모듈은 데이터가 비어있는지를 검사합니다.

      const isEmpty = (value) =>
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0);

      module.exports = isEmpty;
      ```

      ```js
      const Validator = require("validator");
      const isEmpty = require("./isEmpty");

      const validateRegisterInput = (data) => {
        let errors = {};

        // 이메일 필드 검사
        if (isEmpty(data.email)) {
          errors.email = "이메일은 비워둘수 없습니다.";

          //Validator의 isEmail 메서드를 이용해 email 양식을 검사합니다.
        } else if (!Validator.isEmail(data.email)) {
          errors.email =
            "이메일 양식이 잘못 되었습니다. 유요한 이메일 양식을 입력하세요.";
        }

        // 비밀번호 필드 검사
        if (isEmpty(data.password)) {
          errors.password = "비밀번호는 비워둘수 없습니다.";

          //Validator의 isLength 메서드를 이용해 password의 옵션인 6~150자 사이 인지를 검사합니다.
        } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
          errors.password = "비밀번호는 6~150자 사이어야 합니다. ";
        }

        //비밀번호 확인 필드 검사
        if (isEmpty(data.confirmPassword)) {
          errors.confirmPassword = "비밀번호 확인 필드는 비워둘수 없습니다.";

          //Validator의 equals 메서드를 이용해 password와 비교합니다.
        } else if (!Validator.equals(data.password, data.confirmPassword)) {
          errors.confirmPassword = "비밀번호와 일치하지 않습니다. ";
        }

        return {
          errors,

          // isValid는 errors 배열이 비어있는지를 확인합니다. 객체가 비어있다면 true를 반환합니다. 오류가 있으면 false를 반환합니다.
          isValid: isEmpty(errors),
        };
      };
      module.exports = validateRegisterInput;
      ```

7.  유저 인증 구현, 로그인 시 쿠키 형태의 토큰을 제공합니다. private routes를 보호하기 위해 미들웨어 생성합니다. 현제 사용자를 반환합니다.

    - 비밀번호가 hash 처리되어 데이터 베이스에 저장되고 return 됩니다. postman으로 회원가입을 하면 return 데이터를 볼수있습니다. hash 처리가 되었다고 해도 이것은 안전하지 않습니다. 그렇기 때문에 데이터 베이스에 회원가입 정보가 저장되고 비밀번호는 제외 한뒤에 return 하는 방법으로 수정하겠습니다.
      `_doc` 속성은 각 문서의 객체 정보를 담고 있어 그 안에 있는 password 속성 값을 확인할 수 있습니다. 그리고 `delete`을 이용해 객체의 속성을 제거합니다.

      ```js
        // auth.js
        ...

        // 데이터 베이스에 저장 await 비동기를 이용하여 저장이 완료되면 다음 작업을 합니다.
        const savedUser = await newUser.save();

        //_doc 속성은 각 문서의 객체 정보를 담고 있어 그 안에 있는 password 속성 값을 확인할 수 있습니다.
        //delete 연산자는 객체의 속성을 제거합니다.
        const userToReturn = { ...savedUser._doc };
        delete userToReturn.password;

        //return 새로운 유저
        return res.json(userToReturn);
      } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
      }
      ```

    - 사용자 로그인을 합니다. 로그인이 되면 토큰을 제공합니다. 먼저 이메일과 비밀번호를 확인합니다.

      ```js
            //@route  POST /api/auth/login
      //@설명   사용자 로그인 및 액세스 토큰 반환
      //@access Public
      router.post("/login", async (req, res) => {
        try {
          // 사용자 이메일 확인합니다.
          // 데이터 베이스에 로그인된 이메일과 같은 이메일이 있는지를 확인합니다.
          const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
          });
          if (!user) {
            return res.status(400).json({ error: "아이디를 확인해 주세요." });
          }

          // 비밀번호를 확인합니다.
             // 데이터 베이스에 로그인된 비밀번호와 같은 비밀번호가 있는지를 확인합니다.
          const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!passwordMatch) {
            return res.status(400).json({ error: "비밀번호를 확인해 주세요." });
          }

          return res.json({ passwordMatch: passwordMatch });
      ```

    - 다음은 jwt를 생성하여 cookie에 저장을 시켜 유저확인을 할때 마다 쿠키에있는 jwt 값을 가지고 권한을 계속 인증을 구현합니다.

      ```js
      router.post("/login", async (req, res) => {
        try {
          // 사용자 이메일 확인합니다.
          const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
          });
          if (!user) {
            return res.status(400).json({ error: "아이디를 확인해 주세요." });
          }

          // 비밀번호를 확인합니다.
          const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!passwordMatch) {
            return res.status(400).json({ error: "비밀번호를 확인해 주세요." });
          }

          //jwt 토큰 생성
          //payload의 값은 user의 id 입니다. 이유는 payload는 암호화 되지 않기 때문에 개인정보를 사용하지 않습니다.
          const payload = { userId: user._id };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          // jwt토큰 cookie에 저장
          res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          const userToReturn = { ...user._doc };
          delete userToReturn.password;

          return res.json({
            token: token,
            user: userToReturn,
          });
        } catch (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
      });
      ```

    - middleware를 만들어서 권한을 부여합니다.
      `req.cookies["access-token"]`를 이용해 쿠키를 조회합니다.
      조회한 쿠키를 jwt.verify()메서드를 이용합니다. 쿠키가 유효하다면 token 속에 넣어두었던 userId를 꺼내서 사용합니다. 꺼낸 id를 이용해 데이터베이스에 User.findById() 메서드를 이용해 현재 사용자의 데이터를 가져옵니다. 가져온 데이터는 req.user에 담아주고 next()를 이용해 다음 요청으로 넘어갑니다.

      ```js
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
                console.log(user);
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
      ```

      미들웨어를 사용하는 방법은 주소다음 인자에 모듈을 넣어주면됩니다.

      ```js
      //@route  GET /api/auth/current
      //@설명   현재 인증된 사용자를 반환
      //@access Private
      router.get("/current", requiresAuth, (req, res) => {
        if (!req.user) {
          return res.status(401).send("권한이 없습니다.");
        }

        return res.json(req.user);
      });
      ```

8.  todo CRUD 구현합니다. todo model과 todo route을 설정하고 새로운 todo를 생성해보겠습니다. todo model은 따로 설명하지 않겠습니다.

    - 새로운 todo 생성합니다. 현재 사용자를 권한을 확인한뒤 content를 추가합니다.

      ```js
      // @route   POST /apit/todos/new
      // @설명    새로운 todo 생성
      // @access  Private
      router.post("/new", requiresAuth, async (req, res) => {
        try {
          //todo 유효성 검사입니다.
          const { isValid, errors } = validateToDoInput(req.body);
          if (!isValid) {
            return res.status(400).json(errors);
          }
          // 새로운 투두 생성
          const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content,
            complete: false,
          });

          // 투두 저장
          await newToDo.save();

          return res.json(newToDo);
        } catch (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
      });
      ```

    - 현재 사용자의 todos를 확인합니다. 하나만 찾는게아닌 조건에 맞는 데이터를 다 받아와야하기 때문에 find 메서드를 사용합니다. sort를 이용해 sort 내림차순으로 구현합니다.

      ```js
      // @route   GET /apit/todos/current
      // @설명    현재 사용자의 todos
      // @access  Private
      router.get("/current", requiresAuth, async (req, res) => {
        try {
          const completeToDos = await ToDo.find({
            user: req.user._id,
            complete: true,
          }).sort({ completedAt: -1 });

          const incompleteToDos = await ToDo.find({
            user: req.user._id,
            complete: false,
          }).sort({ createdAt: -1 });

          return res.json({
            incomplete: incompleteToDos,
            complete: completeToDos,
          });
        } catch (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
      });
      ```

    - todo를 완료 표시로 업데이트 합니다. 업데이트 부분에서 많이 어려워서 햇갈렸습니다. 하나씩 차근차근 해석해보겠습니다.
      아래 코드에서 /:toDoId는 `_id` 와 일치해야합니다.
      user: req.user.\_id는 user의 \_id 이이고
      \_id: req.params.toDoId는 몽구스에서 기본적으로 생성되는 \_id입니다.

      ```js
      // @route   PUT /api/todos/:toDoId/complete
      // @설명    todo를 완료 표시
      // @access  Private
      router.put("/:toDoId/complete", requiresAuth, async (req, res) => {
        try {
          console.log(req.user);
          const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
          });

          if (!toDo) {
            return res.status(404).json({ error: "todo를 찾을 수 없습니다." });
          }

          if (toDo.complete) {
            return res
              .status(400)
              .json({ error: "todo는 이미 완료되었습니다. " });
          }

          const updatedToDo = await ToDo.findOneAndUpdate(
            {
              user: req.user._id,
              id: req.params.toDoId,
            },
            {
              complete: true,
              completedAt: new Date(),
            },
            {
              new: true,
            }
          );

          return res.json(updatedToDo);
        } catch (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
      });
      ```

    - 로그인하면 토큰이 생성됩니다. 이번에는 구현할것은 회원가입시 즉시 토큰이 로그인이되면 토큰이 발급되도록 구현하겠습니다.
      기존 login에 있던 jwt 토큰 생성 코드를 register 쪽으로 복사해서 가져갑니다. payload값으로 savedUser.\_id값으로 바꿔줍니다.

      ```js
      //@route  POST /api/auth/register
      //@설명   새로운 유저 생성
      //@access Public
      router.post("/register", async (req, res) => {
        try {
          ...

          // 데이터 베이스에 저장 await 비동기를 이용하여 저장이 완료되면 다음 작업을 합니다.
          const savedUser = await newUser.save();

          // 회원가입과 동시에 토큰을 생성합니다.
          //jwt 토큰 생성
          const payload = { userId: savedUser._id };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          // jwt토큰 cookie에 저장
          res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          ...

      });
      ```

    * 마지막으로 로그아웃을 구현합니다. 로그아웃은 clearCookie 메서드로 토큰 이름을 인자로 넣습니다.

    ```js
    //@route  GET /api/auth/logout
    //@설명   로그아웃과 사용자 쿠키 지우기
    //@access Private
    router.put("/logout", requiresAuth, async (req, res) => {
      try {
        res.clearCookie("access-token");

        return res.json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
      }
    });
    ```

======================

auth.js

1.  reigster POST async /api/auth/register

    - `validateRegisterInput(req.body)` validation 모듈을 이용한 유효성 검사
    - await `existingEmail` 기존 사용자 확인, 데이터 베이스와 req.body.email을 비교합니다.
    - await `hashedPassword` bcryptjs를 이용해 비밀번호를 hash 변환 하였습니다.
    - `newUser` 새로운 유저를 생성합니다.
    - await `savedUser` 데이터 베이스에 생성된 유저를 저장합니다.
    - `payload`, `token`,`res.cookie` 회원가입 후 바로 토큰을 생성합니다.
    - `userToReturn`유저를 생성해서 데이터 베이스에 저장하고 토큰을 생성하였습니다. 보안을 위해 새로운 유저를 반환할때 비밀번호를 지우고 반환합니다.

2.  login POST async /apt/auth/login

    - await `user` 몽구스의 findOne 메서드를 이용해 데이터 베이스에서 아이디를 찾아옵니다.
    - await `passwordMatch` bcrypt의 compare 메서드를 이용해서 받아온 비밀번로 req.body.password와 user.password를 비교합니다.
    - `payload`, `token`,`res.cookie` 회원가입 후 바로 토큰을 생성합니다.
    - `userToReturn`유저를 생성해서 데이터 베이스에 저장하고 토큰을 생성하였습니다. 보안을 위해 새로운 유저를 반환할때 비밀번호를 지우고 데이터를 반환합니다.

3.  middleware생성 permisstion.js

    - `req.cookies["토큰이름"]` 쿠키를 조회합니다.
    - `isAuthed` 권한이 있는지 없는지를 확인하는 불리언 변수입니다.
    - `const { userId } = jwt.verify(token, process.env.JWT_SECRET)` jwt.verify를 이용해 토큰 유효성을 확인,조회합니다.
      토큰 생성시 payload userId를 이용합니다.
    - await `const user = await User.findById(userId);` findById를 이용해 데이터 베이스에 userId와 같은 \_id를 가진 데이터가 있는지 찾습니다. 있다면 `isAuthed = true` 없다면 `isAuthed = false;`를 반환합니다.
    - `if(isAuthed){ return next()}`next() 메서드를 이용해 다음 작업으로 이어갑니다.

4.  current GET /api/auth/current

    - `middleware를 이용해 권한이 있는지 없는지를 반환합니다.

5.  logout GET /api/auth/logout

    - middleware를 이용해 권한이 있는지 없는지를 확인하고 `res.clearCookie("토큰 이름")` 메서드를 이용해 cookie를 지워줍니다.

======================

todos.js

1.  POST async /api/todos/new

    - `validateRegisterInput(req.body)` validation 모듈을 이용한 유효성 검사
    - `newToDo` 새로운 todo를 생성합니다. user값은 middleware에서 토큰을 조회하고 토큰에 해당하는 회원을 조회한뒤 기존 \_id를 user에 할당해줍니다. 그리고 새로운 todo가 생성되면서 `_id`를 부여받습니다.

2.  GET async /api/todos/current

    - await `completeToDos` 데이터 베이스에서 find 메서드를 이용해 조건에 맞는 데이터를 찾습니다. `complete : true `는 나중에 완료된 todo를 구현할떄 사용합니다.
    - await `incompleteToDos` 데이터 베이스에서 find 메서드를 이용해 조건에 맞는 데이터를 찾습니다. `complete : false `는 나중에 완료되지 않은 todo를 구현할떄 사용합니다.

3.  PUT async /api/todos/:toDoId/complete

    - todo 완료를 구현합니다.
    - await `findOne`메서드를 이용해 `user`, `_id` 값과 일치하는 데이터를 조회합니다. 여기서 중요한점은 주소의`/:toDoId` 와 `_id: req.params.toDoId,` req.params.toDoId는 주소의 toDoId를 말합니다.
    - await `updatedToDo` 몽구스의 findOneAndUpdate 메서드를 이용해 데이터 베이스의 데이터를 수정합니다. 첫번째 인자로는 어떤 도큐먼트를 찾을지를 정합니다. 두번째는 수정할 데이터 입니다. 마지막으로 3번째 인자는 `new: true`를 전달해야 업데이트 된 새 문서를 반환합니다.

4.  PUT async /api/todos/:toDoId/incomplete

    - 3.번화 같습니다.

5.  PUT async /api/todos/:toDoId/

    - content 내용을 업데이트 합니다.
    - await `findOne` 메서드를 이용해 원하는 todo 데이터를 찾습니다.
    - await `findOneAndUpdate` 메서드를 이용해 업데이트합니다. 3.번 참고!

6.  PUT async /api/todos/:toDoId
    - todo를 삭제합니다.
    - await `fineOne` 메서드를 이용해 원하는 todo를 찾습니다.
    - await `findOneAndRemove` 메서드를 이용해 데이터를 지웁니다.

1.  먼저 client와 server를 동시에 작동하게 해주는 concurrently를 이용해 package.json 파일에서 설정 해주도록 하겠습니다.
    ```js
    //react는 client 폴더에 있고 server는 server폴더에 있습니다.
     "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "nodemon  cd server/server.js --ignore client",
    "client": "cd client && npm start",
    "dev": "concurrently \"npm run client\" \"npm run server\""
    },
    ```
2.  proxy 설정을 해줍니다. client의 package.json 파일에 넣어주도록 합니다.

    ```js
      "proxy": "http://localhost:5000"
    ```

3.  필요없는 react의 파일들을 정리합니다.
4.  App.js에 main.scss를 임포트 합니다. main.scss에는 기본적인 스타일링과 폰트 설정, 색상 함수를 지정합니다.

    ```js
        @import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap");

        $primary: #00a796;
        $primary-dark: #026158;
        $dark: #1f2732;
        $dark-light: #2a343f;
        $white: #fff;

        body {
          font-family: "Source Sans Pro", sans-serif;
          padding: 0;
          margin: 0;
          background-color: $dark;
          color: $white;
        }

        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }

        p,
        h1,
        h2,
        h3,
        h4 {
          margin: 0;
        }

        button,
        input,
        textarea {
          font-family: "Source Sans Pro", sans-serif;
        }

    ```

5.  `react-router-dom` 라이브러리를 이용해 라우팅을 구현합니다. 컴포넌트 구조를 만들고 로그인과 회원가입을 구현합니다.

    ```js
    function Layout() {
      return (
        <BrowserRouter>
          {/* Header 컴포넌트는 고정입니다. */}
          <Header />
          <Routes>
            <Route path="/" element={<AuthBox />} />
            // /register 에는 props로 register를 전달합니다. 값을 정하지 않는다면
            "true"를 기본값으로 전달합니다.
            <Route path="/register/*" element={<AuthBox register />} />
          </Routes>
        </BrowserRouter>
      );
    }
    ```

    데이터를 받은 AuthBox에서는 삼항 조건 연산자를 이용해 회원과입과 로그인을 구현합니다.

    ````js
    function AuthBox({ register }) {
    return (
    <div className="auth">
    <div className="auth__box">
    <div className="auth__header">
    <h1>{register ? "Register" : "Login"}</h1>
    </div>

                  <form action="">
                    {register && (
                      <div className="auth__field">
                        <label>Name</label>
                        <input type="text" />
                      </div>
                    )}

                    <div className="auth__field">
                      <label>Email</label>
                      <input type="text" />
                    </div>
                    <div className="auth__field">
                      <label>Password</label>
                      <input type="password" />
                    </div>

                    {register && (
                      <div className="auth__field">
                        <label>Confirm Password</label>
                        <input type="password" />

                        {/* <p className="auth__error">something went wrong</p> */}
                      </div>
                    )}

                    <div className="auth__footer">
                      <p className="auth__error">something went wrong</p>

                      <button className="btn">
                        {register ? "Register" : "Login"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            );
          }
          ```
    ````

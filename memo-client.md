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

6.  가장 중요한 context API와 reducer 입니다. 먼저 어떻게 사용될지를 알아보겠습니다. 데이터 베이스와 연결되어있는 서버를 구축하였습니다. 이제 서버에서 사용자 데이터와 투두 데이터를 받아와서 상태관리를 해야합니다.

    - context api, reducer

      ```js
      import React, {
        createContext,
        useContext,
        useReducer,
        useEffect,
      } from "react";
      import axios from "axios";

      // initial state 초기값
      const initialState = {
        user: null,
        fetchingUser: true,
        completeToDos: [],
        incompleteToDos: [],
      };

      //context 생성
      export const GlobalContext = createContext(initialState);

      // reducer
      const globalReducer = (state, action) => {
        switch (action.type) {
          case "SET_USER":
            return {
              ...state,
              user: action.payload,
              fetchingUser: false,
            };
          case "SET_COMPLETE_TODOS":
            return {
              ...state,
              completeToDos: action.payload,
            };
          case "SET_INCOMPLETE_TODOS":
            return {
              ...state,
              incompleteToDos: action.payload,
            };

          case "RESTE_USER":
            return {
              ...state,
              user: null,
              completeToDos: [],
              incompleteToDos: [],
              fetchingUser: false,
            };
          default:
            return state;
        }
      };

      //provider 컴포넌트
      export const GlobarProvider = (props) => {
        //useReducer
        const [state, dispatch] = useReducer(globalReducer, initialState);

        useEffect(() => {
          getCurrentUser();
        }, []);

        //axios를 통해 서버와 통신합니다.
        const getCurrentUser = async () => {
          try {
            //로그인된 사용자가 있는지를 확인합니다.
            const res = await axios.get("/api/auth/current");

            if (res.data) {
              //있다면 todos를 받아옵니다.
              const toDosRes = await axios.get("/api/todos/current");

              if (toDosRes.data) {
                //받아온 사용자와 todos를 dispatch를 통해 데이터를 보내줍니다.
                dispatch({ type: "SET_USER", payload: res.data });
                dispatch({
                  type: "SET_COMPLETE_TODOS",
                  payload: toDosRes.data.complete,
                });
                dispatch({
                  type: "SET_INCOMPLETE_TODOS",
                  payload: toDosRes.data.incomplete,
                });
              }
            } else {
              dispatch({ type: "RESET_USER" });
            }
          } catch (err) {
            console.log(err);
          }
        };

        // logout 통신
        const logout = async () => {
          try {
            await axios.put("apu/auth/logout");

            dispatch({ type: "RESET_USER" });
          } catch (err) {
            console.log(err);
            dispatch({ type: "RESET_USER" });
          }
        };

        const value = {
          ...state,
          getCurrentUser,
          logout,
        };

        return (
          <GlobalContext.Provider value={value}>
            {props.children}
          </GlobalContext.Provider>
        );
      };

      export function useGlobalContext() {
        return useContext(GlobalContext);
      }
      ```

7.  useLocation() 메서드와 useGlobalContext()를 이용해 header의 logout, login, register 버튼을 구현합니다.

    ```js
    function Header() {
      const { user } = useGlobalContext();
      const { pathname } = useLocation();

      return (
        <div className="main-header">
          <div className="main-header__inner">
            <div className="main-header__left">
              <Link to="/">Todos </Link>
            </div>

            <div className="main-header__right">
              //user 가 true라면 버튼은 logout입니다.
              {user ? (
                <button className="btn">Logout</button>
              ) : // user가 false라면 에서 2가지로 나뉩니다.
              // 현재 주소가 "/" 라면 register 그게 아니라면 login 으로 버튼이 변경됩니다.

              pathname === "/" ? (
                <Link to="/register" className="btn">
                  Register
                </Link>
              ) : (
                <Link to="/" className="btn">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    }
    ```

8.  회원가입 / 로그인 authbox 컴포넌트를 서버와 연결합니다. useState() 메서드를이용해 input에 입력된 데이터를 sumbit() 메서드를 만들어서 axios를 통해 서버에 input 데이터를 넘겨줍니다. 응답반은 데이터는 getCurrentUser() contextAPI 메서드로 전달되고 서버에서 만들었던 validation 유효성 검사 에러도 받습니다. 중요한 파트입니다.

    ```js
    import React, { useState } from "react";
    import { Link } from "react-router-dom";
    import axios from "axios";
    import { useGlobalContext } from "../context/GlobalContext";

    function AuthBox({ register }) {
      const { getCurrentUser } = useGlobalContext();

      // input 데이터를 입력된 데이터를  저장합니다.
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [name, setName] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const [errors, setErrors] = useState({});

      // register 혹은 login 폼이 submit 될때 실행될 메서드입니다. useState으로 담겨진 데이터를  axios를 이용해 서버에 보내집니다.
      const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        let data = {};
        if (register) {
          data = {
            email,
            name,
            password,
            confirmPassword,
          };
        } else {
          data = {
            email,
            password,
          };
        }

        // 서버와 통신합니다.
        axios
          .post(register ? "/api/auth/register" : "/api/auth/login", data)
          .then(() => {
            // context를 호출합니다.
            getCurrentUser();
          })
          .catch((err) => {
            setLoading(false);
            if (err?.response?.data) {
              setErrors(err.response.data);
            }
          });
      };

      return (
        <div className="auth">
          <div className="auth__box">
            <div className="auth__header">
              <h1>{register ? "Register" : "Login"}</h1>
            </div>

            <form onSubmit={onSubmit}>
              {register && (
                <div className="auth__field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="auth__field">
                <label>Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="auth__field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {register && (
                <div className="auth__field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  {/* <p className="auth__error">something went wrong</p> */}
                </div>
              )}

              <div className="auth__footer">
                {Object.keys(errors).length > 0 && (
                  <p className="auth__error">you have some </p>
                )}

                <button className="btn" type="submit" disabled={loading}>
                  {register ? "Register" : "Login"}
                </button>

                {!register ? (
                  <div className="auth__register">
                    <p>
                      회원이 아닌가요? <Link to="/register">회원가입</Link>
                    </p>
                  </div>
                ) : (
                  <div className="auth__register">
                    <p>
                      이미 회원 이신가요? <Link to="/register">로그인</Link>
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      );
    }

    export default AuthBox;
    ```

9.  context API에 logout 메서드를 구현합니다.

    ```js
    // logout 통신
    const logout = async () => {
      try {
        await axios.put("apu/auth/logout");

        dispatch({ type: "RESET_USER" });
      } catch (err) {
        console.log(err);
        dispatch({ type: "RESET_USER" });
      }
    };

    const value = {
      ...state,

      //메서드를 넣어주어서 사용할수 있게설정합니다.
      getCurrentUser,
      logout,
    };
    ```

10. AuthBox 컴포넌트에서 서버에 데이터를 보내고 유효성 검사를 합니다. 받아온 에러를 useState을 이용해 저장한뒤 html에 렌더링합니다.

    ```js
          //서버에 data를 전송합니다. 인자로는 data를 넣어줍니다.
      axios
        .post(register ? "/api/auth/register" : "/api/auth/login", data)
        .then(() => {
          // context를 호출합니다.
          getCurrentUser();
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data) {

            //받아온 에러 데이터를 저장합니다.
            setErrors(err.response.data);
          }
        });
      };

      return (
        <div className="auth">
          <div className="auth__box">
            <div className="auth__header">
              <h1>{register ? "Register" : "Login"}</h1>
            </div>

            <form onSubmit={onSubmit}>
              {register && (
                <div className="auth__field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  {errors.name && <p className="auth__error">{errors.name}</p>}
                </div>
              )}

              <div className="auth__field">
                <label>Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="auth__error">{errors.email}</p>}
              </div>
              <div className="auth__field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="auth__error">{errors.password}</p>
                )}
              </div>

              {register && (
                <div className="auth__field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="auth__error">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <div className="auth__footer">
                {Object.keys(errors).length > 0 && (
                  <p className="auth__error">
                    {register
                      ? "몇 가지 유효성 검사 오류가 있습니다."
                      : errors.error}
                  </p>
                )}

                <button className="btn" type="submit" disabled={loading}>
                  {register ? "Register" : "Login"}
                </button>

                {!register ? (
                  <div className="auth__register">
                    <p>
                      회원이 아닌가요? <Link to="/register">회원가입</Link>
                    </p>
                  </div>
                ) : (
                  <div className="auth__register">
                    <p>
                      이미 회원 이신가요? <Link to="/register">로그인</Link>
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      );
    }

    ```

11. useNavigate()메서드를 이용해 logout를 실행시 자동으로 "/" 화면 login 으로 넘어가게 합니다.

    ```js
    import React, { useEffect } from "react";
    import { useGlobalContext } from "../context/GlobalContext";
    import { useNavigate } from "react-router-dom";

    function Dashboard() {
      const { user } = useGlobalContext();
      const navigate = useNavigate();

      useEffect(() => {
        if (!user && navigate) {
          // user가 없다면 "/" 화면으로 갑니다. 다시 dashboard로 오려해도 올수 없습니다.
          navigate("/");
        }
      }, [user, navigate]);
      return <div>Dashboard</div>;
    }

    export default Dashboard;
    ```

12. 반대로 로그인 했을때 dashboard 페이지로 이동하게 구현합니다. 로그인이 있는 AuthBox 컴포넌트에서 구현합니다.

    ```js
    const { getCurrentUser, user } = useGlobalContext();
    const navigate = useNavigate();

    useEffect(() => {
      if (user && navigate) {
        navigate("/dashboard");
      }
    }, [user, navigate]);
    ```

13. 유저가 있다면 todolist를 출력하는 코드를 구현합니다. ToDoCard 컴포넌트를 만들어서 useGlobalContext에서 받아온 completeToDos, incompleteToDos 데이터를 컴포넌트로 보내줍니다.

    ```js
    ...
    import ToDoCard from "./ToDoCard";

    function Dashboard() {
      const { user, completeToDos, incompleteToDos } = useGlobalContext();
      const navigate = useNavigate();

      useEffect(() => {
        if (!user && navigate) {
          // user가 없다면 "/" 화면으로 갑니다. 다시 dashboard로 오려해도 올수 없습니다.
          navigate("/");
        }
      }, [user, navigate]);

      return (
        <div className="dashboard">
          <div className="todos">
            {/* 유저가 확인 되었다면 todo를 화면에 출력합니다. */}
            {incompleteToDos.map((toDo) => (
              //key를 넣어주지 않으면 key를 넣어라는 에러가 발생합니다.
              //ToDoCard 컴포넌트에 incompleteToDos 데이터를 props로 넘깁니다.
              <ToDoCard toDo={toDo} key={toDo._id}></ToDoCard>
            ))}
          </div>

          {/* 완료된 투두가 하나도 없으면 Complete ToDo's 까지 출력하지 않습니다. */}
          {completeToDos.length > 0 && (
            <div className="todos">
              <h2 className="todos__title">Complete ToDo's</h2>

              {/* 유저가 확인 되었다면 todo를 화면에 출력합니다. */}

              {completeToDos.map((toDo) => (
                <ToDoCard toDo={toDo} key={toDo._id}></ToDoCard>
              ))}
            </div>
          )}
          <div className="todos"></div>
        </div>
      );
    }

    export default Dashboard;
    ```

    - 받은 데이터를 가지고 컴포넌트를 구현합니다. 먼저 edit,save의 수정된 데이터를 담을 content state을 만들고 edit의 true,false여부는 readOnly 테그를 컨드롤합니다.

      - 메서드는 onEdit 메서드와 stopEditing 메서드가 있습니다.
        onEdit 메서드는 edit 버튼을 클릭했을떄 발생합니다. editing의 값을 true로 넣어줍니다. readOnly 테그는 이제 수정이 가능합니다.
      - stopEditing 메서드는 setEdting의 값을 false을 주어 다시 readOnly 기능을합니다. 그리고 setContent의 값으로 원래 값인 toDo.content를 넣어줌으로써 수정을 시도했던 텍스트는 다시 사라지고 원래 content로 돌아옵니다.

    ```js
    import React, { useState, useRef } from "react";

    function ToDoCard({ toDo }) {
      // 데이터를
      const [content, setContent] = useState(toDo.content);

      //edit 컨트롤
      const [editing, setEditing] = useState(false);
      const input = useRef(null);

      // onEidit 메서드를 클릭하면 editing state이 true로 바귀고 readOnly를 수정가능하게 합니다.
      const onEdit = (e) => {
        e.preventDefault();
        setEditing(true);

        // edit에 마우스를 가져가면 흐려집니다.
        input.current.focus();
      };

      // edit 버튼을 누르면 cancel과 save 버튼이 출력됩니다. stopediting 메서드는 cancel을 누르면 취소되고 다시 readonly와 수정하기 전의 데이터가 다시 출력됩니다.
      const stopEditing = (e) => {
        if (e) {
          e.preventDefault();
        }

        setEditing(false);
        setContent(toDo.content);
      };

      return (
        // todo가 complete 데이터이면 완료했다는 의미의 text 가운데 줄이 그어지는 css를 구현합니다.
        <div className={`todo ${toDo.complete ? "todo--complete" : ""}`}>
          <input type="checkbox" />
          <input
            type="text"
            ref={input}
            value={content}
            //editing이의 값이 true면 reaOnly이고 false면 글쓰기가 가능합니다. 이를 이용해 edit을 구현합니다.
            readOnly={!editing}
            // 수정한 데이터는 setContest에 저장됩니다.
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="todo__controls">
            {/* edit 버튼을 누르면 edit, delete 버튼이 cancle과 save 버튼으로 변경됩니다.*/}
            {!editing ? (
              <>
                {/* complete이면 edit 버튼을 구현하지 않습니다. incomplete에만 구현됩니다. */}
                {!toDo.complete && <button onClick={onEdit}>Edit</button>}
                <button>Delete</button>
              </>
            ) : (
              <>
                <button onClick={stopEditing}>Cancel</button>
                <button>Save</button>
              </>
            )}
          </div>
        </div>
      );
    }

    export default ToDoCard;
    ```

14. 새로운 todo를 생성합니다. NewToDo 컴포넌트를 생성합니다.

    - 먼저 NewToDo 컴포넌트에서 input과 butten을 생성합니다.
      useState을 이용해 input 필드에 데이터를 저장합니다.
      저장한 데이터는 onSubmit 메서드를 생성해 axios 서버에 데이터를 보냅니다. 보냄과동시에 setContent는 초기화 ("")를 시켜줍니다.

      ```js
      import React, { useState } from "react";
      import axios from "axios";
      import { useGlobalContext } from "../context/GlobalContext";

      function NewToDo() {
        const { addToDo } = useGlobalContext();
        const [content, setContent] = useState("");

        // 서버에 새로운 todo content를 보냅니다.
        const onSubmit = (e) => {
          e.preventDefault();

          axios.post("api/todos/new", { content }).then((res) => {
            setContent("");
            addToDo(res.data);
          });
        };
        return (
          <form className="new" onSubmit={onSubmit}>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* disabled를 이용해 한글자도 없다면  비활성화 됩니다.*/}
            <button
              className="btn"
              type="submit"
              disabled={content.length == 0}
            >
              Add
            </button>
          </form>
        );
      }

      export default NewToDo;
      ```

      - 중요한 부분입니다. `const { addToDo } = useGlobalContext();` GlobalContext 컴포넌트에 addToDo 디스패치를 만들어 주었습니다. 서버와 통신할때 받은 데이터를 `addToDo(res.data)`로 디스페치에 데이터를 전송합니다.

      ```js
      // GlobalContext.js
      const addToDo = (toDo) => {
        dispatch({
          type: "SET_INCOMPLETE_TODOS",
          payload: [toDo, ...state.incompleteToDos],
        });
      };
      ```

      ```js
      const onSubmit = (e) => {
        e.preventDefault();

        axios.post("api/todos/new", { content }).then((res) => {
          setContent("");
          addToDo(res.data);
        });
      };
      ```

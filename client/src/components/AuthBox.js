import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";

function AuthBox({ register }) {
  const { getCurrentUser, user } = useGlobalContext();
  const navigate = useNavigate();
  // useState을 이용해  회원가입, 로그인 폼의 데이터를 저장합니다.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && navigate) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 로그인, 회원가입의 폼 데이터를 data 객체에 넣어줍니다.
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
          <h1>{register ? "회원가입" : "로그인"}</h1>
        </div>

        <form onSubmit={onSubmit}>
          {register && (
            <div className="auth__field">
              <label>이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {errors.name && <p className="auth__error">{errors.name}</p>}
            </div>
          )}

          <div className="auth__field">
            <label>이메일</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="auth__error">{errors.email}</p>}
          </div>
          <div className="auth__field">
            <label>비밀번호</label>
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
              <label>비밀번호 재확인</label>
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
              {register ? "회원가입" : "로그인"}
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
                  이미 회원 이신가요? <Link to="/">로그인</Link>
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

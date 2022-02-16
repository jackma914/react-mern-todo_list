import React from "react";

function AuthBox({ register }) {
  return (
    <div className="auth">
      <div className="auth__box">
        <div className="auth__header">
<<<<<<< HEAD
          <h1>Login</h1>

          <h1>{true ? "Register" : "Login"}</h1>
        </div>

        <h1>{true ? "Register" : "Login"}</h1>
      </div>

      <form>
        {register && (
=======
          <h1>{true ? "Register" : "Login"}</h1>
        </div>

        <form>
          {register && (
            <div className="auth__field">
              <label> Name</label>
              <input type="text" />
            </div>
          )}

>>>>>>> parent of ba76c49 (Revert "ADD React Context API")
          <div className="auth__field">
            <label> Name</label>
            <input type="text" />
          </div>
<<<<<<< HEAD
        )}

        <div className="auth__field">
          <label> Email</label>
          <input type="text" />
        </div>

        <div className="auth__field">
          <label> Password</label>
          <input type="password" />
        </div>

        {register && (
=======

>>>>>>> parent of ba76c49 (Revert "ADD React Context API")
          <div className="auth__field">
            <label>Confirm Password</label>
            <input type="password" />

<<<<<<< HEAD
            {/* <p className="auth__error">Something went wrong</p> */}
=======
          {register && (
            <div className="auth__field">
              <label>Confirm Password</label>
              <input type="password" />

              {/* <p className="auth__error">Something went wrong</p> */}
            </div>
          )}

          <div className="auth__footer">
            <p className="auth__error">Something went wrong</p>
            <button className="btn">{register ? "Register" : "Login"}</button>
>>>>>>> parent of ba76c49 (Revert "ADD React Context API")
          </div>
        )}

        <div className="auth__footer">
          <p className="auth__error">Something went wrong</p>

          <button className="btn">{register ? "Register" : "Login"}</button>
        </div>
      </form>
    </div>
  );
}

export default AuthBox;

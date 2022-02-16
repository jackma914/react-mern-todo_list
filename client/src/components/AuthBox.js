import React from "react";

<<<<<<< HEAD
function AuthBox() {
=======
function AuthBox({ register }) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
  return (
    <div className="auth">
      <div className="auth__box">
        <div className="auth__header">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          <h1>Login</h1>
        </div>

        <form>
=======
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
          <h1>{true ? "Register" : "Login"}</h1>
        </div>

        <form>
          {register && (
            <div className="auth__field">
              <label> Name</label>
              <input type="text" />
            </div>
          )}

>>>>>>> parent of f476f67 (ADD Client authorisation)
          <div className="auth__field">
            <label> Email</label>
            <input type="text" />
          </div>
          <div className="auth__field">
            <label> Password</label>
            <input type="password" />
          </div>

<<<<<<< HEAD
          <div className="auth__footer">
            <p className="auth__error">Something went wrong</p>
            <button className="btn">Login</button>
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
=======
>>>>>>> parent of f476f67 (ADD Client authorisation)
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthBox;

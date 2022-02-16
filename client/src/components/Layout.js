import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";
<<<<<<< HEAD

function Layout() {
  return (
=======
import { useGlobalContext } from "../context/GlobalContext";

function Layout() {
  const { fetchingUser } = useGlobalContext();

  return fetchingUser ? (
    <div className="loading">
      <h1>Loading</h1>
    </div>
  ) : (
>>>>>>> parent of f476f67 (ADD Client authorisation)
    <BrowserRouter>
      {/* ADD HEADER */}
      <Header />
      <Routes>
        <Route exact path="/" element={<AuthBox />}></Route>
<<<<<<< HEAD
        <Route path="/test" element={<h1>Test</h1>}></Route>
=======
        <Route path="/register" element={<AuthBox register />}></Route>
>>>>>>> parent of f476f67 (ADD Client authorisation)
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;

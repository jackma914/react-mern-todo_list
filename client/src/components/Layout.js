import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";

function Layout() {
  const { fetchingUser } = useGlobalContext();

  return fetchingUser ? (
    <div className="loading">
      <h1>Loading</h1>
    </div>
  ) : (
    <BrowserRouter>
      {/* ADD HEADER */}
      <Header />
      <Routes>
        <Route exact path="/" element={<AuthBox />}></Route>
        <Route path="/test" element={<h1>Test</h1>}></Route>
        <Route path="/register" element={<AuthBox register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";

function Layout() {
  return (
    <BrowserRouter>
      {/* ADD HEADER */}
      <Header />
      <Routes>
        <Route exact path="/" element={<AuthBox />}></Route>
        <Route path="/test" element={<h1>Test</h1>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;

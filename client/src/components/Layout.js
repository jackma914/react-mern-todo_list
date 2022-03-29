import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";

function Layout() {
  return (
    <BrowserRouter>
      {/* Header 컴포넌트는 고정입니다. */}
      <Header />
      <Routes>
        <Route path="/" element={<AuthBox />} />
        <Route path="/register/*" element={<AuthBox register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;

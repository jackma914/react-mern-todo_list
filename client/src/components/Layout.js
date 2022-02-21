import React from "react";
import Header from "./Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthBox from "./AuthBox";
import { useGlobalContext } from "../context/GloalContext";

function Layout() {
  const { fetchingUser } = useGlobalContext();

  return fetchingUser ? (
    <div className="loading">Loading</div>
  ) : (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route exact path="/" element={<AuthBox />} />
        <Route path="/register" element={<AuthBox register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;

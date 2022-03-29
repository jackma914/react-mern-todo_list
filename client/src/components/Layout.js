import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";
import { useGlobalContext } from "../context/GlobalContext";
import Dashboard from "./Dashboard";

function Layout() {
  const { fetchingUser } = useGlobalContext();
  return fetchingUser ? (
    <div className="loading">
      <h1>Loading</h1>
    </div>
  ) : (
    <BrowserRouter>
      {/* Header 컴포넌트는 고정입니다. */}
      <Header />
      <Routes>
        <Route path="/" element={<AuthBox />} />
        <Route path="/register/*" element={<AuthBox register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;

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

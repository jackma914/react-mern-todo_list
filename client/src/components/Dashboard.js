import React, { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && navigate) {
      navigate("/");
    }
  }, [user, navigate]);

  return <h1>Dashboard</h1>;
}

export default Dashboard;

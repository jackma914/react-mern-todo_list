import React, { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import ToDoCard from "./ToDoCard";
import NewToDo from "./NewToDo";

function Dashboard() {
  const { user, completeToDos, incompleteToDos } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && navigate) {
      // user가 없다면 "/" 화면으로 갑니다. 다시 dashboard로 오려해도 올수 없습니다.
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="dashboard">
      <NewToDo />

      <div className="todos">
        {/* 유저가 확인 되었다면 todo를 화면에 출력합니다. */}
        {incompleteToDos.map((toDo) => (
          //key를 넣어주지 않으면 key를 넣어라는 에러가 발생합니다.
          <ToDoCard toDo={toDo} key={toDo._id}></ToDoCard>
        ))}
      </div>

      {completeToDos.length > 0 && (
        <div className="todos">
          <h2 className="todos__title">Complete ToDo's</h2>

          {/* 유저가 확인 되었다면 todo를 화면에 출력합니다. */}

          {completeToDos.map((toDo) => (
            <ToDoCard toDo={toDo} key={toDo._id}></ToDoCard>
          ))}
        </div>
      )}
      <div className="todos"></div>
    </div>
  );
}

export default Dashboard;

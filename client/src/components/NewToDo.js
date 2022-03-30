import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";

function NewToDo() {
  const { addToDo } = useGlobalContext();
  const [content, setContent] = useState("");

  // 서버에 새로운 todo content를 보냅니다.
  const onSubmit = (e) => {
    e.preventDefault();

    axios.post("api/todos/new", { content }).then((res) => {
      setContent("");
      addToDo(res.data);
    });
  };
  return (
    <form className="new" onSubmit={onSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* disabled를 이용해 한글자도 없다면  비활성화 됩니다.*/}
      <button className="btn add" type="submit" disabled={content.length == 0}>
        추가
      </button>
    </form>
  );
}

export default NewToDo;

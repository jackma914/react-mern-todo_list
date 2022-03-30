import axios from "axios";
import React, { useState, useRef } from "react";
import { useGlobalContext } from "../context/GlobalContext";

function ToDoCard({ toDo }) {
  // 데이터를 저장하는 state입니다.
  const [content, setContent] = useState(toDo.content);

  //edit 컨트롤
  const [editing, setEditing] = useState(false);
  const input = useRef(null);

  const { toDoComplete, toDoIncomplete, removeToDo, editToDo } =
    useGlobalContext();

  // onEidit 메서드를 클릭하면 editing state이 true로 바귀고 readOnly를 수정가능하게 합니다.
  const onEdit = (e) => {
    e.preventDefault();
    setEditing(true);

    // edit에 마우스를 가져가면 흐려집니다.
    input.current.focus();
  };

  // edit 버튼을 누르면 cancel과 save 버튼이 출력됩니다. stopediting 메서드는 cancel을 누르면 취소되고 다시 readonly와 수정하기 전의 데이터가 다시 출력됩니다.
  const stopEditing = (e) => {
    if (e) {
      e.preventDefault();
    }

    setEditing(false);
    setContent(toDo.content);
  };

  // 체크박스 마커 메서드 입니다.
  const markAsComplte = (e) => {
    e.preventDefault();

    axios.put(`/api/todos/${toDo._id}/complete`).then((res) => {
      toDoComplete(res.data);
    });
  };

  const markAsIncomplte = (e) => {
    e.preventDefault();
    axios.put(`/api/todos/${toDo._id}/incomplete`).then((res) => {
      toDoIncomplete(res.data);
    });
  };

  //삭제 메서드입니다.
  const deleteToDo = (e) => {
    e.preventDefault();

    if (window.confirm("정말 삭제 하시겠습니까?")) {
      axios.delete(`/api/todos/${toDo._id}`).then(() => {
        // 데이터는 서버에서 삭제를 이미 했습니다. res 로 데이터를 받지 않고 toDo를 전달합니다.
        removeToDo(toDo);
      });
    }
  };

  //데이터를 업데이트합니다.

  const updateToDo = (e) => {
    e.preventDefault();

    axios
      .put(`/api/todos/${toDo._id}`, { content })
      .then((res) => {
        editToDo(res.data);
        setEditing(false);
      })
      .catch(() => {
        stopEditing();
      });
  };

  return (
    // todo가 complete 데이터이면 완료했다는 의미의 text 가운데 줄이 그어지는 css를 구현합니다.
    <div className={`todo ${toDo.complete ? "todo--complete" : ""}`}>
      {/* checked 태그를 이용해 complete 투두는 미리 체크표시 되어있도록 구현합니다. */}
      <input
        type="checkbox"
        checked={toDo.complete}
        onChange={!toDo.complete ? markAsComplte : markAsIncomplte}
      />
      <input
        type="text"
        ref={input}
        value={content}
        //editing이의 값이 true면 reaOnly이고 false면 글쓰기가 가능합니다. 이를 이용해 edit을 구현합니다.
        readOnly={!editing}
        // 수정한 데이터는 setContest에 저장됩니다.
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="todo__controls">
        {/* edit 버튼을 누르면 edit, delete 버튼이 cancle과 save 버튼으로 변경됩니다.*/}
        {!editing ? (
          <>
            {/* complete이면 edit 버튼을 구현하지 않습니다. incomplete에만 구현됩니다. */}
            {!toDo.complete && <button onClick={onEdit}>수정</button>}
            <button onClick={deleteToDo}>삭제</button>
          </>
        ) : (
          <>
            <button onClick={stopEditing}>취소</button>
            <button onClick={updateToDo}>저장</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ToDoCard;

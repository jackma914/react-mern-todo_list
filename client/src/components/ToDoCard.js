import React, { useState, useRef } from "react";

function ToDoCard({ toDo }) {
  const [content, setContent] = useState(toDo.content);
  const [editing, setEditing] = useState(false);
  const input = useRef(null);

  const onEdit = (e) => {
    e.preventDefault();
    setEditing(true);
    input.current.focus();
  };

  const stopEditing = (e) => {
    if (e) {
      e.preventDefault();
    }
    setEditing(false);
    setContent(e.target.value);
  };

  return (
    <div className={`todo ${toDo.complete ? "todo--complete" : ""}`}>
      <input type="checkbox" checked={toDo.complete} />
      <input
        type="text"
        ref={input}
        value={content}
        readOnly={!editing}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="todo__controls">
        {!editing ? (
          <>
            {!toDo.complete && <button onClick={onEdit}>Edit</button>}
            <button>Delete</button>
          </>
        ) : (
          <>
            <button onClick={stopEditing}> Cancel</button>
            <button> Save</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ToDoCard;

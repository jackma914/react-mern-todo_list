import React, { createContext, useReducer } from "react";
export const UserContext = createContext();

function UserStore(props) {
  const users = { name: "simson", job: "developer" };
  return (
    <UserContext.Provider value={users}>{props.children}</UserContext.Provider>
  );
}

export default UserStore;

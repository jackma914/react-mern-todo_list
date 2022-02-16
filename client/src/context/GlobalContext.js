//redux는 전역상태를 관리하기에 좋은 도구이다.하지만 react에서 redux를 사용하려고 하면 꽤 많은 boilerplate code를 생성해야하는 단점이 있다.
//(물론 redux hook을 사용하면 많이 줄어든다.)
//redux없이 react에서 제공하는 Context API를 이용하면 전역 상태를 redux와 유사하게 구현할 수 있다.
//이와 더불어 useContext, useReducer 훅을 사용하면 구현이 더더욱 쉬워진다.

import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

//initial state 초기값
const initialState = {
  user: null,
  fetchingUser: true,
  completeToDos: [],
  incompleteToDos: [],
};

//reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        fetchingUser: false,
      };
    case "SET_COMPLETE_TODOS":
      return {
        ...state,
        completeToDos: action.payload,
      };
    case "SET_INCOMPLETE_TODOS":
      return {
        ...state,
        incompleteToDos: action.payload,
      };
    case "RESET_USER":
      return {
        ...state,
        user: null,
        completeToDos: [],
        incompleteToDos: [],
        fetchingUser: false,
      };
    default:
      return state;
  }
};

//create the context
export const GlobalContext = createContext(initialState);

//provider component
// reducer를 이용해서 받은 값을 provider에 전달하여 값을 전달합니다.
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    getCurrentUser();
  }, []);

  // action: get current user
  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/api/auth/current");

      if (res.data) {
        const toDosRes = await axios.get("/api/todos/current");
        if (toDosRes.data) {
          dispatch({ type: "SET_USER", payload: res.data });
          dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: toDosRes.data.complete,
          });
          dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: toDosRes.data.incomplete,
          });
        }
      } else {
        dispatch({ type: "RESET_USER" });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };

  const logout = async () => {
    try {
      await axios.put("/api/auth/logout");
      dispatch({ type: "RESET_USER" });
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };

  const value = {
    ...state,
    getCurrentUser,
    logout,
  };
  return (
    // {props.children}을 토왜 자식 컴포넌트에 값을 전달하게 해줍니다.
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}

import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// initial state 초기값
const initialState = {
  user: null,
  fetchingUser: true,
  completeToDos: [],
  incompleteToDos: [],
};

//context 생성
export const GlobalContext = createContext(initialState);

// reducer
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

//provider 컴포넌트
export const GlobarProvider = (props) => {
  //useReducer
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    getCurrentUser();
  }, []);

  //axios를 통해 서버와 통신합니다.
  const getCurrentUser = async () => {
    try {
      //로그인된 사용자가 있는지를 확인합니다.
      const res = await axios.get("/api/auth/current");
      console.log(res);
      if (res.data) {
        //있다면 todos를 받아옵니다.
        const toDosRes = await axios.get("/api/todos/current");
        console.log(toDosRes);
        if (toDosRes.data) {
          //받아온 사용자와 todos를 dispatch를 통해 데이터를 보내줍니다.
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

  // logout 통신
  const logout = async () => {
    try {
      await axios.put("apu/auth/logout");

      dispatch({ type: "RESET_USER" });
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };

  const value = {
    ...state,

    //메서드를 넣어주어서 사용할수 있게설정합니다.
    getCurrentUser,
    logout,
  };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}

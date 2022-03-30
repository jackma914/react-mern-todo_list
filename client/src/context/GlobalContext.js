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
      if (res.data) {
        //있다면 todos를 받아옵니다.
        const toDosRes = await axios.get("/api/todos/current");
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

  // 새로운 todo 추가
  const addToDo = (toDo) => {
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: [toDo, ...state.incompleteToDos],
    });
  };

  // incomplete 를 complete로 변환합니다.
  const toDoComplete = (toDo) => {
    dispatch({
      type: "SET_INCOMPLETE_TODOS",

      // 기존 incompleteToDos에서 toDo._id를 빼고 받환합니다.
      payload: state.incompleteToDos.filter(
        (incompleteToDo) => incompleteToDo._id !== toDo._id
      ),
    });

    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: [toDo, ...state.completeToDos],
    });
  };

  // complete로 를 incomplete로 변환합니다.
  const toDoIncomplete = (toDo) => {
    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: state.completeToDos.filter(
        (complete) => complete._id !== toDo._id
      ),
    });

    const newIncompleteToDos = [toDo, ...state.incompleteToDos];

    dispatch({
      type: "SET_INCOMPLETE_TODOS",

      //다시 incomplete로 돌아갈때는 만들어졌던 시간순으로 정렬해서 돌아갑니다.
      payload: newIncompleteToDos.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.creatdAt)
      ),
    });
  };

  // todo 삭제
  const removeToDo = (toDo) => {
    if (toDo.complete) {
      console.log(toDo);
      dispatch({
        type: "SET_COMPLETE_TODOS",

        //filter 메서드를 이용해 toDo._id를 제외시키고 보냅니다.
        payload: state.completeToDos.filter(
          (completeToDo) => completeToDo._id !== toDo._id
        ),
      });
    } else {
      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: state.incompleteToDos.filter(
          (incompleteToDo) => incompleteToDo._id !== toDo._id
        ),
      });
    }
  };

  //todo 업데이트
  const editToDo = (toDo) => {
    console.log(toDo);
    if (toDo.complete) {
      const newCompleteToDos = state.completeToDos.map((completeToDo) =>
        completeToDo._id !== toDo.id ? completeToDo : toDo
      );
      dispatch({
        type: "SET_COMPLETE_TODOS",
        payload: newCompleteToDos,
      });
    } else {
      // 만약 toDo의 데이터의 id가 기존 incompleteToDo의 id와 같지 안다면 기존 데이터 같다면 새로 들어온 toDo데이터를 보내줍니다.
      // 수정한 데이터 말고 다른 데이터들은 수정되지 않았기때문에 기존데이터로 보내고 수정된 데이터면 골라내야 하기 때문입니다.
      const newInompleteToDos = state.incompleteToDos.map((incompleteToDo) =>
        incompleteToDo._id !== toDo._id ? incompleteToDo : toDo
      );
      console.log(newInompleteToDos);
      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: newInompleteToDos,
      });
    }
  };

  const value = {
    ...state,

    //메서드를 넣어주어서 사용할수 있게설정합니다.
    getCurrentUser,
    logout,
    addToDo,
    toDoComplete,
    toDoIncomplete,
    removeToDo,
    editToDo,
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

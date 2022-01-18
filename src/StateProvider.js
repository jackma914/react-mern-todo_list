import { createContext, useContext, useReducer } from "react";

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>;
};

export const useStateValue = () => useContext(StateContext);
//-----------------context api 연습
// import { createContext } from "react";

// export const UserContext = createContext();

// const UserStore = (props) => {
//   const users = {
//     user: "심",
//   };

//   return (
//     <UserContext.Provider value={users}>{props.children}</UserContext.Provider>
//   );
// };

// export default UserStore;

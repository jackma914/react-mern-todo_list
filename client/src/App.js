import "./main.scss";
import Layout from "./components/Layout";
import { GlobalProvider } from "./context/GlobalContext";

function App() {
  return (
    // App안의 모든 컴포넌트에서는 전역 Context에 접근해서 state과 dispatch를 이용할 수 있게 되었다.
    <GlobalProvider>
      <Layout />
    </GlobalProvider>
  );
}

export default App;

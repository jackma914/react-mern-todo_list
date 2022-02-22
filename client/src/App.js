import "./main.scss";
import Layout from "./components/Layout";
import { GlobalProvider } from "./context/GlobalContext";

function App() {
  return (
    // 생성한 provider를 app.js 또는 index.js에 import 하여 모든 하위 컴포넌트가 포함되도록 감싸줍니다.
    <GlobalProvider>
      <Layout />
    </GlobalProvider>
  );
}

export default App;

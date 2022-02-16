import "./main.scss";
import Layout from "./components/Layout";

function App() {
  return (
    <div>
      <GlobalProvider>
        <Layout />
      </GlobalProvider>
    </div>
  );
}

export default App;

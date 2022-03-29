import "./main.scss";
import Layout from "./components/Layout";
import { GlobarProvider } from "./context/GlobalContext";

function App() {
  return (
    <GlobarProvider>
      <Layout />
    </GlobarProvider>
  );
}

export default App;

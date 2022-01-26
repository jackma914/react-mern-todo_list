import "./App.css";
import Header from "./components/Navbar/Header";
import Home from "./components/Product/Home";
// import Checkout from "./Checkout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          {/* 
          <Route
            path="/checkout"
            element={
              <>
                <Header />
                <Checkout />
              </>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

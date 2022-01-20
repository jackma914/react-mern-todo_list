import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Checkout from "./Checkout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StateBasket from "./store/Reducer";

function App() {
  return (
    <div className="App">
      <StateBasket>
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

            <Route
              path="/checkout"
              element={
                <>
                  <Header />
                  <Checkout />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </StateBasket>
    </div>
  );
}

export default App;

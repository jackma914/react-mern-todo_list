import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Checkout from "./Checkout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserStore from "./store/users";

function App() {
  return (
    <div className="App">
      <UserStore>
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
      </UserStore>
    </div>
  );
}

export default App;

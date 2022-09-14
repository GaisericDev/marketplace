import { Navbar } from "./Navbar";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { Create } from "./Create";
import { Web3ContextProvider } from "../context/Web3Context";

function App() {
  return (
      <div className="App">
        <Web3ContextProvider>
          <Router basename="/">
          <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="*" element={<NotFound></NotFound>}></Route>
              <Route path="/create" element={<Create/>}></Route>
            </Routes>
          </Router>
        </Web3ContextProvider>
      </div>
  );
}

export default App;
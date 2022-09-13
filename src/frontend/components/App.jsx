import { Navbar } from "./Navbar";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { NotFound } from "./NotFound";

function App() {
  return (
      <div className="App">
        <Navbar></Navbar>
        <Router basename="/">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<NotFound></NotFound>}></Route>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
import { Navbar } from "./Navbar";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { Create } from "./Create";
import { Web3ContextProvider } from "../context/Web3Context";
import { createTheme, ThemeProvider } from '@mui/material';
import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    }
  });
  return (
      <div className={`App ${darkMode && "dark"}`}>
        <Web3ContextProvider>
          <Router basename="/">
          <ThemeProvider theme={theme}>
            <Navbar isDarkMode={darkMode} check={darkMode} change={()=>setDarkMode(!darkMode)}></Navbar>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="*" element={<NotFound></NotFound>}></Route>
              <Route path="/create" element={<Create/>}></Route>
            </Routes>
          </ThemeProvider>
          </Router>
        </Web3ContextProvider>
      </div>
  );
}

export default App;
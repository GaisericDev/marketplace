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
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    }
  });
  return (
      <div className={`App ${darkMode && "dark"}`}>
        <ThemeProvider theme={theme}>
        <Web3ContextProvider>
          <Router basename="/">
            <Navbar isDarkMode={darkMode} check={darkMode} change={()=>setDarkMode(!darkMode)}></Navbar>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="*" element={<NotFound></NotFound>}></Route>
              <Route path="/create" element={<Create isDarkMode={darkMode}/>}></Route>
            </Routes>
          </Router>
        </Web3ContextProvider>
        </ThemeProvider>
      </div>
  );
}

export default App;
import React, {useState} from 'react'
import "./Navbar.scss";
import useWindowDimensions from "../utils/useWindowDimensions";
import OpenseaIcon from "../../assets/opensea.svg";
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useWeb3 } from '../context/Web3Context';
import { Link } from 'react-router-dom';
import { ProfileDrawer } from './ProfileDrawer';

export const Navbar = (props) => {

  // Web3 provider
  const {web3Provider} = useWeb3();
  // Keep track of width and height of viewport
  const { height, width } = useWindowDimensions();
  // Nav menu items
  const menuItems = [
    <Link to="/create"><div className="item">Create</div></Link>
    ,<ProfileDrawer isDarkMode={props.isDarkMode} change={props.change}></ProfileDrawer>
  ];
  // Drawer
  const [state, setState] = useState({
    top: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
        <div>
            <ul>
                {menuItems.map((item, index)=>{ return (<li key={index}>{item}</li>)}).reverse()}
            </ul>
            <Divider></Divider>
        </div>
    </Box>
  );

  return (
    <>
    <div className={`navbar ${props.isDarkMode && "dark"}`}>
        <div className="wrapper">
          {/* Navbar Left */}
            <Link to="/" className="item-left">
              <div>
                  <img className="logo" src={OpenseaIcon} alt="Marketplace logo" />
                  Marketplace {props.isDarkMode ? "Dark" : "Light"}
              </div>
            </Link>
            <div className="items">
              {/* Navbar Right */}
                {
                    width <= 768 ? (
                        <div className="item">
                            <MenuIcon onClick={toggleDrawer('top', true)} sx={{height: 40, width: 40}}></MenuIcon>
                        </div>
                    ) : (
                        <>
                            {menuItems.map((item, index)=>{ return <div key={`menuItem${index}`}>{item}</div>})}
                        </>
                    )
                }
            </div>
        </div>
    </div>
    {/* Drawer */}
    <SwipeableDrawer
        anchor={"top"}
        open={state["top"]}
        onClose={toggleDrawer("top", false)}
        onOpen={toggleDrawer("top", true)}
        >
    {list("top")}
    </SwipeableDrawer>
    </>
  )
}

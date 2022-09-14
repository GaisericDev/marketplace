import React, {useState} from 'react'
import "./Navbar.css";
import useWindowDimensions from "../utils/useWindowDimensions";
import OpenseaIcon from "../../assets/opensea.svg";
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GridOnIcon from '@mui/icons-material/GridOn';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import { useWeb3 } from '../context/Web3Context';
import { Link } from 'react-router-dom';

export const Navbar = (props) => {

  // Web3 provider
  const {web3Provider} = useWeb3();
  // Keep track of width and height of viewport
  const { height, width } = useWindowDimensions();
  // Nav menu items
  const menuItems = [
    <Link to="/create">Create</Link>
    ,<AccountCircleOutlinedIcon sx={{height: 40, width: 40}}></AccountCircleOutlinedIcon>
  ];
  // Dark mode switch
  const label = { inputProps: { 'aria-label': 'Switch' } };
  // Profile hover menu items
  const personalItems = [
    <Link to="account"><div className='personalListItem'><PersonIcon></PersonIcon>Profile</div></Link>
    ,<Link to="favorites"><div className='personalListItem'><FavoriteBorderIcon></FavoriteBorderIcon>Favorites</div></Link>
    ,<Link to="my-collections"><div className='personalListItem'><GridOnIcon></GridOnIcon>My Collections</div></Link>
    ,<div className='personalListItem' onClick={props.change}>
      <DarkModeIcon></DarkModeIcon>
      Night Mode
      <Switch {...label} color="default" checked={props.check} onChange={props.change}></Switch>
    </div>
  ]
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
    <div className="navbar">
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
                            {menuItems.map((item, index)=>{ return (<div className="item" key={index}>{item}</div>)})}
                            <div className="profileDrawer">
                              <ul>
                                {personalItems.map((item, index)=>{
                                  return (<li key={`personal${index}`}>{item}<Divider></Divider></li>)
                                })
                                }
                              </ul>
                            </div>
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

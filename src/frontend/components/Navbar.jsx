import React, {useState} from 'react'
import "./Navbar.css";
import useWindowDimensions from "../utils/useWindowDimensions";
import OpenseaIcon from "../../assets/opensea.svg";
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Divider from '@mui/material/Divider';
import { useWeb3 } from '../context/Web3Context';

export const Navbar = () => {

  // web3 provider
  const {web3Provider} = useWeb3();
  // keep track of width and height of viewport
  const { height, width } = useWindowDimensions();
  // nav menu items
  const menuItems = [
    "Create"
    ,<AccountCircleOutlinedIcon sx={{height: 40, width: 40}}></AccountCircleOutlinedIcon>
    ,`Address: ${web3Provider.provider.selectedAddress}`
  ];
  // drawer
  const [state, setState] = useState({
    left: false,
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
            <div className="item-left">
                <img className="logo" src={OpenseaIcon} alt="Marketplace logo" />
                Marketplace
            </div>
            <div className="items">
                {
                    width <= 768 ? (
                        <div className="item">
                            <MenuIcon onClick={toggleDrawer('left', true)} sx={{height: 40, width: 40}}></MenuIcon>
                        </div>
                    ) : (
                        <>
                            {menuItems.map((item, index)=>{ return (<div className="item" key={index}>{item}</div>)})}
                        </>
                    )
                }
            </div>
        </div>
    </div>
    <SwipeableDrawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
        >
    {list("left")}
    </SwipeableDrawer>
    </>
  )
}

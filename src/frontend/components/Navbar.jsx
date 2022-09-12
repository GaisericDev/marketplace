import React, {useState} from 'react'
import "./Navbar.css";
import useWindowDimensions from "../utils/useWindowDimensions";
import OpenseaIcon from "../../assets/opensea.svg";
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
export const Navbar = () => {

  // keep track of width and height of viewport
  const { height, width } = useWindowDimensions();
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
                <li>Test</li>
            </ul>
        </div>
    </Box>
  );

  return (
    <>
    <div className="navbar">
        <div className="wrapper">
            <div className="item-left">
                <img className="logo" src={OpenseaIcon} alt="React Logo" />
                Marketplace
            </div>
            <div className="items">
                {
                    width <= 768 ? (
                        <div className="item">
                            <MenuIcon onClick={toggleDrawer('left', true)}></MenuIcon>
                        </div>
                    ) : (
                        <>
                            <div className="item">SomeItem</div>
                            <div className="item">SomeItem</div>
                            <div className="item">SomeItem</div>
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

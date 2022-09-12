import React from 'react'
import "./Navbar.css";
import useWindowDimensions from "../utils/useWindowDimensions";
import OpenseaIcon from "../../assets/opensea.svg";
import MenuIcon from '@mui/icons-material/Menu';

export const Navbar = () => {

  // keep track of width and height of viewport
  const { height, width } = useWindowDimensions();

  return (
    <div className="navbar">
        <div className="item-left">
            <img className="logo" src={OpenseaIcon} alt="React Logo" />
            Marketplace
        </div>
        <div className="wrapper">
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
  )
}

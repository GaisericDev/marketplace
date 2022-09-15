import React,{useState, useRef} from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GridOnIcon from '@mui/icons-material/GridOn';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import Switch from '@mui/material/Switch';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import "./ProfileDrawer.scss";
import { useWeb3 } from '../context/Web3Context';

export const ProfileDrawer = (props) => {
  // Web3 context
  const {web3Provider, logout} = useWeb3();
  // Dark mode switch
  const label = { inputProps: { 'aria-label': 'Switch' } };
  // Profile hover menu items
  const personalItems = [
    <Link to="account"><div className='personalListItem'><PersonIcon></PersonIcon>Profile</div></Link>
    ,<Link to="favorites"><div className='personalListItem'><FavoriteBorderIcon></FavoriteBorderIcon>Favorites</div></Link>
    ,<Link to="my-collections"><div className='personalListItem'><GridOnIcon></GridOnIcon>My Collections</div></Link>
    ,<>
    {web3Provider != null
      && 
      web3Provider.provider.selectedAddress != null
      && 
      <div className='personalListItem' onClick={logout}>
        <LogoutIcon></LogoutIcon>
        Logout
      </div>
    }
    </>
    ,<div className='personalListItem' onClick={props.change}>
      <DarkModeIcon></DarkModeIcon>
      Night Mode
      <Switch {...label} color="default" checked={props.check}></Switch>
    </div>
  ]

  const [isHovering, setIsHovering] = useState(false);
  const [hoveredOff, setHoveredOff] = useState(false);
  const timeRef = useRef(null);

  // Add hovering class (trigger hover animation, toggled in the div using JSX)
  const hoverOn = () => {
    setHoveredOff(false);
    setIsHovering(true);
  }

  // Remove hover off class
  const removeHovered = () => {
    setHoveredOff(false);
    clearInterval(timeRef.current);
  }

  // Remove hovering class, add hovering off class (trigger hover off animation), set timer to remove hovering off class when animation completes
  const hoverOff = () => {
    // should remove hover class to trigger hover out animation
    setIsHovering(false);
    setHoveredOff(true);
    timeRef.current = setInterval(()=>{removeHovered()}, 300)
  }

  return (
    <div className="item profileIcon" onMouseEnter={()=>{hoverOn()}} onMouseLeave={()=>{hoverOff()}}>
      <AccountCircleOutlinedIcon
      sx={{height: 40, width: 40}}
      >
      </AccountCircleOutlinedIcon>
      <div className={`profileDrawer ${props.isDarkMode && "dark"} ${isHovering && "isHovering"} ${hoveredOff && "hoveredOff"}`}>
        <ul>
          {personalItems.map((item, index)=>{
            return (<li key={`personal${index}`}>{item}<Divider></Divider></li>)
          })
          }
        </ul>
      </div>
      <div className={`extension ${isHovering && "visible"}`}></div>
    </div>
  )
}

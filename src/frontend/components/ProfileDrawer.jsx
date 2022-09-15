import React,{useState} from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GridOnIcon from '@mui/icons-material/GridOn';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Switch from '@mui/material/Switch';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import "./ProfileDrawer.scss";

export const ProfileDrawer = (props) => {
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
      <Switch {...label} color="default" checked={props.check}></Switch>
    </div>
  ]

  const [isHovering, setIsHovering] = useState(false);
  const [hoveredOff, setHoveredOff] = useState(false);
  const [isOnDiv, setIsOnDiv] = useState(false);
  const hoverOn = () => {
    //should add class hovering to trigger animation, will be done by setting hover state and checking it in the div
    setHoveredOff(false);
    setIsHovering(true);
  }

  const hoverOff = () => {
    // should add class that triggers hover off animation
    !isOnDiv && setHoveredOff(true);
    // setIsHovering(false);
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
      <div className="connectorV" onMouseEnter={()=>{setIsOnDiv(true)}} onMouseLeave={()=>{setIsOnDiv(false)}}>
      </div>
      <div className="connectorH" onMouseEnter={()=>{setIsOnDiv(true)}} onMouseLeave={()=>{setIsOnDiv(false)}}></div>
    </div>
  )
}

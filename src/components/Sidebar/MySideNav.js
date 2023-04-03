
import React, { useState } from "react";
import SideNav,{Toggle,NavItem,NavIcon,NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { useNavigate } from "react-router-dom";
import News  from '../../images/news1.svg'
import Arrow from '../../images/arrow.svg'
import Isvg from 'react-inlinesvg';

function MySideNav(){

// const navigate = useNavigate();
const [openMenu, setOpenMenu] = useState(false)

function openNewsMenu() {
    setOpenMenu(true)
    if(openMenu) {
      setOpenMenu(false)
    }
}


return (
      <div className="side-bar">
          <h1 className="heading-side-bar">demo<span>admin</span></h1>
          <div className="side-bar-title" onClick={openNewsMenu}>
              <div>
                  <Isvg className='isvg-news' src={News}/><span>News </span> 

                
              </div>
              <Isvg className={` ${openMenu ? 'open-arrow-up': 'open-arrow-down'}`}  src={Arrow }/>
            
          </div>
          {
            openMenu ?    <ul className="ul-links">
            <li><a href="http://localhost:3000/news-list">News List</a></li>
            <li><a href="http://localhost:3000/add-news">Add News</a></li>
            </ul> : null
          }
       
       </div>
)
{/* 
      
<SideNav 
onSelect={selected=>{
    console.log(selected);
    navigate('/' + selected);
}}
style={{backgroundColor:"green"}}
> <div> <h1 style={{fontSize:30}}>Demo Admin</h1></div>
<SideNav.Toggle/>
<SideNav.Nav defaultSelected="Add News">
<NavItem eventKey="post">
  <NavIcon><i className="fa fa-fw fa-home" style={{fontSize: 50}}/></NavIcon>
  <NavText style={{color:"black"}}>Add News</NavText>
</NavItem>


<NavItem eventKey="list">
  <NavIcon><i className="fa fa-fw fa-home" style={{fontSize: 50}}/></NavIcon>
  <NavText style={{color:"black"}}>News List</NavText>
</NavItem>
</SideNav.Nav>


</SideNav> */}

}

export default MySideNav;
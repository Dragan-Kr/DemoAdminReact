import React, { useState,useContext } from 'react';
import ButtonSidebar from '../../images/buttonSidebar.svg';
import Isvg from 'react-inlinesvg';
import HeadPhone from '../../images/headPhone.svg';
import Notification from '../../images/notification.svg';
import ProfilePicture from '../../images/profilePicture.svg';
import Doots from '../../images/doots.svg';
import AppContext from '../../context/AppContext';
import axios from "axios";
import { LOGOUT_API } from '../../globalVariables';
import { LOGIN } from '../../globalVariables';
import Cookies from 'universal-cookie';

function Header({ setElementClass }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prevShowDropdown => !prevShowDropdown);
  };
  const {email,accessToken } = useContext(AppContext);
  const cookies = new Cookies();

  const cookieValue = cookies.getAll();

  const logOutReq = [email,cookieValue]

  const handleLogout=async ()=>{
   // Make a GET request
    await axios.post(LOGOUT_API,logOutReq)
   .then(response => {
    console.log("Logout succesuful")
    cookies.remove('jwt');
window.location.replace(LOGIN);

    console.log("Response",response);
   })
   .catch(error => {
     console.error('Error:', error);
   });

  }

  return (
    <div className='header'>
      <button
        className='button-side-bar'
        onClick={() => {
          setElementClass(prev => !prev);
        }}
      >
        <Isvg src={ButtonSidebar} />
      </button>
      <div className='header-content-right'>
        <input className='header-input' type='text' placeholder='Search something...' />
        <button className='head'>
          <Isvg src={HeadPhone} />
        </button>
        <button className='notification'>
          <Isvg src={Notification} />
          <span></span>
        </button>
        <span className='user-name'>Sara Miler</span>
        <div className='profile-image'>
          <img src={ProfilePicture} />
          <span></span>
        </div>
        <button className='menu-options' onClick={toggleDropdown}>
          <Isvg src={Doots} />
        </button>
        { accessToken && 
        <div className='dropDown-logout'>
        {showDropdown && (
          <div >
            {/* Dropdown menu content */}
            <ul>
              <li className='logout' onClick={handleLogout}>Logout</li>
             
            </ul>
          </div>
        )}
        </div>
      }


      </div>
    </div>
  );
}

export default Header;














// import ButtonSidebar from '../../images/buttonSidebar.svg';
// import Isvg from 'react-inlinesvg';
//  import HeadPhone from '../../images/headPhone.svg';
// import Notification from  '../../images/notification.svg';
// import  ProfilePicture from  '../../images/profilePicture.svg';
// import Doots from '../../images/doots.svg';


// function Header({setElementClass}){

//   return(
//   <div className='header'>
//     <button className='button-side-bar' onClick = {()=> {
//       setElementClass(prev=>!prev)
//     }}><Isvg src={ButtonSidebar}/></button>
//     <div className='header-content-right'>
//         <input className='header-input' type='text' placeholder="Search something..." />
//         <button className='head'><Isvg src={HeadPhone}/></button>
//         <button className='notification'><Isvg src={Notification}/><span></span></button>
//         <span className='user-name'>Sara Miler</span>
//         <div className='profile-image'>
//             <img src={ProfilePicture}/>
//             <span></span>
//         </div>
//         <button className='menu-options'><Isvg src={Doots}/></button>
//     </div>
//   </div>



//   );

// }

// export default Header;
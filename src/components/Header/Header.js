import ButtonSidebar from '../../images/buttonSidebar.svg';
import Isvg from 'react-inlinesvg';
 import HeadPhone from '../../images/headPhone.svg';
import Notification from  '../../images/notification.svg';
import  ProfilePicture from  '../../images/profilePicture.svg';
import Doots from '../../images/doots.svg';


function Header(){

  return(
  <div className='header'>
    <button className='button-side-bar'><Isvg src={ButtonSidebar}/></button>
    <div className='header-content-right'>
        <input className='header-input' type='text' placeholder="Search something..." />
        <button className='head'><Isvg src={HeadPhone}/></button>
        <button className='notification'><Isvg src={Notification}/><span></span></button>
        <span className='user-name'>Sara Miler</span>
        <div className='profile-image'>
            <img src={ProfilePicture}/>
            <span></span>
        </div>
        <button className='menu-options'><Isvg src={Doots}/></button>
    </div>
  </div>



  );

}

export default Header;
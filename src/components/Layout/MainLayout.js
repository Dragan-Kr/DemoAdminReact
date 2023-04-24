import SideBar from '../Sidebar/MySideNav';
import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

function MainLayout (props){

const [elementClass, setElementClass] = useState(false)


return(

<div className='main-page'>
 <aside className={ `aside${elementClass? " responsive":""}`}><SideBar setElementClass = {setElementClass}/></aside> 
 <div className='right-content'>

   <header><Header setElementClass={setElementClass}/></header>
   
   <Outlet/>
 </div>

</div>



)


}
export default MainLayout;
import SideBar from '../Sidebar/MySideNav';
import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';
function MainLayout (){

return(

<div className='main-page'>
 <aside className='aside'><SideBar/></aside> 
 <div className='right-content'>

   <header><Header/></header>
   
   <Outlet/>
 </div>

</div>



)


}
export default MainLayout;
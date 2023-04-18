// // import logo from './logo.svg';
// import "./App.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import ListNewsComponent from "./components/ListNewsComponent";
// // import { Provider } from "react-alert";
// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
//     <div className="App">
//       <div className="container">
//         {/* <Router> */}
//           {/* <Provider> */}
//             {/* <Routes>
//               <Route exact path="/" element={Dashboard} />
//               <Route path="/post" element={ListNewsComponent} />
//             </Routes> */}
//           {/* </Provider> */}
//         {/* </Router> */}
//         <ListNewsComponent/>
//       </div>
//     </div>
//   );
// }

// export default App;

// // import React from "react";
// // import { Admin, Resource } from "react-admin";
// // // import { UserList } from "./users";
// // import { PostList, PostCreate } from "../src/components/ListNewsComponent";

// // import PostIcon from "@material-ui/icons/Book";
// // import UserIcon from "@material-ui/icons/Group";

// // import Dashboard from "../src/components/Dashboard";
// // // import authProvider from "./authProvider";

// // // import jsonServerProvider from "ra-data-json-server";

// // // const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

// // const App = () => (
// //   <Admin
// //     dashboard={Dashboard}
// //     // authProvider={authProvider}
// //     // dataProvider={dataProvider}
// //   >
// //     <Resource
// //       name="posts"
// //       list={PostList}
// //       // edit={PostEdit}
// //       create={PostCreate}
// //       icon={PostIcon}
// //     />
// //     {/* <Resource name="users" list={UserList} icon={UserIcon} /> */}
// //   </Admin>
// // );

// // export default App;






import React, { Suspense } from "react";
// import "components/FontawsomeIcons";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import "./index.css";
import "./list.css";
import { Provider } from "react-alert";
// import Layout from "pages/_layouts/Home";
import {  Routes, Route, BrowserRouter,Router,Switch } from "react-router-dom";
// import routes from "routes";
// import PageNotFound from "pages/PageNotFound";
// import Home from "pages/Home";
import DataTable from "./pages/Pages/index";

import CreatePostComponent from "./components/CreatePostComponent";

import MySideNav from "./components/Sidebar/MySideNav";
import CreatePostComponent2 from "./components/CreatePostComponent2";

import MultipleSelection from "./components/MultipleSelection";

import Header from "./components/Header/Header.js";

import MainLayout from "./components/Layout/MainLayout";
import HomePage from "./components/HomePage/HomePage";
import UpdatePostComponent from "./components/UpdatePostComponent";
import UpdatePost from "./components/UpdatePost";



function App() {
    return (
        <BrowserRouter>
        
        <Routes>
      
        <Route element={<MainLayout/>}>
            <Route path="/" element={HomePage}/>
            <Route path="/add-news" element={<CreatePostComponent2/>}/>
            <Route path="/news-list" element={<DataTable/>}/>
            {/* <Route path="/update-news/:id" element={<UpdatePostComponent/>}/> */}
            <Route path="/update-news/:id" element={<UpdatePost/>}/>
        </Route>
        </Routes>
        </BrowserRouter>




       
        
    );
}

export default App;


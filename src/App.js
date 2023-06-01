import React, { Suspense } from "react";
// import "components/FontawsomeIcons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./index.css";
import "./list.css";
import "./DataPicker.scss"
import { Routes, Route, BrowserRouter } from "react-router-dom";

import DataTable from "./pages/Pages/index";

import MainLayout from "./components/Layout/MainLayout";
import HomePage from "./components/HomePage/HomePage";
import UpdatePost from "./components/UpdatePost";
import DataPicker from "./components/DataPicker";
import LoginComponent from "./components/LoginComponent";
import RegistrationComponent from "./components/RegistrationComponent";
import AppProvider from "./context/AppProvider";
function App() {
  return (
    <BrowserRouter>
    <AppProvider>
     <Routes>
       <Route element={<MainLayout />}>
         <Route path="/" element={<LoginComponent/>} />
         <Route path="/news-list" element={<DataTable />} />
         <Route path="/update-news/:id" element={<UpdatePost />} />
         <Route path="/add-news/" element={<UpdatePost />} />
         <Route path="/login" element={<LoginComponent />} />
         <Route path="/register" element={<RegistrationComponent />} />
         <Route path="/date-picker/" element={<DataPicker />} />
       </Route>
     </Routes>
     </AppProvider>
   </BrowserRouter>
  );
}

export default App;

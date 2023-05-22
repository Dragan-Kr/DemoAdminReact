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
// import DataPicker from "./components/DataPicker";
import LoginComponent from "./components/LoginComponent";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={HomePage} />
          <Route path="/news-list" element={<DataTable />} />
          {/* <Route path="/news-list?page=1&limit=5&sortField=index&sortOrder=asc&searchTerm=" element={<DataTable />} /> */}

          <Route path="/update-news/:id" element={<UpdatePost />} />
          <Route path="/add-news/" element={<UpdatePost />} />
          <Route path="/login/" element={<LoginComponent />} />


          {/* <Route path="/date-picker/" element={<DataPicker />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

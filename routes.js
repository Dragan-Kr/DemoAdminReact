import React from "react";
import DataTable from "./src/pages/Pages";
// const DataTable = React.lazy(() => import("/components/pages/DataTable"));


const routes = [ {
    enabled: true,
    path: "/data-table",
    component: DataTable,
    navbar: "Data Table",
    child: null,
  }];





export default routes.filter((route) => route.enabled);
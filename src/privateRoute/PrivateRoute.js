
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "../context/AppContext";

const PrivateRoute = ({ children }) => {
  const { accessToken } = useContext(AppContext);
  const isAuthenticated = accessToken && accessToken.length > 0;
  console.log("Children",children)

  return isAuthenticated ? children : <Navigate to="/login" replace={true} />;
};

export default PrivateRoute;



//tutorial
// import React, {useContext  } from "react";
// import {Outlet,Navigate} from 'react-router-dom';

// import AppContext from '../context/AppContext';
// //tutorial
// const PrivateRoute = ()=>{
//   const { accessToken } = useContext(AppContext);
//   const isAuthenticated = accessToken && accessToken.length > 0;
//   console.log("PrivateRoute",isAuthenticated)
//    return(
//     isAuthenticated  ? <Outlet/> : <Navigate to='/login'/>
//   )
// }

// export default PrivateRoute;









// u obliku klase sa chatGPT
// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import AppContext from '../context/AppContext';
// class PrivateRoute extends React.Component {
//   static contextType = AppContext;
//   render() {
//     const contextValue = this.context;

//     const { element: Component, ...rest } = this.props;
//     const auth = { token: false };

//     return (
//       contextValue.accessToken && <Route
//         {...rest}
//         element={auth.token ? <Component /> : <Navigate to="/login" replace={true} />}
//       />
//     );
//   }
// }

// export default PrivateRoute;
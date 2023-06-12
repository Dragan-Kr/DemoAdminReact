
import React, { useContext, useState } from "react";
import { Navigate,useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

function PrivateRoute({allowedRoles, children }){
  console.log("allowedRoles",allowedRoles)
  const location = useLocation();

  const contextValue=  useContext(AppContext);
   console.log("contextValue",contextValue)
  const { accessToken, roles } = contextValue;

  console.log("ROLES",roles)
  let isAuthenticated=false;
  let allowedAccess = false;
  
  console.log("accessToken",accessToken)

  if (Array.isArray(allowedRoles) && Array.isArray(roles)) {
    console.log("Pristup vise rola")

   
  for (let i = 0; i < roles.length; i++) {
    const element1 = roles[i];

    for (let j = 0; j < allowedRoles.length; j++) {
      const element2 = allowedRoles[j];

      if (element1 === element2) {
        console.log("U if-u eliemnt1,element2",element1,element2)
         allowedAccess = true;
         break;
      }
    }
    if(allowedAccess){
      console.log("U if-u allowedAccess2",allowedAccess)
      break;
    }
  }



   isAuthenticated = accessToken && accessToken.length > 0 && allowedAccess === true;
   console.log("Kada ima vise rola  isAuthenticated",isAuthenticated)
  }else{
    console.log("Pristup samo jednoj roli",roles)
     isAuthenticated = accessToken && accessToken.length > 0 && allowedRoles.includes(roles);
     console.log("U else isAuthenticated",isAuthenticated)

  }
 
console.log("Pred kraj isAuthenticated",isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace={true} />;
};

export default PrivateRoute;


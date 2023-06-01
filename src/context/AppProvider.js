import React, { Component,useState } from "react";
import AppContext from "./AppContext";
import jwt_decode from 'jwt-decode';
import { Outlet } from "react-router-dom";
import Cookies from 'universal-cookie';


class AppProvider extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        accessToken: "",
        roles: [],
        username: "",
      };
      this.cookies = new Cookies();
      this.setToken = this.setToken.bind(this);
    }

    async componentDidMount(){
      console.log("AppProvider->componentDidMount->accessToken",this.cookies.get('accessToken'));
      const coockieToken = await this.cookies.get('accessToken')
      if (typeof coockieToken !== 'undefined'){
        this.setToken(coockieToken)
      }
      
      
    }
    
    setToken = (token) => {
      this.setState({ accessToken: token },()=>{
        console.log("AppProvider->accessToken",this.state.accessToken)
      });
       
      // Extract roles and username from the access token
      if (token) {
        const decodedToken = jwt_decode(token);
        console.log("AppProvider>If*>decodedToken",decodedToken)

        const userInfo = decodedToken?.UserInfo;
  
        if (userInfo) {
          this.setState({
            roles: userInfo.roles,
            username: userInfo.username,
          });
        }
      }
    };
  
    render() {
      const { accessToken, roles, username } = this.state;
  
      const contextValues = {
        accessToken,
        roles,
        username,
      };
      {{console.log("contextValues",contextValues)}} 
      return (
      
        <AppContext.Provider value={contextValues}>
         {this.props.children}
        </AppContext.Provider>
      );
    }
  }

  export default AppProvider;

// const AppProvider = (props) => {
//   const [accessToken, setAccessToken] = useState(null);
//   const [roles, setRoles] = useState([]);
//   const [username, setUsername] = useState("");

//   const setToken = (token) => {
//     setAccessToken(token);

//     // Extract roles and username from the access token
//     if (token) {
//       const decodedToken = jwt.decode(token);
//       const userInfo = decodedToken?.UserInfo;

//       if (userInfo) {
//         setRoles(userInfo.roles);
//         setUsername(userInfo.username);
//       }
//     }
//   };

//   const contextValues = {
//     accessToken,
//     roles,
//     username,
//     setToken,
//   };

//   return (
//     <AppContext.Provider value={contextValues}>
//       <Outlet />
//     </AppContext.Provider>
//   );
// };

  

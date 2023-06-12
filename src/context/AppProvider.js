import React, { Component } from "react";
import AppContext from "./AppContext";
import jwt_decode from 'jwt-decode';
// import { Outlet } from "react-router-dom";
import Cookies from 'universal-cookie';


class AppProvider extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        accessToken: "",
        roles: [],
        username: "",
        email:""
      };
      this.cookies = new Cookies();
      this.setToken = this.setToken.bind(this);
    }

    async componentDidMount(){
      
      const coockieToken = await this.cookies.get('jwt')
      // console.log("AppProvider->componentDidMount->jwt",coockieToken);
      if (typeof coockieToken !== 'undefined'){
        this.setToken(coockieToken)
      }
      
      
    }
    
    setToken = (token) => {
      this.setState({ accessToken: token },()=>{
        console.log("AppProvider->accessToken",this.state.accessToken)
    
       
      // Extract roles and username from the access token
      if (token) {
        const decodedToken = jwt_decode(token);
        console.log("AppProvider>If*>decodedToken",decodedToken)

        const userInfo = decodedToken?.UserInfo;
  
        if (userInfo) {
          console.log("UserInfo",userInfo)
          this.setState({
            roles: userInfo.roles,
            username: userInfo.username,
            email:userInfo.email
          });
        }
      }
    });
    };
  
    render() {
      const { accessToken, roles, username,email } = this.state;
  
      const contextValues = {
        accessToken,
        roles,
        username,
        email
      };
      // {console.log("AppProvider-?this.props.children",this.props.children)}
      
      return (     
        accessToken  &&
          <AppContext.Provider value={contextValues}>
         {this.props.children}
        </AppContext.Provider>
      
      );
    }
  }

  export default AppProvider;

  

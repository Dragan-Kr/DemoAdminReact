import React, { Component } from "react";
import axios from "axios";


import {LOGIN_API} from "../globalVariables"



class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state={
    email:"",
    password:""
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this)
    this.handleLogin = this.handleLogin.bind(this);
  }


  handleEmail(event){
    console.log("EVENT",event.target.value)
   this.setState({email:event.target.value},()=>{
    console.log("email",this.state.email)
   });
  }


  handlePassword(event){

    this.setState({password:event.target.value},()=>{
        console.log("pass",this.state.password)
    })
  }

  handleLogin(){

    let logObject = {email:this.state.email,password:this.state.password}
   axios.post(LOGIN_API,logObject) .then((res) => {
    // window.location.replace(NEWS_LIST);
    console.log("logovan")
  })
  .catch((error) => {
    console.log(error.message);
  });

  }
  
  render() {
    return (
      <form>
        <div className="form-outline mb-4">
          <input type="email" id="form2Example1" className="form-control" onChange={this.handleEmail}/>
          <label className="form-label" htmlFor="form2Example1">
            Email address
          </label>
        </div>

        <div className="form-outline mb-4">
          <input type="password" id="form2Example2" className="form-control" onChange={this.handlePassword} />
          <label className="form-label" htmlFor="form2Example2">
            Password
          </label>
        </div>

        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="form2Example31"
                checked
              />
              <label className="form-check-label" htmlFor="form2Example31">
                {" "}
                Remember me{" "}
              </label>
            </div>
          </div>

          <div className="col">
            <a href="#!">Forgot password?</a>
          </div>
        </div>

        <button type="button" className="btn btn-primary btn-block mb-4" onClick={this.handleLogin}>
          Sign in
        </button>

        <div className="text-center">
          <p>
            Not a member? <a href="#!">Register</a>
          </p>
          <p>or sign up with:</p>
          <button type="button" className="btn btn-link btn-floating mx-1">
            <i className="fab fa-facebook-f"></i>
          </button>

          <button type="button" className="btn btn-link btn-floating mx-1">
            <i className="fab fa-google"></i>
          </button>

          <button type="button" className="btn btn-link btn-floating mx-1">
            <i className="fab fa-twitter"></i>
          </button>

          <button type="button" className="btn btn-link btn-floating mx-1">
            <i className="fab fa-github"></i>
          </button>
        </div>
      </form>
    );
  }
}


export default  LoginComponent;
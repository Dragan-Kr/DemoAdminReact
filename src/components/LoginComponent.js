import React, { Component } from "react";
import axios from "axios";
import { Alert } from "reactstrap";

import { LOGIN_API } from "../globalVariables";
import { NEWS_LIST } from "../globalVariables";
import { REGISTRATION } from "../globalVariables";

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showAlert: false,
      errorMessage: "",
     
    };
  
    this.handleLogin = this.handleLogin.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  

  handleLogin(e) {
    e.preventDefault();
    console.log("registarcija");
      let logObject = {
        email: this.state.email,
        password: this.state.password,
      };
      const config = {
        headers: {
          'Content-Type': 'application/json', // Specify the media type here
        },
      };
      axios.post(LOGIN_API, logObject,config) //nauci zasto ide post a ne get
        .then((res) => {
          window.location.replace(NEWS_LIST);
          console.log("RES", res);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            this.setState(
              { errorMessage: error.response.data.message, showAlert: true },
              () => {
                console.log("errorMessage", this.state.errorMessage);
              }
            );
          } else {
            this.setState({
              errorMessage: "Registration failed.",
              showAlert: true,
            });
          }
        });
    
  }
  onDismiss() {
    this.setState({ showAlert: false });
  }


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };


  render() { //sta je render,sta je dom u stvarnosti,kako sve to funkcionise
    return ( //upotreba ref-a
      <div>
        <div className="errorAlert">
          <Alert
            color="info"
            isOpen={this.state.showAlert}
            toggle={this.onDismiss}
          >
            {this.state.errorMessage}
          </Alert>
        </div>

        <form  className="login-form" onSubmit={this.handleLogin}>
          <div className="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              className="form-control"
              onChange={this.handleChange}
              name="email"
              onFocus={()=>{
                if(this.state.email === ''){
                  this.setState({errorMessage:"Fill the email field"},()=>{
                    this.setState({showAlert:true});
                  });
                 
                }
              }}
              required={true}

            />
            <label className="form-label" htmlFor="form2Example1">
              Email address
            </label>
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              className="form-control"
              onChange={this.handleChange}
              name="password"
              required={true}

            />
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
                  // checked
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

          <button
            type="submit"
            className="btn btn-primary btn-block mb-4"
            // onClick={(e) => this.handleLogin(e)}
          >
            Sign in
          </button>

          <div className="text-center">
            <p>
              Not a member? <a href={REGISTRATION}>Register</a>
            </p>
         
          </div>
        </form>
      </div>
    );
  }
}

export default LoginComponent;

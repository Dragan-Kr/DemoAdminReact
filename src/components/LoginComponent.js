import React, { Component } from "react";
import axios from "axios";
import { Alert } from "reactstrap";

import { LOGIN_API } from "../globalVariables";
import { NEWS_LIST } from "../globalVariables";
import { REGISTRATION } from "../globalVariables";
import Cookies from 'universal-cookie';

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showAlert: false,
      showAlertEmail:false,
      showAlertPassword:false,
      errorMessage: "",
    };
    this.dismissTimer = null;

    this.inputEmailRef = React.createRef();
    this.inputPasswordRef = React.createRef();
    this.cookies = new Cookies();
    this.handleLogin = this.handleLogin.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  

  componentDidUpdate(prevProps, prevState) {
    if (prevState.errorMessage !== this.state.errorMessage) {
      // Clear the previous timer if it exists
      clearTimeout(this.dismissTimer);

      // Show the alert for 3 seconds (3000 milliseconds)
      this.showAlertWithTimeout(this.state.errorMessage, 63000);
    }

    if(prevState.email !== this.state.email){
      this.setState({showAlertEmail:false})
    }
    if(prevState.password !== this.state.password){
      this.setState({showAlertPassword:false})
    }
  }

  showAlertWithTimeout(message, duration) {
    this.setState({
      // showAlert: true,
      showAlertEmail:true,
      showAlertPassword:true,
      errorMessage: message,
    });

    this.dismissTimer = setTimeout(() => {
      this.setState({ showAlert: false });
    }, duration);
  }

  

 async handleLogin(e) {
    e.preventDefault();
      let logObject = {
        email: this.state.email,
        password: this.state.password,
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
 // Specify the media type here
        }
      };
      
    await axios.post(LOGIN_API, logObject,config) //nauci zasto ide post a ne get
        .then((res) => {
          console.log("Login->Res",res.data.accessToken);
          this.cookies.set("jwt",res.data.accessToken)
          window.location.replace(NEWS_LIST);
          
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


  handleValidation = (event) => {
  
    if (event.target.id === "email") {
        this.inputEmailRef.current.focus();
    }
    if (event.target.id === "password") {
      this.inputPasswordRef.current.focus();
    }
  };


  
  handleInputBlur = (e) => { //ovo je ako preskocimo neko polje--treba dorada
    console.log("Blur->e",e.target.name)
    
     if(e.target.name ==="email" && this.state.email.trim()===''){
      this.setState({showAlertEmail:true})
    }
    if(e.target.name ==="password" && this.state.password.trim()===''){
      this.setState({showAlertPassword:true})
    }

  };


  render() { //sta je render,sta je dom u stvarnosti,kako sve to funkcionise

   
    const emailDivId = "email";
    const passwordDivId = "password";

    const skippedEmailField = "Fill the email field";
    const skippedPasswordField = "Fill the password field";
    return ( //upotreba ref-a
      <div>
       <div className="errorAlert">
         
         

          <div className="register-div-alert">
           
          </div>



        </div>

        <form  className="login-form" onSubmit={this.handleLogin}>
          <div className="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              className="form-control"
              onChange={this.handleChange}
              name="email"
              ref={this.inputEmailRef}
              
              onBlur={this.handleInputBlur}
              

            />
            <label className="form-label" htmlFor="form2Example1">
              Email address
            </label>
          </div>
            {this.state.errorMessage.email !== "" && (
              <div className="empty-field-login">
                {this.state.showAlertEmail && (
                         <p className="warning-paragraph"
                         id={emailDivId}
                        //  className="register-alert"
                         onClick={this.handleValidation}
                         readOnly={true}
                       >
                         {this.state.errorMessage.email ? this.state.errorMessage.email : skippedEmailField}
                       </p>
               
                )}
              </div>
            )}

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              className="form-control"
              onChange={this.handleChange}
              name="password"
              ref={this.inputPasswordRef}
              onBlur={this.handleInputBlur}
             

            />
            <label className="form-label" htmlFor="form2Example2">
              Password
            </label>
          </div>

          {this.state.errorMessage.password !== "" && (
              <div className="empty-field-login">
                {this.state.showAlertPassword && (
                <p
                id={passwordDivId}
                className="warning-paragraph"
                onClick={this.handleValidation}
              >
                {this.state.errorMessage.password || skippedPasswordField}
              </p>
                )}
              </div>
            )}

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

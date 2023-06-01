import React, { Component } from "react";
import axios from "axios";
import { Alert } from "reactstrap";

import { REGISTRATION_API } from "../globalVariables";
import { LOGIN_API } from "../globalVariables";


//SVAKI PUT KADA MI IZBACI UPOZORENJE I NAKON STO POPUNIM TO POLJE UPOZORENJE TREBA DA SE UGASI
class RegistrationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      password: "",
      showAlert: false,
      showAlertUserName:false,
      showAlertEmail:false,
      showAlertPassword:false,
      errorMessage: {}, // ako salje vise ->[]
    };
    this.dismissTimer = null;
    this.inputUserNameRef = React.createRef();
    this.inputEmailRef = React.createRef();
    this.inputPasswordRef = React.createRef();
    this.handleRegistration = this.handleRegistration.bind(this);
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

    if(prevState.userName !== this.state.userName){
      this.setState({showAlertUserName:false})
    }
    if(prevState.email !== this.state.email){
      this.setState({showAlertEmail:false})
    }
    if(prevState.password !== this.state.password){
      this.setState({showAlertPassword:false})
    }
  }
  componentDidMount() {
    // this.inputUserNameRef.current.focus(); // Focus the userName input field when the component mounts
  }



  showAlertWithTimeout(message, duration) {
    this.setState({
      // showAlert: true,
      showAlertUserName: true,
      showAlertEmail:true,
      showAlertPassword:true,
      errorMessage: message,
    });

    this.dismissTimer = setTimeout(() => {
      this.setState({ showAlert: false });
    }, duration);
  }

  handleRegistration(e) {
    e.preventDefault();
    console.log("registarcija");

    const config = {
      headers: {
        "Content-Type": "application/json", // Specify the media type here
      },
    };
   axios
      .post(
        REGISTRATION_API,
        {
          userName: this.state.userName,
          email: this.state.email,
          password: this.state.password,
        },
        config
      )
      .then((res) => {
        // window.location.replace(LOGIN_API);

        console.log("RES", res);
      })
      .catch((error) => {
        console.log("ERRROOR", error.response.data.message);
        this.setState({ errorMessage: error.response.data.message }, () => {
          console.log("errorMessage", this.state.errorMessage);
        });
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
    if (event.target.id === "userName") {
      this.inputUserNameRef.current.focus();
    }
    if (event.target.id === "email") {
      this.inputEmailRef.current.focus();
    }
    if (event.target.id === "password") {
      this.inputPasswordRef.current.focus();
    }
  };


  handleInputBlur = (e) => { //ovo je ako preskocimo neko polje--treba dorada
    console.log("Blur->e",e.target.name)
    if (e.target.name === "userName" && this.state.userName.trim() === '') {
      this.setState({ showAlertUserName: true });
    } 
     if(e.target.name ==="email" && this.state.email.trim()===''){
      this.setState({showAlertEmail:true})
    }
    if(e.target.name ==="password" && this.state.password.trim()===''){
      this.setState({showAlertPassword:true})
    }

  };

  render() {
    const userNameDivId = "userName";
    const emailDivId = "email";
    const passwordDivId = "password";
    

    const skippedUserNameField= "Fill the user name field";
    const skippedEmailField = "Fill the email field";
    const skippedPasswordField = "Fill the password field";

    
    return (
      <div>
        <div className="errorAlert">
          <div className="register-div-alert">
            {this.state.errorMessage.userName !== "" && (
              <div>
                {this.state.showAlertUserName && (
                  <input
                    type="text"
                    id={userNameDivId}
                    className="register-alert"
                    onClick={this.handleValidation}
                    value={this.state.errorMessage.userName ? this.state.errorMessage.userName : skippedUserNameField}
                    readOnly={true}
                  />
                )}
              </div>
            )}
          </div>
          <div className="register-div-alert">
            {this.state.errorMessage.email !== "" && (
              <div>
                {this.state.showAlertEmail && (
                  <input
                    type="text"
                    id={emailDivId}
                    className="register-alert"
                    onClick={this.handleValidation}
                    value={this.state.errorMessage.email ? this.state.errorMessage.email : skippedEmailField}
                    readOnly={true}
                  />
                )}
              </div>
            )}
          </div>

          <div className="register-div-alert">
            {this.state.errorMessage.password !== "" && (
              <div>
                {this.state.showAlertPassword && (
                  <input
                    type="text"
                    id={passwordDivId}
                    className="register-alert"
                    onClick={this.handleValidation}
                    value={this.state.errorMessage.password ?this.state.errorMessage.password :skippedPasswordField}
                    readOnly={true}
                  />
                )}
              </div>
            )}
          </div>



        </div>
        <section className="">
          <div
            className="px-4 py-5 px-md-5 text-center text-lg-start"
            style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
          >
            <div className="container">
              <div className="row gx-lg-5 align-items-center">
                <div className="col-lg-6 mb-5 mb-lg-0">
                  <div className="card">
                    <div className="card-body py-5 px-md-5">
                      <form>
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <div className="userName-prop">
                              <div className="form-outline">
                                <input
                                  type="text"
                                  id="form3Example1"
                                  className="form-control"
                                  onChange={this.handleChange}
                                  name="userName"
                                  ref={this.inputUserNameRef}
                                  onBlur={this.handleInputBlur}
                                />
                                <label
                                  className="form-label"
                                  htmlFor="form3Example1"
                                >
                                  userName
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="form3Example3"
                            className="form-control"
                            onChange={this.handleChange}
                            name="email"
                            ref={this.inputEmailRef}
                            onBlur={this.handleInputBlur}
                            
                          />
                          <label className="form-label" htmlFor="form3Example3">
                            Email address
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="current-password"
                            id="form3Example4"
                            className="form-control"
                            onChange={this.handleChange}
                            name="password"
                            ref={this.inputPasswordRef}
                            onBlur={this.handleInputBlur}
                            required={true}
                          />
                          <label className="form-label" htmlFor="form3Example4">
                            Password
                          </label>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-block mb-4"
                          onClick={(e) => this.handleRegistration(e)}
                        >
                          Sign up
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default RegistrationComponent;

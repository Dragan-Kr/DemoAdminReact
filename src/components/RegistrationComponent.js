import React, { Component } from "react";
import axios from "axios";
import { Alert } from "reactstrap";

import { REGISTRATION_API } from "../globalVariables";
import { NEWS_LIST } from "../globalVariables";

class RegistrationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      password: "",
      showAlert: false,
      errorMessage: "",
    };

    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  handleUserNameChange(event) {
    this.setState({ userName: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleRegistration(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("registarcija");
    if (
      this.state.userName === "" &&
      this.state.email === "" &&
      this.state.password === ""
    ) {
      window.alert("Fill the UserName, Email and Password filds");
      return;
    } else if (this.state.userName === "") {
      window.alert("Fill the UserName field");
      return;
    } else if (this.state.email === "") {
      window.alert("Fill the Email field");
      return;
    } else if (this.state.password === "") {
      window.alert("Fill the Password field");
      return;
    } else if (!emailRegex.test(this.state.email)) {
      window.alert("Fill the Email field in correct format");
      return;
    } else {
      axios
        .post(REGISTRATION_API, {
          userName: this.state.userName,
          email: this.state.email,
          password: this.state.password,
        })
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
            this.setState({ errorMessage: error.response.data.message,showAlert:true },()=>{
              console.log("errorMessage",this.state.errorMessage)
            });
          } else {
            this.setState({ errorMessage: "Registration failed.",showAlert:true });
          }
        });
    }
  }

  onDismiss() {
    console.log("onDismis")
    this.setState({ showAlert: false });
  }

  render() {
    return (
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
       

        <section className="">
          <div
            className="px-4 py-5 px-md-5 text-center text-lg-start"
            style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
          >
            <div className="container">
              <div className="row gx-lg-5 align-items-center">
                <div className="col-lg-6 mb-5 mb-lg-0">
                  <h1 className="my-5 display-3 fw-bold ls-tight">
                    Nova.Media the best offer <br />
                    <span className="text-primary">for your business</span>
                  </h1>
                  <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                    quibusdam tempora at cupiditate quis eum maiores libero
                    veritatis? Dicta facilis sint aliquid ipsum atque?
                  </p>
                </div>

                <div className="col-lg-6 mb-5 mb-lg-0">
                  <div className="card">
                    <div className="card-body py-5 px-md-5">
                      <form>
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <input
                                type="text"
                                id="form3Example1"
                                className="form-control"
                                onChange={this.handleUserNameChange}
                              />
                              <label
                                className="form-label"
                                htmlFor="form3Example1"
                              >
                                userName
                              </label>
                            </div>
                          </div>
                          {/* <div className="col-md-6 mb-4"> */}
                          {/* <div className="form-outline">
                              <input
                                type="text"
                                id="form3Example2"
                                className="form-control"
                              />
                              <label className="form-label" htmlFor="form3Example2">
                                Last name
                              </label>
                            </div> */}
                          {/* </div> */}
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="form3Example3"
                            className="form-control"
                            onChange={this.handleEmailChange}
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
                            onChange={this.handlePasswordChange}
                          />
                          <label className="form-label" htmlFor="form3Example4">
                            Password
                          </label>
                        </div>

                        <div className="form-check d-flex justify-content-center mb-4">
                          {/* <input
                            className="form-check-input me-2"
                            type="checkbox"
                            value=""
                            id="form2Example33"
                            checked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form2Example33"
                          >
                            Subscribe to our newsletter
                          </label> */}
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary btn-block mb-4"
                          onClick={(e) => this.handleRegistration(e)}
                        >
                          Sign up
                        </button>

                        <div className="text-center">
                          <p>or sign up with:</p>
                          <button
                            type="button"
                            className="btn btn-link btn-floating mx-1"
                          >
                            <i className="fab fa-facebook-f"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-link btn-floating mx-1"
                          >
                            <i className="fab fa-google"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-link btn-floating mx-1"
                          >
                            <i className="fab fa-twitter"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-link btn-floating mx-1"
                          >
                            <i className="fab fa-github"></i>
                          </button>
                        </div>
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

import React, { Component } from "react";
import axios from "axios";

import { LOGIN_API } from "../globalVariables";
import { NEWS_LIST } from "../globalVariables";
import { Alert } from "reactstrap";

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showAlert: false,
      errorMessage: "",
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  handleEmail(event) {
    console.log("EVENT", event.target.value);
    this.setState({ email: event.target.value }, () => {
      console.log("email", this.state.email);
    });
  }

  handlePassword(event) {
    this.setState({ password: event.target.value }, () => {
      console.log("pass", this.state.password);
    });
  }

  handleLogin(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("registarcija");
    if (this.state.email === "" && this.state.password === "") {
      window.alert("Fill the Email and Password filds");
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
      let logObject = {
        email: this.state.email,
        password: this.state.password,
      };
      axios
        .post(LOGIN_API, logObject)
        .then((res) => {
          window.location.replace(NEWS_LIST);
          console.log("RES", res);
        })
        .catch((error) => {
          console.log("Error",error)
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
  }
  onDismiss() {
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
          </Alert>{" "}
        </div>

        <form>
          <div className="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              className="form-control"
              onChange={this.handleEmail}
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
              onChange={this.handlePassword}
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
            type="button"
            className="btn btn-primary btn-block mb-4"
            onClick={(e) => this.handleLogin(e)}
          >
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
      </div>
    );
  }
}

export default LoginComponent;

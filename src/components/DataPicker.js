import React from "react";
import ReactDOM from "react-dom";

function validate(email, password) {
  // true means invalid, so our conditions got reversed
  return {
    email: email.length === 0,
    password: password.length === 0
  };
}

export default class SignUpForm extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",

      everFocusedEmail: false,
      everFocusedPassword: false,
      inFocus: ""
    };
  }

  handleEmailChange = evt => {
    this.setState({ email: evt.target.value });
  };

  handlePasswordChange = evt => {
    this.setState({ password: evt.target.value });
  };

  handleSubmit = evt => {
    if (!this.canBeSubmitted()) {
      evt.preventDefault();
      return;
    }
    const { email, password } = this.state;
    alert(`Signed up with email: ${email} password: ${password}`);
  };

  canBeSubmitted() {
    const errors = validate(this.state.email, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }

  render() {
    const errors = validate(this.state.email, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className={errors.email ? "error" : ""}
          type="text"
          placeholder="Enter email"
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
        <input
          className={errors.password ? "error" : ""}
          type="password"
          placeholder="Enter password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
        />
        <button disabled={isDisabled}>Sign up</button>
      </form>
    );
  }
}




// import React, { Component } from "react";

// class DataPicker extends Component {
//   constructor(props) {
//     super(props);

//     this.userNameRef = React.createRef();
//     this.emailRef = React.createRef();
//     this.passwordRef = React.createRef();

//     this.state = {
//       userNameError: false,
//       emailError: false,
//       passwordError: false
//     };
//   }

//   handleRegistration = (e) => {
//     e.preventDefault();

//     const userName = this.userNameRef.current.value;
//     const email = this.emailRef.current.value;
//     const password = this.passwordRef.current.value;

//     let hasError = false;

//     if (!userName) {
//       this.setState({ userNameError: true });
//       hasError = true;
//     } else {
//       this.setState({ userNameError: false });
//     }

//     if (!email) {
//       this.setState({ emailError: true });
//       hasError = true;
//     } else {
//       this.setState({ emailError: false });
//     }

//     if (!password) {
//       this.setState({ passwordError: true });
//       hasError = true;
//     } else {
//       this.setState({ passwordError: false });
//     }

//     if (hasError) {
//       return;
//     }

//     // Perform registration logic
//     // ...
//   };

//   render() {
//     const { userNameError, emailError, passwordError } = this.state;

//     return (
//       <div>
//         <form>
//           <div>
//             <label>Username:</label>
//             <input
//               type="text"
//               ref={this.userNameRef}
//               onFocus={() => this.setState({ userNameError: false })}
//             />
//             {userNameError && <span className="error">Please provide a username.</span>}
//           </div>
//           <div>
//             <label>Email:</label>
//             <input
//               type="email"
//               ref={this.emailRef}
//               onFocus={() => this.setState({ emailError: false })}
//             />
//             {emailError && <span className="error">Please provide an email.</span>}
//           </div>
//           <div>
//             <label>Password:</label>
//             <input
//               type="password"
//               ref={this.passwordRef}
//               onFocus={() => this.setState({ passwordError: false })}
//             />
//             {passwordError && <span className="error">Please provide a password.</span>}
//           </div>
//           <button type="submit" onClick={this.handleRegistration}>
//             Register
//           </button>
//         </form>
//       </div>
//     );
//   }
// }
// export default DataPicker;

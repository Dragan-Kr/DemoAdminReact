import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import AppContext from "../context/AppContext";

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

    this.clickOnButton = this.clickOnButton.bind(this)
  }
  static contextType = AppContext;


 async componentDidMount(){
    const contextValue = this.context;

  const config = {
    headers: {
      Authorization: `Bearer ${contextValue.accessToken}`,
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json', // Set the default Content-Type header

    },
  };
     console.log("ContextValue",contextValue)

    await axios.get("http://localhost:8000/api/post",config).then ((res)=>{
     console.log("ovo je res",res)
    }).catch((err)=>{

    })
  }


 async clickOnButton (e) {
//   const contextValue = this.context;

//   const config = {
//     headers: {
//       Authorization: `Bearer ${contextValue.accessToken}`,
//       // 'Content-Type': 'application/x-www-form-urlencoded'
//       'Content-Type': 'application/json', // Set the default Content-Type header

//     },
//   };
// console.log("ContextValue",contextValue)
//   e.preventDefault();
//     await axios.get("http://localhost:8000/api/writer",config).then ((res)=>{
// console.log("ovo je res",res)
//     }).catch((err)=>{

//     })
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
          
         
        />
        <button onClick={this.clickOnButton}>Klikni</button>
       
      </form>
    );
  }
}



// export default class DataPicker extends React.Component {
//   componentDidMount() {
//     console.log('Component mounted!');
//   }

//   render() {
//     return <div>My Component</div>;
//   }
// }
import React, { Component } from "react";
import Switch from "react-switch";

class SwitchBooleanComponent extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
  }




  render() {

    return (
        <div className="form-group"> 
            <label>
       
        <Switch onChange={this.handleChange} checked={this.state.checked} />
      </label>
        </div>
      
    );
  }
}
export default SwitchBooleanComponent




// import React, { useState } from "react";
// import { MultiSelect } from "react-multi-select-component";

// const options = [
//   { label: "Grapes 🍇", value: "grapes" },
//   { label: "Mango 🥭", value: "mango" },
//   { label: "Strawberry 🍓", value: "strawberry", disabled: true },
// ];


// const colourStyles = {
//   control: styles => ({ ...styles, backgroundColor: ' #F4F5FC',borderRadius: 15,height:50,border:0 }),
//   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
//     return (
//     {  ...styles,
//       backgroundColor: '#F4F5FC',
//       color: '#6D7587',
//     }
//     );
//   },
  
  
// };



// const MultipleSelection = () => {
//   const [selected, setSelected] = useState([]);

//   return (
//     <div>
     
   
//       <MultiSelect 
//         options={options}
//         value={selected}
//         onChange={setSelected}
//         labelledBy="Select"
//         styles={{backgroundColor:"red"}}
//       />
//     </div>
//   );
// };

// export default MultipleSelection;



import React, { useState } from "react";
// import "./styles.css";
import Select from "react-select";





const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: '#F4F5FC',borderRadius: 15,height:50,border:0 }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return (
    {  ...styles,
      backgroundColor: '#F4F5FC',
      color: '#6D7587',
    }
    );
  },
  
  
};



 function MultipleSelection() {
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState();

  // Array of all options
  const optionList = [
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
    { value: "white", label: "White" }
  ];

  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
  }
  return (
    <div className="app">
      <div className="dropdown-container">
        <Select
          options={optionList}
          placeholder="Select category"
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
          isMulti
          styles={colourStyles}
        />
      </div>
    </div>
  );
}

export default MultipleSelection;
import React, { useState } from "react";

const Search = ({ onChange }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const onInputChange = value => {
        setSearchTerm(value);
        onChange(value);
        console.log("Search=>searchTerm",value)
    };
    return (
        <input
            type="text"
            className="form-control1"
           //s style={{ width: "240px" }}
            placeholder="Filter results"
            value={searchTerm}
            onChange={e => onInputChange(e.target.value)}
        />
    );
};

export default Search;
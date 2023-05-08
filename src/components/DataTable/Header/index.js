import React  from "react";

import Arrows from "../../../images/arrows.svg";

import IsvgComponent from "../../IsvgComponent";

const Header = ({ headers, onSorting, setSorting }) => {
  const onSortingChange = (field) => {
    setSorting((prev) => {
      return { field: field, order: prev.order === "asc" ? "desc" : "asc" };
    });
  };

  return (
    <thead>
      <tr>
        {headers.map(({ name, field, sortable }) => (
          <th
            key={name}
            onClick={() => (sortable ? onSortingChange(field) : null)}
          >
            {name === "Action" ? (
              "Action"
            ) : (
              <IsvgComponent name={name} image={Arrows} />
            )}

            {/* {sortingField && sortingField === field && (
                            
                                    sortingOrder === "asc"
                                        ?  <Isvg  src={Arrows}/>
                                        :  <Isvg src={Arrows}/>
                                
                            
                            
                        )}
                        <Isvg  src={ArraowUp}/> */}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Header;

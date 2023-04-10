import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArraowUp from '../../../images/sortArrowUp.svg';
import ArraowDown from '../../../images/sortArrowDown.svg';
import Isvg from 'react-inlinesvg';
import Arrows from '../../../images/arrows.svg';

import IsvgComponent from "../../IsvgComponent";

const Header = ({ headers, onSorting }) => {
    const [sortingField, setSortingField] = useState("");
    const [sortingOrder, setSortingOrder] = useState("asc");

    const onSortingChange = (field) => {
        const order =
            field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

        setSortingField(field);
        setSortingOrder(order);
        onSorting(field, order);
    };

    return (
        <thead>
            <tr>
                {headers.map(({ name, field, sortable }) => (
                    <th
                        key={name}
                        onClick={() =>
                            sortable ? onSortingChange(field) : null
                        }
                    >
                        {name==="Action" ?"Action": <IsvgComponent name={name} image={Arrows}/> }
                        
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
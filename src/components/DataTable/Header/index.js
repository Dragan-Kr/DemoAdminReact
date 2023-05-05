import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArraowUp from '../../../images/sortArrowUp.svg';
import ArraowDown from '../../../images/sortArrowDown.svg';
import Isvg from 'react-inlinesvg';
import Arrows from '../../../images/arrows.svg';

import IsvgComponent from "../../IsvgComponent";



const Header = ({ headers, onSorting, setSorting }) => {
    // const [sortingField, setSortingField] = useState("");
    // const [sortingOrder, setSortingOrder] = useState("asc");



    const onSortingChange = (field) => {
        // console.log("Header->onSortingChange->field",field)
        // console.log("Header1->onSortingChange->SortingOrder",sortingOrder);
        // console.log("Header2->onSortingChange->SortingField",sortingField);

        // console.log("Ulazak u sortiranje");

        // const order =  field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
        // const order = sortingOrder === "asc" ? "desc" : "asc"


        // console.log("Header->onSortingChange->order",sortingOrder)

        setSorting(prev=>{return{field: field, order: prev.order === "asc"?"desc":"asc"}})
        
        // setSortingField(field);
        // setSortingOrder(prev=> prev === "asc"? "desc": "asc");

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



// const Header = ({ headers, onSorting }) => {
//     const [sortingField, setSortingField] = useState("");
//     const [sortingOrder, setSortingOrder] = useState("asc");

//     const onSortingChange = (field) => {
//         const order =
//             field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

//         setSortingField(field);
//         setSortingOrder(order);
//         onSorting(field, order);
//     };

//     return (
//         <thead>
//             <tr>
//                 {headers.map(({ name, field, sortable }) => (
//                     <th
//                         key={name}
//                         onClick={() =>
//                             sortable ? onSortingChange(field) : null
//                         }
//                     >
//                         {name==="Action" ?"Action": <IsvgComponent name={name} image={Arrows}/> }
                        
//                         {/* {sortingField && sortingField === field && (
                            
//                                     sortingOrder === "asc"
//                                         ?  <Isvg  src={Arrows}/>
//                                         :  <Isvg src={Arrows}/>
                                
                            

                            
//                         )}
//                         <Isvg  src={ArraowUp}/> */}
//                     </th>
//                 ))}
//             </tr>
//         </thead>
//     );
// };

// export default Header;
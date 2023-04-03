import React, { useEffect, useState, useMemo } from "react";
// import Header from "components/Header";
// import Header from '../.././components/DataTable/Header';
import { TableHeader, Pagination, Search } from "../.././components/DataTable";
// import useFullPageLoader from "hooks/useFullPageLoader";
import useFullPageLoader from "../../hooks/useFullPageLoader";
// import ExternalInfo from "components/ExternalInfo";
// import AppConfig from "App.config";
import PostService from '../../services/PostService';

import DateFormat from 'dateformat';
import Isvg from 'react-inlinesvg';


import HeadPhone from '../../images/headPhone.svg';
import Doots from '../../images/doots.svg';
import Select from 'react-select';
import Pen from '../../images/pen.svg';
import Trash from '../../images/trash.svg';
/////////////////////////////ORIGINALNI KOD*///////////////////////////////////////



const DataTable = () => {
    const [comments, setComments] = useState([]);
    // const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    //  const [itemsPerPage,setItemsPerPage] = useState(2);

    const headers = [
        { name: "NO.", field: "index", sortable: true },
        { name: "Title", field: "title", sortable: true },
        { name: "ShortDescription", field: "shortDescription", sortable: true },
        { name: "Date", field: "postDate", sortable: true },
        { name: "Time", field: "postDate", sortable: true },
        { name: "Action", field: "", sortable: false },


    ];

    const options = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
    ];

    const [perPage, setPerPage] = useState(options[1].value);

    useEffect(() => {
        const getData = () => {
            // showLoader();

            fetch("http://localhost:8000/api/post")
                .then(response => response.json())
                .then(json => {
                    // hideLoader();
                    setComments(json.posts);

                    console.log(json.posts);
                });
        };

        getData();
    }, []);

    const commentsData = useMemo(() => {
        let computedComments = comments;





        if (search) {
            computedComments = computedComments.filter(
                comment =>
                    comment.title.toLowerCase().includes(search.toLowerCase()) ||
                    comment.shortDescription.toLowerCase().includes(search.toLowerCase())
                // comment.postDate.includes(search.t)
            );
        }

        setTotalItems(computedComments.length);

        //Sorting comments
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }
        console.log(computedComments)
        //Current Page slice
        return computedComments.slice(
            (currentPage - 1) * perPage,
            (currentPage - 1) * perPage + perPage
        );
    }, [comments, currentPage, search, sorting]);



    ////TOP PART////


    // const options = [
    //     { label: "1", value: "1" },
    //     { label: "2", value: "2" },
    //     { label: "3", value: "3" },
    // ];

    // const [perPage, setPerPage] = useState(options[1].value);


    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: ' #FFFFFF', borderRadius: 15, height: 50, width: 100, border: 0, dropdownIndicator: { dropdownIndicatorStyles } }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return (
                {
                    ...styles,
                    backgroundColor: '#FFFFFF',
                    color: '#6D7587',//BOJA OD BROJEVA

                    dropdownIndicator: { dropdownIndicatorStyles }
                }
            );
        },


    };



    const dropdownIndicatorStyles = (base, state) => {
        let changes = {
            // all your override styles
            backgroundColor: "green"
        };
        return Object.assign(base, changes);
    };



    ////TOP PART////

   








    return (
        <>
            <div className="row w-100">
                <div className="col mb-3 col-12 text-center">
                    <div className="row">

                        <div>

                            <div className="news-list-search">
                                <Search
                                    onSearch={value => {
                                        setSearch(value);
                                        setCurrentPage(1);
                                    }}
                                />


                            </div>


                            <div className="news-list-drop-down">
                                <div className="drop-down-left-word">
                                    <label>Show </label>

                                </div>

                                <Select
                                    options={options}
                                    styles={colourStyles}
                                    defaultValue={options}
                                    value={options.find(option => option.value === perPage)}
                                    onChange={option => setPerPage(option.value)}
                                />
                                <div className="drop-down-right-word"> <label className="drop-down-right-word">entries</label>  </div>


                            </div>

                        </div>
                    </div>

                    <table className="table table-striped">
                        <TableHeader
                            headers={headers}
                            onSorting={(field, order) =>
                                setSorting({ field, order })
                            }
                        />
                        <tbody>
                            {commentsData.length > 0 && commentsData.map((comment) => (

                                <tr>
                                    <th scope="row" key={comment._id}>
                                        {comment.index}

                                    </th>
                                    <td>{comment.title}</td>
                                    <td>{comment.shortDescription}</td>
                                    <td>{DateFormat(comment.postDate, "mm.dd.yyyy")}</td>
                                    <td>{DateFormat(comment.postDate, "h:MM")} h</td>
                                    <td>
                                        <Isvg className='isvg-pen-update' src={Pen} />
                                        <Isvg className='isvg-pen-delete' src={Trash} />


                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="col-md-6">
                        <Pagination
                            total={totalItems}
                            itemsPerPage={perPage}
                            currentPage={currentPage}
                            onPageChange={page => setCurrentPage(page)}

                        />
                        <div> <p className="last-paragraph">Showing {perPage} of {comments.length} entries</p> </div>
                    </div>
                    {/* <p className="last-paragraph">Showing 1 to {perPage} of {comments.length} entries</p> */}
                </div>
            </div>
            {/* {loader} */}
        </>
    );
};

export default DataTable;
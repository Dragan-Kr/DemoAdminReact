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



import Select from 'react-select';
import Pen from '../../images/pen.svg';
import Trash from '../../images/trash.svg';
import SortArrowUp from '../../images/sortArrowUp.svg';
import PagiantionArrow from '../../images/paginationArrow.svg';
import Magnifying from '../../images/magnifying.svg';

// import { useNavigate } from 'react-router-dom';


///Modal////
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import debounce from 'lodash/debounce';
import axios from 'axios';

const DataTable = () => {

    const headers = [
        { name: "NO.", field: "index", sortable: true, img: SortArrowUp },
        { name: "Title", field: "title", sortable: true },
        // { name: "ShortDescription", field: "shortDescription", sortable: true },
        { name: "Date", field: "postDate", sortable: true },
        { name: "Time", field: "postDate", sortable: true },
        { name: "Action", field: "", sortable: false },

    ];

    const options = [
        { label: "5", value: 5 },
        { label: "8", value: 8 },
        { label: "10", value: 10 },
    ];

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    // const [sortField, setSortField] = useState("");//STOJALO TITLE
    // const [sortOrder, setSortOrder] = useState('asc');
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const [pageSize, setPageSize] = useState(options[0].value);
    const[allDataLength,setAllDataLength] = useState(0);

    ////
   
    const [show, setShow] = useState(false);
    const [deletePost, setDeletePost] = useState("");
    const [totalItems, setTotalItems] = useState(0);


  


    useEffect(() => {
        let res;
        if(searchTerm.length !==0){ 
            console.log("USAO U IF U useEffect")
            
            const search = debounce(async() => {
             res = await axios.get(`http://localhost:8000/api/post?page=${currentPage}&limit=${pageSize}&sortField=${sorting.field}&sortOrder=${sorting.order}&searchTerm=${searchTerm}`);
             setPosts(res.data.data);
             setTotalItems(res.data.data.length);
             setTotalPages(res.data.totalPages);
             setAllDataLength(res.data.allDataLength);
             setLoading(false);
          }, 1000);

          search();
        }
        else{ 
        const fetchData = async () => {
            setLoading(true);
            // const res = await axios.get(`http://localhost:8000/api/post?page=${currentPage}&limit=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&searchTerm=${searchTerm}`);
            res = await axios.get(`http://localhost:8000/api/post?page=${currentPage}&limit=${pageSize}&sortField=${sorting.field}&sortOrder=${sorting.order}&searchTerm=${searchTerm}`);
            console.log('RES',res)
            setPosts(res.data.data);
            setTotalItems(res.data.data.length);
            setTotalPages(res.data.totalPages);
            setAllDataLength(res.data.allDataLength);
            console.log("SORT FIELD",sorting.field)
            console.log("SORT ORDER",sorting.order)
            setLoading(false);
            
        };
        fetchData();
    }
       

    }, [currentPage, pageSize, sorting.field, sorting.order, searchTerm]);

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    // const handlePageSizeChange = (event) => {
    //     setPageSize(parseInt(event.target.value, 10));
    //     setCurrentPage(1);
    // };

    // const handleSortChange = (event) => {
    //     const sort = event.target.value.split(":");
    //     setSortField(sort[0]);
    //     setSortOrder(parseInt(sort[1], 10));
    //     setCurrentPage(1);
    // };

    // const handleSearchChange = (event) => {
    //     setSearchTerm(event.target.value);
    //     setCurrentPage(1);
    // };

    const handleClose = () => {
        setShow(false);
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    if (posts.length === 0) {
        return <div>No posts found.</div>;
    }


    const handleDeletePost = () => {
        PostService.deletePost(deletePost._id).then((res) => {
            setPosts(posts.filter((comment) => comment._id !== deletePost._id));
        });
        setShow(false);
    };

    const handleClickDelete = (post) => {
        setShow(true);
        setDeletePost(post);
    }


    const editPost = (_id) => {
        console.log("Ovo je _id iz editPost", _id);
        window.location.replace(`http://localhost:3000/update-news/${_id}`);

        // navigate('/update-news/');
    }

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

    return (
        <>
            <div className="row w-100">
                {/* Delete dialog */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to delete {deletePost.title} item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Be careful</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeletePost}>
                            OK
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete dialog */}

                <div className="col mb-3 col-12 text-center">
                    <div className="row">
                        <div className="top-serach-items">
                            <div className="news-list-drop-down">
                                <div className="news-list-drop">
                                    <div className="drop-down-left-word">
                                        <label>Show </label>

                                    </div>

                                    <Select //ranije bilo-BROJ ELEMENATA PO STRANICI
                                        options={options}
                                        styles={colourStyles}
                                        defaultValue={pageSize}
                                        value={options.find(option => option.value === pageSize)}
                                        onChange={option => setPageSize(option.value)}
                                        
                                    />  
                                    <div className="drop-down-right"> <label className="drop-down-right-word">entries</label>
                                    </div>
                                </div>


                                {/* <div className="news-list-search"> */}
                                <div className="search">
                                    {/* {!isTyped && <Isvg className="" src={Magnifying} />} */}
                                    <Isvg className="" src={Magnifying} />

                                    <Search
                                        onChange={value => {
                                            setSearchTerm(value);
                                            setCurrentPage(1);   
                                        }}
                                    />
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table className="table table-striped">
                            {/* <TableHeader
                                headers={headers}
                                
                                onSorting={(setSortField, setSortOrder)}
                            /> */}
                             <TableHeader
                                headers={headers}
                                onSorting={(field, order) =>
                                    setSorting({ field, order })
                                }
                                />
                            <tbody>
                                {posts.length > 0 ? posts.map((comment) => (
                                    <tr>
                                        <th scope="row" key={comment._id}>
                                            {comment.index}
                                        </th>
                                        <td className="title-td">{comment.title}</td>
                                        {/* <td>{comment.shortDescription}</td> */}
                                        <td>{DateFormat(comment.postDate, "mm.dd.yyyy")}</td>
                                        <td>{DateFormat(comment.postDate, "h:MM")} h</td>
                                        <td>
                                            <div className="update-delete-img-div">
                                                <button onClick={() => editPost(comment._id)}><Isvg className='isvg-pen-update' src={Pen} /></button>

                                                <button onClick={() => handleClickDelete(comment)}>
                                                    <Isvg className='isvg-pen-delete' src={Trash} />
                                                </button>
                                            </div>

                                        </td>
                                    </tr>
                                )) : <div><h1>NOTHING TO SHOW</h1></div>}
                            </tbody>
                            {/* <div> <p className="last-paragraph">Showing 1 to {perPage} of {comments.length} entries</p> </div> */}
                        </table>
                    </div>
                    <div className="col-md-6">
                        <Pagination
                            total={allDataLength}
                            itemsPerPage={pageSize}
                            currentPage={currentPage}
                            onPageChange={page => setCurrentPage(page)} //setPage na tutorialu
                        />
                    </div>

                </div>
            </div>
            <div> <p className="last-paragraph">Showing 1 to {pageSize} of {allDataLength} entries</p> </div>

        </>
    );
};

export default DataTable;


































///Modal///

/////////////////////////////ORIGINALNI KOD/////////////////////////////////////////



// const DataTable = () => {
//     const [comments, setComments] = useState([]);
//     // const [loader, showLoader, hideLoader] = useFullPageLoader();
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [sorting, setSorting] = useState({ field: "", order: "" });
//     const [isTyped, setIsTyped] = useState(false);

//     //Delete dialog-modal//
//     const [show, setShow] = useState(false);
//     const [deletePost, setDeletePost] = useState("");
//     //Delete dialog-modal//

//     // const navigate = useNavigate();
//     //  const [itemsPerPage,setItemsPerPage] = useState(2);

//     const headers = [
//         { name: "NO.", field: "index", sortable: true, img: SortArrowUp },
//         { name: "Title", field: "title", sortable: true },
//         // { name: "ShortDescription", field: "shortDescription", sortable: true },
//         { name: "Date", field: "postDate", sortable: true },
//         { name: "Time", field: "postDate", sortable: true },
//         { name: "Action", field: "", sortable: false },


//     ];

//     const options = [
//         { label: "5", value: 5 },
//         { label: "8", value: 8 },
//         { label: "10", value: 10 },
//     ];

//     const [perPage, setPerPage] = useState(options[0].value);

//     useEffect(() => {
//         const getData = () => {
//             // showLoader();
//            const params = new URLSearchParams(window.location.search);
//            const page = parseInt(params.get('page')) || 1;

//             fetch("http://localhost:8000/api/post")
//                 .then(response => response.json())
//                 .then(json => {
//                     // hideLoader();
//                     setComments(json.posts);

//                     console.log(json.posts);
//                 });


//                 //////
//                if (page !== this.state.pager.currentPage) {
//                 fetch(`http://localhost:8000/api/post?page=${page}`, { method: 'GET' })
//                 .then(response => response.json())
//                 .then(({pager, pageOfItems}) => {
//                     this.setState({ pager, pageOfItems });
//                 });
//         }

//         };

//         getData();
//     }, []);




//     const commentsData = useMemo(() => {
//         let computedComments = [];
//         if (comments.length > 0) {
//             computedComments = comments;
//             if (search) {
//                 computedComments = computedComments.filter(
//                     comment =>
//                         comment.title.toLowerCase().includes(search.toLowerCase()) ||
//                         comment.shortDescription.toLowerCase().includes(search.toLowerCase())
//                     // comment.postDate.includes(search.t)
//                 );
//             }

//             setTotalItems(computedComments.length);

//             //Sorting comments--ORIGINAL
//             // if (sorting.field) {
//             //     const reversed = sorting.order === "asc" ? 1 : -1;
//             //     computedComments = computedComments.sort(
//             //         (a, b) =>
//             //             reversed * a[sorting.field].localeCompare(b[sorting.field])
//             //     );
//             // } 
//             ///////////////////


//             if (sorting.field) {
//                 if (isNaN(computedComments[0][sorting.field])) {
//                     const reversed = sorting.order === "asc" ? 1 : -1;
//                     computedComments = computedComments.sort(
//                         (a, b) =>
//                             reversed * a[sorting.field].localeCompare(b[sorting.field])
//                     );
//                 } else {
//                     const reversed = sorting.order === "asc" ? 1 : -1;
//                     computedComments = computedComments.sort(
//                         (a, b) => reversed * (a[sorting.field] - b[sorting.field])
//                     );
//                 }
//             }





//             //Current Page slice
//             return computedComments.slice(
//                 (currentPage - 1) * perPage,
//                 (currentPage - 1) * perPage + perPage
//             );
//         } else {
//             return computedComments = [];

//         }
//     }, [comments, currentPage, search, sorting,perPage]);




// const colourStyles = {
//     control: styles => ({ ...styles, backgroundColor: ' #FFFFFF', borderRadius: 15, height: 50, width: 100, border: 0, dropdownIndicator: { dropdownIndicatorStyles } }),
//     option: (styles, { data, isDisabled, isFocused, isSelected }) => {
//         return (
//             {
//                 ...styles,
//                 backgroundColor: '#FFFFFF',
//                 color: '#6D7587',//BOJA OD BROJEVA

//                 dropdownIndicator: { dropdownIndicatorStyles }
//             }
//         );
//     },


// };



// const dropdownIndicatorStyles = (base, state) => {
//     let changes = {
//         // all your override styles
//         backgroundColor: "green"
//     };
//     return Object.assign(base, changes);
// };



//     ////TOP PART////

//     // const handleDeletePost = async (post) => {
//     //     const deletedPost = await deletePost(post._id);
//     //     setPosts(posts.filter((post) => post._id !== deletedPost._id));
//     //   };


// const handleDeletePost = () => {

//     // console.log("Ovo je post iz handleDeletePost", post);
//     PostService.deletePost(deletePost._id).then((res) => {
//         setComments(comments.filter((comment) => comment._id !== deletePost._id));
//     });
//     setShow(false);
// };

//     const handleClickDelete = (post) => {
//         setShow(true);
//         setDeletePost(post);
//     }


//     const editPost = (_id) => {
//         console.log("Ovo je _id iz editPost", _id);
//         window.location.replace(`http://localhost:3000/update-news/${_id}`);

//         // navigate('/update-news/');
//     }

//     //Delete dialog//
//     const handleClose = () => {
//         setShow(false);
//     }
//     //Delete dialog//



// return (
//     <>
//         <div className="row w-100">
//             {/* Delete dialog */}
//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Do you want to delete {deletePost.title} item</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>Be careful</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleDeletePost}>
//                         OK
//                     </Button>
//                     <Button variant="primary" onClick={handleClose}>
//                         Cancel
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* Delete dialog */}

//             <div className="col mb-3 col-12 text-center">
//                 <div className="row">
//                     <div className="top-serach-items">
//                         <div className="news-list-drop-down">
//                             <div className="news-list-drop">
//                                 <div className="drop-down-left-word">
//                                     <label>Show </label>

//                                 </div>

//                                 <Select
//                                     options={options}
//                                     styles={colourStyles}
//                                     defaultValue={options}
//                                     value={options.find(option => option.value === perPage)}
//                                     onChange={option => setPerPage(option.value)}

//                                 />
//                                 <div className="drop-down-right"> <label className="drop-down-right-word">entries</label>
//                                 </div>
//                             </div>


//                             {/* <div className="news-list-search"> */}
//                             <div className="search">
//                                 {/* {!isTyped && <Isvg className="" src={Magnifying} />} */}
//                                 <Isvg className="" src={Magnifying} />

//                                 <Search
//                                     onSearch={value => {
//                                         setSearch(value);
//                                         setCurrentPage(1);
//                                         setIsTyped(true);
//                                     }}
//                                 />

//                             </div>
//                             {/* </div> */}
//                             {/* { !isTyped &&  <Isvg className="search-magnifying" src={Magnifying}/> } */}

//                         </div>
//                     </div>
//                 </div>
//                 <div class="table-responsive">
//                     <table className="table table-striped">
//                         <TableHeader
//                             headers={headers}
//                             onSorting={(field, order) =>
//                                 setSorting({ field, order })
//                             }

//                         />
//                         <tbody>
//                             {commentsData.length > 0 ? commentsData.map((comment) => (

//                                 <tr>
//                                     <th scope="row" key={comment._id}>
//                                         {comment.index}



//                                     </th>
//                                     <td className="title-td">{comment.title}</td>
//                                     {/* <td>{comment.shortDescription}</td> */}
//                                     <td>{DateFormat(comment.postDate, "mm.dd.yyyy")}</td>
//                                     <td>{DateFormat(comment.postDate, "h:MM")} h</td>
//                                     <td>
//                                         <div className="update-delete-img-div">
//                                             <button onClick={() => editPost(comment._id)}><Isvg className='isvg-pen-update' src={Pen} /></button>

//                                             <button onClick={() => handleClickDelete(comment)}>
//                                                 <Isvg className='isvg-pen-delete' src={Trash} />
//                                             </button>
//                                         </div>

//                                     </td>
//                                 </tr>
//                             )) : <div><h1>NOTHING TO SHOW</h1></div>}
//                         </tbody>
//                         {/* <div> <p className="last-paragraph">Showing 1 to {perPage} of {comments.length} entries</p> </div> */}
//                     </table>
//                 </div>
//                 <div className="col-md-6">
//                     <Pagination
//                         total={totalItems}
//                         itemsPerPage={perPage}
//                         currentPage={currentPage}
//                         onPageChange={page => setCurrentPage(page)}


//                     />

//                 </div>

//             </div>
//         </div>
//         <div> <p className="last-paragraph">Showing 1 to {perPage} of {comments.length} entries</p> </div>


//     </>
// );
// };

// export default DataTable;
// ///////////Original/////////////


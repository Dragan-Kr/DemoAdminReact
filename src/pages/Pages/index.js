import React, { useEffect, useState } from "react";

import { TableHeader, Pagination, Search } from "../.././components/DataTable";

import PostService from "../../services/PostService";

import DateFormat from "dateformat";
import Isvg from "react-inlinesvg";
import { useHistory, useNavigate } from 'react-router-dom';

import Select from "react-select";
import Pen from "../../images/pen.svg";
import Trash from "../../images/trash.svg";
import SortArrowUp from "../../images/sortArrowUp.svg";
import Magnifying from "../../images/magnifying.svg";

///Modal////
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import debounce from "lodash/debounce";
import axios from "axios";

import { UPDATE_NEWS } from "../../globalVariables";
import { POST_API } from "../../globalVariables";

const DataTable = () => {
  const headers = [
    { name: "NO.", field: "index", sortable: true, img: SortArrowUp },
    { name: "Title", field: "title", sortable: true },
    { name: "Date", field: "postDate", sortable: true },
    { name: "Time", field: "time", sortable: true },
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
  const [sorting, setSorting] = useState({ field: "index", order: "asc" });
  const [pageSize, setPageSize] = useState(options[0].value);
  const [allDataLength, setAllDataLength] = useState(0);

  ////

  const [show, setShow] = useState(false);
  const [deletePost, setDeletePost] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    let res;
    const queryParams = new URLSearchParams();
    if (searchTerm.length !== 0) {
      console.log("USAO U IF U useEffect");

      const search = debounce(async () => {
        res = await axios.get(
          `${POST_API}?page=${currentPage}&limit=${pageSize}&sortField=${sorting.field}&sortOrder=${sorting.order}&searchTerm=${searchTerm}`
        );
        setPosts(res.data.data);
        setTotalItems(res.data.data.length);
        setTotalPages(res.data.totalPages);
        setAllDataLength(res.data.allDataLength);
        setLoading(false);
      }, 1000);

      search();

      queryParams.append('page', currentPage);
      queryParams.append('limit', pageSize);
      queryParams.append('sortField', sorting.field);
      queryParams.append('sortOrder', sorting.order);
      queryParams.append('searchTerm',searchTerm);
      const url = `/news-list?${queryParams.toString()}`;
      navigate(url);
  
    } else {
      const fetchData = async () => {
        setLoading(true);
        res = await axios.get(
          `${POST_API}?page=${currentPage}&limit=${pageSize}&sortField=${sorting.field}&sortOrder=${sorting.order}&searchTerm=${searchTerm}`
        );
        console.log("RES", res);
        setPosts(res.data.data);
        setTotalItems(res.data.data.length);
        setTotalPages(res.data.totalPages);
        setAllDataLength(res.data.allDataLength);
        setLoading(false);
      };
      fetchData();
      queryParams.append('page', currentPage);
      queryParams.append('limit', pageSize);
      queryParams.append('sortField', sorting.field);
      queryParams.append('sortOrder', sorting.order);
      queryParams.append('searchTerm',searchTerm);
      const url = `/news-list?${queryParams.toString()}`;
      navigate(url);
    }
  }, [currentPage, pageSize, sorting.field, sorting.order, searchTerm]);

  const handleClose = () => {
    setShow(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  // if (posts.length === 0) {
  //     return <div>No posts found.</div>;
  // }

  const handleDeletePost = () => {
    PostService.deletePost(deletePost._id).then((res) => {
      setPosts(posts.filter((comment) => comment._id !== deletePost._id));
    });
    setShow(false);
  };

  const handleClickDelete = (post) => {
    setShow(true);
    setDeletePost(post);
  };

  const editPost = (_id) => {
    console.log("Ovo je _id iz editPost", _id);
    window.location.replace(`${UPDATE_NEWS}${_id}`);

    // navigate('/update-news/');
  };

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: " #FFFFFF",
      borderRadius: 15,
      height: 50,
      width: 100,
      border: 0,
      dropdownIndicator: { dropdownIndicatorStyles },
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: "#FFFFFF",
        color: "#6D7587", //BOJA OD BROJEVA

        dropdownIndicator: { dropdownIndicatorStyles },
      };
    },
  };

  const dropdownIndicatorStyles = (base, state) => {
    let changes = {
      // all your override styles
      backgroundColor: "green",
    };
    return Object.assign(base, changes);
  };

  return (
    <>
      <div className="row w-100">
        {/* Delete dialog */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Do you want to delete {deletePost.title} item
            </Modal.Title>
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
                    value={options.find((option) => option.value === pageSize)}
                    onChange={(option) => setPageSize(option.value)}
                  />
                  <div className="drop-down-right">
                    {" "}
                    <label className="drop-down-right-word">entries</label>
                  </div>
                </div>

                <div className="search">
                  <Isvg className="" src={Magnifying} />
                  <Search
                    onChange={(value) => {
                      setSearchTerm(value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <TableHeader
                headers={headers}
                onSorting={(field, order) => setSorting({ field, order })}
                setSorting={setSorting}
              />
              <tbody>
                {posts.length > 0
                  ? posts.map((comment, index) => (
                      <tr key={index}>
                        <th scope="row" key={comment._id}>
                          {comment.index}
                        </th>
                        <td className="title-td">{comment.title}</td>

                        <td>{DateFormat(comment.postDate, "mm.dd.yyyy")}</td>

                        <td>{comment.time} h</td>
                        <td>
                          <div className="update-delete-img-div">
                            <button onClick={() => editPost(comment._id)}>
                              <Isvg className="isvg-pen-update" src={Pen} />
                            </button>

                            <button onClick={() => handleClickDelete(comment)}>
                              <Isvg className="isvg-pen-delete" src={Trash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <Pagination
              total={allDataLength}
              itemsPerPage={pageSize}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)} //setPage na tutorialu
            />
          </div>
        </div>
      </div>
      <div>
        {" "}
        <p className="last-paragraph">
          Showing 1 to {pageSize} of {allDataLength} entries
        </p>{" "}
      </div>
    </>
  );
};

export default DataTable;

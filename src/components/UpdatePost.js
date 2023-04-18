import React from 'react';
import CreatePostComponent from './CreatePostComponent2';
import { useParams } from "react-router-dom";
import UpdatePostComponent from './UpdatePostComponent';




const UpdatePost = (props) => {

    let { id } = useParams(); 
    console.log("Id iz UpdatePost",id)
    return (

        <div>
            <UpdatePostComponent _id={id} />
        </div>

    )


};
export default UpdatePost;
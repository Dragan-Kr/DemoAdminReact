import React from 'react';
import CreatePostComponent from './CreatePostComponent2';
import { useParams } from "react-router-dom";
import UpdatePostComponent from './UpdatePostComponent';
// import PostService from '../services/PostService';









const UpdatePost = (props) => {

    let { id } = useParams(); 

    if(id!==undefined){ 
        console.log("ima id")
    return (

        <div>
            <UpdatePostComponent _id={id} />
        </div>

    )
 }else{
    console.log("id je 0",id)
    
    return (

        <div>
            <UpdatePostComponent _id={0} />
        </div>

    )

 }

};
export default UpdatePost;
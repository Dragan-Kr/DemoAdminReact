import axios from 'axios';

const Post_API_Base_URL = "http://localhost:8000/api/post";

class PostService{

    getPosts(){
        return axios.get(Post_API_Base_URL);
    }

    getPostById(postId){
        return axios.get(Post_API_Base_URL + '/'+postId);
    }

    createPost(post){
        return axios.post(Post_API_Base_URL,post);
    }



}

export default new PostService();
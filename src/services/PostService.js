import axios from 'axios';

const Post_API_Base_URL = "http://localhost:8000/api/post";

class PostService{

    getPosts(){
        return axios.get(Post_API_Base_URL);
    }

    getPostById(postId,config){
        return axios.get(Post_API_Base_URL + '/'+postId,config);
    }

    createPost(post,config){
        return axios.post(Post_API_Base_URL, post,config);
    }

    deletePost(postId){
        return axios.delete(Post_API_Base_URL + '/' + postId);
    }

    // deletePost(post){
    //     return axios.delete(Post_API_Base_URL,post._id);
    // }

    updatePost(post,postId,config){
        return axios.patch(Post_API_Base_URL + '/' + postId,post,config);
    }
    createPostWithUpload(formData) {
        axios({
            method: 'post',
            url: Post_API_Base_URL,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          })

    }

}

export default new PostService();
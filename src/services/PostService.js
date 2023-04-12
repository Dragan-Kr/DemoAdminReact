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
        return axios.post(Post_API_Base_URL, post);
    }

    deletePost(postId){
        return axios.delete(Post_API_Base_URL + '/' + postId);
    }

    // deletePost(post){
    //     return axios.delete(Post_API_Base_URL,post._id);
    // }

    updatePost(post,postId){
        return axios.patch(Post_API_Base_URL + '/' + postId,post);
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
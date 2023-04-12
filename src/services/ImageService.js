import axios from 'axios';

const Image_API_Base_URL = "http://localhost:8000/api/image";

class ImageService{

postImage(image){
return axios.post(Image_API_Base_URL,image);
}


}export default new ImageService;
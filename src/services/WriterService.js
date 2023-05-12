import axios from "axios";
import {WRITER_API} from "../../src/globalVariables";

class WriterService {
 
    getWriters(){
        return axios.get(WRITER_API);
    }



}

export default new WriterService();
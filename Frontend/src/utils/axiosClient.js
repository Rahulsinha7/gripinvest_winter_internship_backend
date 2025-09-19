import axios from "axios";

const axiosClient=axios.create({
    baseURL: 'http://localhost:3000',  
    withCredentials: true, // Include cookies in requests
    headers:{
        'Content-Type': 'application/json',  //data is in json format
    }
});

// axiosClient.post('/user/register', data )

export default axiosClient;
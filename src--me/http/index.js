import axios from "axios"


axios.defaults.timeout = 5000;

axios.interceptors.request.use(config => {
    let token = JSON.parse(sessionStorage.getItem("token"))?JSON.parse(sessionStorage.getItem("token")):''

    config.headers.Authorization = token;
// Do something before request is sent
return config;
},error => {   
// Do something with request error
return Promise.reject(error);
});

axios.interceptors.response.use(response => {
// Do something before request is sent
return response.data;
},error => {
// Do something with request error
return Promise.reject(error);
});

export default axios

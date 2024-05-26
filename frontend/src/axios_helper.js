import axios from "axios";

axios.defaults.baseURL = 'http://192.168.1.62:8081';
axios.defaults.headers.post["Content-Type"] = 'application/json';

export const getAuthToken = () => {
    return window.localStorage.getItem("userToken");
}

export const setAuthToken = (token) => {
    if (token !== null) {
        window.localStorage.setItem("auth_token", token);
    } else {
        window.localStorage.removeItem("auth_token");
    }
}

export const request = (method, url, data) => {
    let headers = {};
    let token = getAuthToken()
    if (token) {
        headers = {'Authorization': `Bearer ${getAuthToken()}`};
    }
    console.log(headers)
    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data
    });
}

import axios from "axios"

export function login(username, password, remember) {
    var formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("remember", remember);
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/login/',
        method: 'post',
        data: formData
    })
}

export function logout() {
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/logout',
        method: 'post',
        headers: {
            'Content-Type': "application/json;charset=utf-8",
            'Access-Control-Allow-Credentials':"true"
        },
        withCredentials: true
    })
}

export function code(email) {
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/code?email='+email,
        method: 'get',
    })
}

export function register(username, password, email, code) {
    var formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("code", code);
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/register',
        method: 'post',
        data: formData
    })
}

export function reset(email, code, password) {
    var formData = new FormData();
    formData.append("email", email);
    formData.append("code", code);
    formData.append("password", password);
    axios.defaults.withCredentials= true;
    return axios({
        url: '/api/reset',
        method: 'post',
        data: formData
    });
}
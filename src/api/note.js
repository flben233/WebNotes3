import axios from "axios";

export function share(aid, folder) {
    var formData = new FormData();
    formData.append("aid", aid)
    formData.append("folder", folder)
    return axios({
        url: '/api/article/share/enable',
        method: 'post',
        data: formData
    })
}

export function createFolder(name) {
    var formData = new FormData();
    formData.append("name", name)
    return axios({
        url: '/api/folder/create',
        method: 'post',
        data: formData
    })
}

export function deleteFolder(id) {
    var formData = new FormData();
    formData.append("id", id)
    return axios({
        url: '/api/folder/delete',
        method: 'post',
        data: formData
    })
}


export function deleteNote(aid) {
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/article/delete/'+aid.toString(),
        method: 'delete'
    })
}

export function search(queryString) {
    var formData = new FormData();
    formData.append("word", queryString);
    axios.defaults.withCredentials= true;
    return axios({
        url: '/api/article/search?word='+queryString,
        method: 'get',
    })
}

export function searchByFolder(queryString) {
    var formData = new FormData();
    formData.append("word", queryString);
    axios.defaults.withCredentials= true;
    return axios({
        url: '/api/article/user/'+queryString,
        method: 'get',
    })
}

export function createNote(article, folder) {
    var formData = new FormData();
    formData.append("article", article);
    formData.append("folder", folder);
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/article/send',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': "application/json;charset=utf-8",
            'Access-Control-Allow-Credentials':"true"
        },
        withCredentials: true
    })
}

export function getData() {
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/article/user/',
        method: 'get',
        headers: {
            'Content-Type': "application/json;charset=utf-8",
            'Access-Control-Allow-Credentials':"true"
        },
        withCredentials: true
    })
}

export function updateNotes(article, aid, folder) {
    var formData = new FormData();
    formData.append("article", article);
    formData.append("aid", aid);
    formData.append("folder", folder);
    axios.defaults.withCredentials = true;
    return axios({
        url: '/api/article/update',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': "application/json;charset=utf-8",
            'Access-Control-Allow-Credentials':"true"
        },
        withCredentials: true
    })
}

export function getArticleById(aid) {
    return axios({
        url: '/api/article/aid/' + aid,
        method: 'get',
        withCredentials: true
    })
}

export function getShareList() {
    return axios.get('/api/article/share/list');
}

export function cancelShare(aid, folder) {
    return axios.post('/api/article/share/cancel?aid=' + aid + '&folder=' + folder);
}
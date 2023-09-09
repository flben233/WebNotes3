import axios from "axios";

export function share(aid) {
    const formData = new FormData();
    formData.append("aid", aid)
    return axios({
        url: '/api/article/share/enable',
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
    const formData = new FormData();
    formData.append("word", queryString);
    axios.defaults.withCredentials= true;
    return axios({
        url: '/api/article/search?word='+queryString,
        method: 'get',
    })
}

export function createNote(article, folder) {
    const formData = new FormData();
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

export async function getData() {
    axios.defaults.withCredentials = true;
    return await axios({
        url: '/api/article/user',
        method: 'get',
        headers: {
            'Content-Type': "application/json;charset=utf-8",
            'Access-Control-Allow-Credentials':"true"
        },
        withCredentials: true
    })
}

export function updateNotes(article, aid, folder) {
    const formData = new FormData();
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

export function cancelShare(aid) {
    return axios.post('/api/article/share/cancel?aid=' + aid);
}

export function moveTo(aid, folder) {
    return axios.post('/api/article/move?aid=' + aid + '&folder=' + folder)
}
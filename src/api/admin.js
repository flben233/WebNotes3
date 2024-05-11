import axios from "axios";

export function listUser() {
    return axios({
        url: '/api/admin/user/list',
        method: 'get',
    })
}

export function deleteUser(username) {
    return axios({
        url: '/api/admin/user/delete/' + username,
        method: 'post',
    })
}

export function updateUserInfo(username, role) {
    const formData = new FormData();
    formData.append("username", username)
    formData.append("role", role)
    return axios({
        url: '/api/admin/user/update',
        method: 'post',
        data: formData
    })
}

export function updateRoleInfo(newRole) {
    return axios({
        url: '/api/admin/role/update',
        method: 'post',
        data: newRole
    })
}

export function getArticleList(username, date=null) {
    if (date === null) {
        return axios({
            url: '/api/admin/article/list',
            method: 'get',
            params: {
                username: username
            }
        })
    }
    return axios({
        url: '/api/admin/article/list',
        method: 'get',
        params: {
            username: username,
            date: date
        }
    })
}

export function delArticle(username, aid) {
    return axios({
        url: '/api/admin/article/del',
        method: 'get',
        params: {
            username: username,
            aid: aid
        }
    })
}
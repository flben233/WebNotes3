import axios from "axios";

export function createFolder(name) {
    const formData = new FormData();
    formData.append("name", name)
    return axios({
        url: '/api/folder/create',
        method: 'post',
        data: formData
    })
}

export function deleteFolder(id) {
    const formData = new FormData();
    formData.append("id", id)
    return axios({
        url: '/api/folder/delete',
        method: 'post',
        data: formData
    })
}

export function allFolder() {
    return axios.get("/api/folder/all")
}
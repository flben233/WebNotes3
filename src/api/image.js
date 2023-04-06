import axios from "axios";

export function uploadImg($file){
    var formData = new FormData();
    formData.append('file', $file);
    return axios({
        url: '/api/image/upload',
        method: 'post',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    })
}

export function deleteImg(imageName) {
    return axios.delete('/api/image/delete/' + imageName);
}

export function getImgList() {
    return axios.get("/api/image/query");
}
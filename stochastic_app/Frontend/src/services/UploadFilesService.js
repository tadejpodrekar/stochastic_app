import axios from "axios";

class UploadFilesService {
    upload(file, type, token) {
        let formData = new FormData();

        formData.append("uploadedFile", file);
        return axios.post("http://localhost:5000/upload/" + type, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'x-access-token': token
            }
        });
    }

    getProblems(token) {
        return axios.get("http://localhost:5000/files/problems", {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': token
            }})
    }

    getAlgos(token) {
        return axios.get("http://localhost:5000/files/algos", {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': token
            }});
    }

    checkPerms(token) {
        return axios.get("http://localhost:5000/upload", {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': token
            }});
    }

    createTest(data, token) {
        return axios.post("http://localhost:5000/postTest", data, {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': token
            }});
    }

    getTests(token){
        return axios.get("http://localhost:5000/tests", {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': token
            }});
    }

    get(url, token){
        return axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': token
            }});
    }

    post(url, data, token){
        return axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': token
            }});
    }
}

export default new UploadFilesService();
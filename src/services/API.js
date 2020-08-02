import axios from "axios";
import configs from "@constants/configs";

let API = axios.create({
    baseURL: configs.apiURL,
    responseType: "json"
});

export const setClientToken = token => {
    API.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
};

export default API;
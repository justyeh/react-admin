import axios from "axios";
import { storage } from "@/libs/utils";
import { message } from "antd";
import { basePath } from "@/appConfig";
import { withRouter } from "react-router-dom";

const http = axios.create({
    timeout: 5000,
    baseURL: "/"
});

//request拦截器
http.interceptors.request.use(
    config => {
        config.headers["authorization"] = storage.get("token") || "";
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//response拦截器
http.interceptors.response.use(
    response => {
        if (response.data.code === 200) {
            return response.data;
        } else if (response.data.code === 401) {
            storage.remove("token");
            window.location.href = basePath + "/login";
        } else {
            message.error(response.data.message);
            return false;
        }
    },
    error => {
        message.error("网络错误，请稍后再试！");
        return false;
    }
);

export default http;

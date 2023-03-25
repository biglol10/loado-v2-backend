"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "https://developer-lostark.game.onstove.com";
const axiosInstance = axios_1.default.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 30000,
});
const handleRequest = (config) => {
    var _a, _b;
    if (((_a = config.url) === null || _a === void 0 ? void 0 : _a.endsWith("markets/items")) ||
        ((_b = config.url) === null || _b === void 0 ? void 0 : _b.endsWith("auctions/items"))) {
        Object.assign(config.headers, {
            Authorization: `bearer ${process.env.REACT_APP_SMILEGATE_TOKEN}`,
        });
    }
    return config;
};
const handleRequestError = (error) => {
    return Promise.reject(error);
};
const handleResponseSuccess = (response) => {
    if (response.status === 200) {
        return response.data;
    }
    else if (response.status === 429) {
        return Promise.reject(new Error("Request Limit"));
    }
    return response;
};
const handleResponseError = (error) => {
    console.log("error in axiosInstance.interceptors.response.use");
    const { response } = error;
    if (response.status === 429) {
        return Promise.reject(new Error("Request Limit"));
    }
    if (response && response.data) {
        return Promise.reject(response.data);
    }
    return Promise.reject(new Error("ASDFSADF"));
};
axiosInstance.interceptors.request.use(handleRequest, handleRequestError);
axiosInstance.interceptors.response.use(handleResponseSuccess, handleResponseError);
exports.default = axiosInstance;

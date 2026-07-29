import axios from 'axios';
import config from "../../../custom.config";

export const api = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
})

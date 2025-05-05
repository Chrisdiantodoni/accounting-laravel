import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
});
console.log(import.meta.env.VITE_BASE_URL);
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;

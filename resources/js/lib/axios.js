import Axios from "axios";

const axios = Axios.create({
    baseURL: "/api",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Accept": "application/json",
    },
});

export default axios;
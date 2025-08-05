import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const createAxiosInstance = (route) => {
  return axios.create({
    baseURL: `${API_BASE_URL}${route}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true, // Include cookies in the request
  });
};

export const errorMessage = (error) => {
  return error.response ? error.response.data.message : error.message;
};

export default createAxiosInstance;

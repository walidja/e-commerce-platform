import axios from "axios";
import CONSTANTS from "../utils/constants";

const createAxiosInstance = (route, isFormData = false) => {
  return axios.create({
    baseURL: `${CONSTANTS.API_BASE_URL}${route}`,
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      Accept: "application/json",
    },
    withCredentials: true, // Include cookies in the request
  });
};

export const errorMessage = (error) => {
  return error.response ? error.response.data.message : error.message;
};

export default createAxiosInstance;

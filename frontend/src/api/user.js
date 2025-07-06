import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const userApi = axios.create({
  baseURL: `${API_BASE_URL}user/`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const registerUser = async (userData) => {
  try {
    const response = await userApi.post("register", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const loginUser = async (email, password, rememberMe) => {
  try {
    const response = await userApi.post("login", {
      email,
      password,
      rememberMe,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await userApi.post("forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await userApi.post("reset-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

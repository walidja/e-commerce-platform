import createAxiosInstance, { errorMessage } from "./api";

const userApi = createAxiosInstance("user");

export const registerUser = async (userData) => {
  try {
    const response = await userApi.post("register", userData);
    return response.data;
  } catch (error) {
    throw errorMessage(error);
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
    throw errorMessage(error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await userApi.post("forgot-password", { email });
    return response.data;
  } catch (error) {
    throw errorMessage(error);
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
    throw errorMessage(error);
  }
};

export const logout = async () => {
  try {
    await userApi.post("logout");
    console.log("logged out successfully!!");
  } catch (error) {
    throw errorMessage(error);
  }
};

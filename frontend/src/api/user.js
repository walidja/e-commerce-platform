import createAxiosInstance, { errorMessage } from "./api";

const userApi = createAxiosInstance("user");

export const checkAuth = async () => {
  try {
    // Make a request to the backend to check authentication status
    const response = await userApi.post("/check-auth");
    return { data: response.data, isAuthenticated: true };
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return {
      isAuthenticated: false,
      error: errorMessage(error),
    };
  }
};
export const getUserProfile = async () => {
  try {
    const response = await userApi.get("/profile");
    return response.data.data;
  } catch (error) {
    console.log("Error fetching user profile:", error);
    throw errorMessage(error);
  }
};

import createAxiosInstance, { errorMessage } from "./api";

const authApi = createAxiosInstance("auth");

const checkAuth = async () => {
  try {
    // Make a request to the backend to check authentication status
    const response = await authApi.post("/check-auth");
    return { data: response.data, isAuthenticated: true };
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return {
      isAuthenticated: false,
      error: errorMessage(error),
    };
  }
};

export default checkAuth;

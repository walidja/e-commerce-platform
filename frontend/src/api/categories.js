import createAxiosInstance, { errorMessage } from "./api";

const categoriesApi = createAxiosInstance("categories");
export const getCategories = async () => {
  try {
    const response = await categoriesApi.get("/");
    console.log("Fetched categories:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw errorMessage(error);
  }
};

export const addCategory = async (name) => {
  try {
    const response = await categoriesApi.post("/", { name });
    console.log("Added category:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw errorMessage(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await categoriesApi.delete(`/${id}`);
    console.log("Deleted category:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw errorMessage(error);
  }
};

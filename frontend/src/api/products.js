import createAxiosInstance, { errorMessage } from "./api";

const productsApi = createAxiosInstance("products");
const getAllProducts = async () => {
  try {
    const products = await productsApi.get("/");
    return products.data.data; // Assuming the response structure is { data: { data: products } }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw errorMessage(error);
  }
};

const getProductsByCategory = async (categoryId) => {
  try {
    const products = await productsApi.get(`category/${categoryId}`);
    return products.data.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw errorMessage(error);
  }
};

export { getAllProducts, getProductsByCategory };

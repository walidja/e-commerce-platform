import createAxiosInstance, { errorMessage } from "./api";

const shopApi = createAxiosInstance("shop");
const shopApiWithFormData = createAxiosInstance("shop", true);

export const createShop = async (shopData) => {
  try {
    if (!shopData.name || !shopData.description) {
      throw new Error("Name and description are required fields.");
    }
    const response = await shopApi.post("/", shopData);
    return response.data;
  } catch (error) {
    console.error("Error creating shop:", error);
    throw errorMessage(error);
  }
};

export const getShopByUserId = async () => {
  try {
    const response = await shopApi.get("");
    return response.data.shop;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("Shop not found for this user.");
      return null; // Return null if shop is not found
    }
    console.error("Error fetching shop:", error);
    throw errorMessage(error);
  }
};

export const addShopProduct = async (shopId, product) => {
  try {
    if (!Object.values(product).every((value) => value)) {
      throw new Error("All fields are mandatory. Please fill them out.");
    }
    for (const model of product.models) {
      if (!Object.values(model).every((value) => value)) {
        throw new Error(
          "All model fields are mandatory. Please fill them out."
        );
      }
      if (model.stock < 0 || model.price < 0) {
        throw new Error("stock or price cannot be negative");
      }
    }

    // Prepare form data for the product and its models
    const formData = new FormData();
    for (const key in product) {
      if (key === "models") {
        product.models.forEach((model) => {
          for (const modelKey in model) {
            formData.append(`models_${modelKey}`, model[modelKey]);
          }
        });
      } else {
        formData.append(key, product[key]);
      }
    }

    const response = await shopApiWithFormData.post(
      `/products/${shopId}`,
      formData
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to add product,", error.message);
    throw errorMessage(error);
  }
};

export const getShopProducts = async (shopId) => {
  try {
    const response = await shopApi.get(`/products/${shopId}`);
    return response.data.data;
  } catch (error) {
    throw errorMessage(error);
  }
};

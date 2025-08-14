import createAxiosInstance, { errorMessage } from "./api";

const cart = createAxiosInstance("cart");

export const addToCart = async (item) => {
  try {
    // Check if item has a valid id
    if (!item.productModelId) {
      throw new Error("Item must have a valid id");
    }
    // Check if item has a valid quantity
    if (!item.quantity || item.quantity <= 0) {
      throw new Error("Item must have a valid quantity");
    }
    // Check if the quantity is available according to the inventory
    if (item.quantity > item.stock) {
      throw new Error("Insufficient inventory");
    }
    return await cart.post("/items", item);
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw errorMessage(error);
  }
};

export const removeFromCart = async (itemId) => {
  try {
    return await cart.delete(`/items/${itemId}`);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return errorMessage(error);
  }
};

export const getCartItems = async () => {
  try {
    return await cart.get("/items");
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return errorMessage(error);
  }
};

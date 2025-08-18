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
    return await cart.post(`/`, item);
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

export const updateCartItems = async (cartId, cartItems) => {
  try {
    console.log("[frontend] Updating cart items:", cartItems);
    if (!cartId || !cartItems || !Array.isArray(cartItems)) {
      throw new Error("Invalid cart ID or cart items");
    }
    const response = await cart.put(`/${cartId}/items`, { cartItems });
    return response.data.data;
  } catch (error) {
    console.error("Error updating cart items:", error);
    throw errorMessage(error);
  }
};

export const removeAllCartItems = async (cartId) => {
  try {
    const response = await cart.delete(`/${cartId}/items`);
    return response.data.data;
  } catch (error) {
    console.error("Error removing all cart items:", error);
    throw errorMessage(error);
  }
};

export const getCart = async () => {
  try {
    const response = await cart.get("/");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw errorMessage(error);
  }
};

const { PrismaClient, Prisma } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();

const createCartIfNotExists = async (req, res) => {
  try {
    const userId = req.userId;
    let cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!cart) {
      // create cart
      cart = await prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }
    return cart;
  } catch (error) {
    throw new Error("Failed to create cart: " + error.message);
  }
};

const addToCart = async (req, res) => {
  const { productModelId, price, quantity } = req.body;
  const userId = req.userId;
  let theQuantity = parseInt(quantity);
  try {
    let cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      cart = await createCartIfNotExists(req, res);
    }
    console.log("Cart found:", cart);
    const cartItem = await prisma.$transaction(async (tx) => {
      let cartItem = cart.cartItems.find(
        (item) => item.productModelId === productModelId
      );
      const productModel = await tx.productModel.findUnique({
        where: {
          id: productModelId,
        },
      });
      if (cartItem) {
        // check if the required quantity is available
        console.log("Current cart item quantity:", cartItem.quantity);
        theQuantity = cartItem.quantity + theQuantity;
        console.log("Total quantity to add:", theQuantity);
        if (theQuantity > productModel.stock) {
          return res.status(CODE_RESPONSES.BAD_REQUEST).json({
            error: "Insufficient quantity",
            message: `Only ${productModel.stock} items available`,
          });
        }
        // Update quantity if item already exists and stock is sufficient
        cartItem = await tx.cartItem.update({
          where: {
            id: cartItem.id,
          },
          data: {
            quantity: theQuantity,
          },
        });
      } else {
        // Add new item to cart
        cartItem = await tx.cartItem.create({
          data: {
            productModelId: productModel.id,
            cartId: cart.id,
            price: price,
            quantity: theQuantity,
          },
        });
      }
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          totalCart: {
            set: price * theQuantity,
          },
        },
      });

      return cartItem;
    });
    return res.status(CODE_RESPONSES.SUCCESS).json({ data: cartItem });
  } catch (error) {
    console.log("Error adding to cart:", error);

    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add item to cart", message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      return res
        .status(CODE_RESPONSES.NOT_FOUND)
        .json({ error: "Failed to retrieve cart", message: "Cart not found" });
    }

    const cartItem = cart.cartItems.find((item) => item.id === id);

    if (!cartItem) {
      return res.status(CODE_RESPONSES.NOT_FOUND).json({
        error: "Failed to remove item from cart",
        message: "Item not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.delete({
        where: {
          id: cartItem.id,
        },
      });
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          totalCart: {
            decrement: cartItem.price * cartItem.quantity,
          },
        },
      });
    });

    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ message: "Item removed from cart" });
  } catch (error) {
    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "Failed to remove item from cart",
      message: error.message,
    });
  }
};
const getCartItems = async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        cartItems: {
          include: {
            productModel: true,
          },
        },
      },
    });

    if (!cart) {
      return res
        .status(CODE_RESPONSES.NOT_FOUND)
        .json({ error: "Cart not found" });
    }
    return res.status(CODE_RESPONSES.SUCCESS).json({ data: cart.cartItems });
  } catch (error) {
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to retrieve cart items", message: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartItems,
};

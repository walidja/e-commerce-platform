const { PrismaClient, Prisma } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();

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
        let updatedQuantity = cartItem.quantity + theQuantity;
        if (updatedQuantity > productModel.stock) {
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
            quantity: updatedQuantity,
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
            increment: price * theQuantity,
          },
        },
      });

      return cartItem;
    });
    return res.status(CODE_RESPONSES.SUCCESS).json({ data: cartItem });
  } catch (error) {
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add item to cart", message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!id) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "Missing required parameter",
      message: "Please provide item id.",
    });
  }
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

const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: req.userId,
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

    return res.status(CODE_RESPONSES.SUCCESS).json({ data: cart });
  } catch (error) {
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to retrieve cart", message: error.message });
  }
};

const updateCartItems = async (req, res) => {
  const { cartItems } = req.body;
  if (!cartItems) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "Missing required fields",
      message: "Please provide cart items.",
    });
  }
  try {
    const updatedItems = [];
    await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const cartItem = await tx.cartItem.findUnique({
          where: {
            id: item.id,
          },
        });
        if (cartItem) {
          if (cartItem.quantity === item.quantity) {
            continue;
          }
          // Update existing cart item
          const updatedItem = await tx.cartItem.update({
            where: {
              id: cartItem.id,
            },
            data: {
              quantity: item.quantity,
            },
          });
          await tx.cart.update({
            where: {
              id: cartItem.cartId,
            },
            data: {
              totalCart: {
                // Determine if quantity increased or decreased
                ...(item.quantity > cartItem.quantity
                  ? {
                      increment:
                        updatedItem.price * (item.quantity - cartItem.quantity),
                    }
                  : {
                      decrement:
                        updatedItem.price * (cartItem.quantity - item.quantity),
                    }),
              },
            },
          });
          updatedItems.push(updatedItem);
        }
      }
    });

    return res.status(CODE_RESPONSES.SUCCESS).json({ data: updatedItems });
  } catch (error) {
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update cart items", message: error.message });
  }
};

const removeAllCartItems = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.$transaction(async (tx) => {
      // Delete all cart items
      await tx.cartItem.deleteMany({
        where: {
          cartId: id,
        },
      });
      await tx.cart.update({
        where: {
          id: id,
        },
        data: {
          totalCart: 0,
        },
      });
    });

    return res.status(CODE_RESPONSES.SUCCESS).json({ message: "Cart cleared" });
  } catch (error) {
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to clear cart", message: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItems,
  removeAllCartItems,
  getCart,
};

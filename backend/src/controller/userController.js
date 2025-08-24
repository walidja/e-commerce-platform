const { CODE_RESPONSES } = require("../utils/constants");
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const checkAuth = async (req, res) => {
  return res.status(CODE_RESPONSES.SUCCESS).json({
    userId: req.userId,
    username: req.username,
  });
};

const getUserProfile = async (req, res) => {
  console.log("Fetching profile for user ID:", req.userId);
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        cart: {
          include: { cartItems: { include: { productModel: true } } },
        },
      },
    });
    if (!user) {
      return res
        .status(CODE_RESPONSES.NOT_FOUND)
        .json({ error: "not_found", message: "User not found" });
    }
    const {
      password,
      createdAt,
      lastPasswordChangeAt,
      updatedAt,
      ...userData
    } = user;
    return res.status(CODE_RESPONSES.SUCCESS).json({ data: userData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "server_error", message: "Internal server error" });
  }
};

module.exports = {
  checkAuth,
  getUserProfile,
};

const { getShopByUserId } = require("../controller/shopController");
const AppError = require("../utils/appUtils");
const { CODE_RESPONSES } = require("../utils/constants");
const { PrismaClient, Prisma } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const verifyShopOwner = async (req, res, next) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { userId: req.userId },
      include: { products: true }, // Include products in the response
    });
    const { id } = req.params;
    if (!shop || shop.id != id) {
      return next(
        new AppError(
          "Access denied. just shop owner can add new products.",
          CODE_RESPONSES.FORBIDDEN
        )
      );
    }
    console.log("Access granted!!");

    next();
  } catch (error) {
    next(
      new AppError(
        "An error occurred while verifying shop ownership.",
        CODE_RESPONSES.INTERNAL_SERVER_ERROR
      )
    );
  }
};
module.exports = verifyShopOwner;

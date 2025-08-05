const { PrismaClient } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ status: "SUCESS", data: products });
  } catch (error) {
    console.log("Failed to get product:", error);

    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "get_product_failure",
      message: "Failed to get products",
    });
  }
};

module.exports = {
  getAllProducts,
};

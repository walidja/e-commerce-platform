const { PrismaClient } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        productModels: true,
      },
    });
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

const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { categoryId: categoryId },
      include: {
        productModels: true,
      },
    });
    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ status: "SUCCESS", data: products });
  } catch (error) {
    console.log("Failed to get products by category:", error);
    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "get_products_by_category_failure",
      message: "Failed to get products by category",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
};

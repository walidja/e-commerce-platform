const { PrismaClient } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ status: "SUCCESS", data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
      message: "Failed to load categories",
    });
  }
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "missing_fields",
      message: "Category name is required",
    });
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    return res
      .status(CODE_RESPONSES.CREATED)
      .json({ status: "SUCCESS", data: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
      message: "Failed to add category",
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "missing_fields",
      message: "Category ID is required",
    });
  }
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });
    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ status: "SUCCESS", data: deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
      message: "Failed to delete category",
    });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "Failed to get category",
      message: "Please provide category id",
    });
  }
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!category) {
    return res.status(CODE_RESPONSES.NOT_FOUND).json({
      error: "Failed to get category",
      message: "Category not fount!",
    });
  }
  return res
    .status(CODE_RESPONSES.SUCCESS)
    .json({ status: "SUCCESS", data: category });
};
module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
};

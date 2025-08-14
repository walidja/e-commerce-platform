const { PrismaClient } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();

const createShop = async (req, res) => {
  console.log("Processing shop creation request:", req.body);
  console.log("Shop for userId:", req.userId);
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "missing_fields",
      message: "Name and description are required fields.",
    });
  }

  try {
    const newShop = await prisma.shop.create({
      data: {
        name,
        description,
        userId: req.userId, // Assuming req.userId is set by authentication middleware
      },
    });
    return res.status(CODE_RESPONSES.CREATED).json({ newShop });
  } catch (error) {
    console.error("Error creating shop:", error);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create shop" });
  }
};

const getShopByUserId = async (req, res) => {
  console.log("Fetching shop for userId:", req.userId);
  try {
    const shop = await prisma.shop.findUnique({
      where: { userId: req.userId },
      include: { products: true }, // Include products in the response
    });
    if (!shop) {
      return res.status(CODE_RESPONSES.NOT_FOUND).json({
        error: "not_found",
        message: "Shop not found for this user.",
      });
    }
    return res.status(CODE_RESPONSES.SUCCESS).json({ shop });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch shop" });
  }
};

const addShopProduct = async (req, res) => {
  const { id } = req.params;
  let {
    name,
    categoryId,
    description,
    models_name,
    models_price,
    models_stock,
    models_description,
  } = req.body;
  const files = req.files || [];
  models_name = Array.isArray(models_name) ? models_name : [models_name];
  models_price = Array.isArray(models_price) ? models_price : [models_price];
  models_stock = Array.isArray(models_stock) ? models_stock : [models_stock];
  models_description = Array.isArray(models_description)
    ? models_description
    : [models_description];
  if (
    !name ||
    !categoryId ||
    !description ||
    !models_name ||
    !models_price ||
    !models_stock ||
    !models_description
  ) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "add_product_fail",
      message: "All data needed. Please provide name, category and description",
    });
  }

  if (files.length !== models_name.length) {
    console.log("Model images count does not match model names count");
    console.log("Files:", files);
    console.log("Model names:", models_name);
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "add_product_fail",
      message: "All model images must be uploaded.",
    });
  }
  const models = files.map((file, index) => ({
    name: models_name[index],
    price: parseFloat(models_price[index]),
    stock: parseInt(models_stock[index]),
    image: `uploads/${file.filename}`,
    description: models_description[index],
  }));
  for (const model of models) {
    if (!Object.values(model).every((value) => value)) {
      throw new Error("All model fields are mandatory. Please fill them out.");
    }
    if (model.stock < 0 || model.price < 0) {
      throw new Error("stock or price cannot be negative");
    }
  }
  console.log("Adding product with models:", models);
  try {
    const productAdded = await prisma.product.create({
      data: {
        name,
        categoryId,
        description,
        shopId: id,
        productModels: {
          create: models,
        },
      },
      include: {
        productModels: true, // Include product models in the response
      },
    });
    console.log("New product added successfully!", productAdded);

    return res.status(CODE_RESPONSES.SUCCESS).json({
      status: "SUCCESS",
      message: "New product added successfully!",
      data: productAdded,
    });
  } catch (err) {
    console.log("Failed to add new product", err);

    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: err, message: "Failed to add new product" });
  }
};

const getShopProducts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("shopId:", id);

    const shopProducts = await prisma.product.findMany({
      where: {
        shopId: id,
      },
      include: {
        productModels: true,
      },
    });
    return res
      .status(CODE_RESPONSES.SUCCESS)
      .json({ status: "SUCESS", data: shopProducts });
  } catch (error) {
    console.log(error);

    return res.status(CODE_RESPONSES.INTERNAL_SERVER_ERROR).json({
      error: "get_product_failure",
      message: "Failed to get products",
    });
  }
};

module.exports = {
  createShop,
  getShopByUserId,
  addShopProduct,
  getShopProducts,
};

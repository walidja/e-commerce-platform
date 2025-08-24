const { PrismaClient } = require("../generated/prisma/client");
const { CODE_RESPONSES } = require("../utils/constants");
const prisma = new PrismaClient();

const getShippingInfo = async (req, res) => {
  try {
    const shippingInfo = await prisma.shippingInformation.findUnique({
      where: { userId: req.userId },
    });
    if (!shippingInfo) {
      return res.status(CODE_RESPONSES.NOT_FOUND).json({
        error: "not_found",
        message: "Shipping information not found",
      });
    }
    return res.status(CODE_RESPONSES.SUCCESS).json({ data: shippingInfo });
  } catch (error) {
    console.error("Error fetching shipping information:", error);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "server_error", message: "Internal server error" });
  }
};

const updateShippingInfo = async (req, res) => {
  const {
    fullName,
    email,
    mobile,
    streetAddress,
    city,
    zipCode,
    stateProvince,
    country,
  } = req.body;
  if (
    !fullName ||
    !email ||
    !mobile ||
    !streetAddress ||
    !city ||
    !zipCode ||
    !stateProvince ||
    !country
  ) {
    return res.status(CODE_RESPONSES.BAD_REQUEST).json({
      error: "missing_fields",
      message: "Please fill in all fields",
    });
  }
  try {
    const shippingData = {
      fullName,
      email,
      mobile,
      streetAddress,
      city,
      zipCode,
      stateProvince,
      country,
    };
    const existingShippingInfo = await prisma.shippingInformation.findUnique({
      where: { userId: req.userId },
    });
    if (!existingShippingInfo) {
      const newShippingInfo = await prisma.shippingInformation.create({
        data: { ...shippingData, userId: req.userId },
      });
      return res.status(CODE_RESPONSES.CREATED).json({ data: newShippingInfo });
    }
    const shippingInfo = await prisma.shippingInformation.update({
      where: { userId: req.userId },
      data: shippingData,
    });
    return res.status(CODE_RESPONSES.SUCCESS).json({ data: shippingInfo });
  } catch (error) {
    console.error("Error updating shipping information:", error);
    return res
      .status(CODE_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: "server_error", message: "Internal server error" });
  }
};

module.exports = {
  getShippingInfo,
  updateShippingInfo,
};

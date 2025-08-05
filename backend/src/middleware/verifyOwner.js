const { getShopByUserId } = require("../controller/shopController");
const AppError = require("../utils/appUtils");

const verifyShopOwner = async (res, req, next) => {
  const shop = await getShopByUserId(req, res);
  const { id } = req.params;
  if (shop.id != id) {
    next(new AppError("Access denied. just shop owner can add new products."));
  }
  console.log("Access granted!!");

  next();
};
module.exports = verifyShopOwner;

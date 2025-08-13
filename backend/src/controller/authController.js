const { clearRememberMeToken } = require("../utils/authUtils");
const { CODE_RESPONSES } = require("../utils/constants");
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const checkAuth = async (req, res) => {
  return res.status(CODE_RESPONSES.SUCCESS).json({
    userId: req.userId,
    username: req.username,
  });
};

module.exports = {
  checkAuth,
};

const Router = require("express").Router();
const {
  getCategories,
  addCategory,
  deleteCategory,
} = require("../controller/categoryController");

Router.get("/", getCategories);
Router.post("/", addCategory);
Router.delete("/:id", deleteCategory);

module.exports = Router;

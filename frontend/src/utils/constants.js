const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GOOD_PASSWORD_SCORE = 3;
const PRODUCT_MODEL = {
  name: "",
  price: "",
  stock: "",
  image: "",
  description: "",
};

const PRODUCT = {
  name: "",
  categoryId: "",
  description: "",
  models: [PRODUCT_MODEL],
};
const CONSTANTS = { GOOD_PASSWORD_SCORE, PRODUCT, PRODUCT_MODEL, API_BASE_URL };
export default CONSTANTS;

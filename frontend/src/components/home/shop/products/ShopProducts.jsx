import { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import AddProductModal from "../../../generic/productDetails/AddProductModal";
import { getShopProducts } from "../../../../api/shop";
import ProductGrid from "../../../generic/productDetails/ProductGrid";
import CONSTANTS from "../../../../utils/constants";

const ShopProducts = ({ shopId }) => {
  const [product, setProduct] = useState(CONSTANTS.PRODUCT);
  const [shopProducts, setShopProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getShopProducts(shopId)
      .then((data) => {
        console.log("Shop products:", data);
        setShopProducts(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showModal]);

  const handleProductClick = (product) => {
    console.log("Product clicked:", product);
    // product.models = product.productModels;
    setProduct(product);
    setIsEditable(false);
    setShowModal(true);
  };

  const clickAddProduct = () => {
    setProduct(CONSTANTS.PRODUCT);
    setIsEditable(true);
    setShowModal(true);
  };

  return (
    <Row>
      {isLoading ? (
        "Loading..."
      ) : (
        <ProductGrid
          products={shopProducts}
          handleProductClick={handleProductClick}
        />
      )}
      <Button
        variant="primary"
        className="rounded-circle d-flex align-items-center justify-content-center shadow"
        style={{
          position: "fixed",
          right: "32px",
          bottom: "64px",
          width: "56px",
          height: "56px",
          zIndex: 1000,
        }}
        aria-label="Add Product"
        onClick={clickAddProduct}
      >
        <BsPlus size={32} />
      </Button>
      <AddProductModal
        setShowModal={setShowModal}
        showModal={showModal}
        shopId={shopId}
        product={product}
        setProduct={setProduct}
        isEditable={isEditable}
      />
    </Row>
  );
};

export default ShopProducts;

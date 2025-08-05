import { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import AddProductModal from "./AddProductModal";
import { getShopProducts } from "../../../../api/shop";
import ProductGrid from "../../../generic/ProductGrid";
import CONSTANTS from "../../../../utils/constants";

const ShopProducts = ({ shopId }) => {
  const [product, setProduct] = useState(CONSTANTS.PRODUCT);
  const [shopProducts, setShopProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Row>
      {isLoading ? "Loading..." : <ProductGrid products={shopProducts} />}
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
        onClick={() => setShowModal(true)}
      >
        <Plus size={32} />
      </Button>
      <AddProductModal
        setShowModal={setShowModal}
        showModal={showModal}
        shopId={shopId}
        product={product}
        setProduct={setProduct}
      />
    </Row>
  );
};

export default ShopProducts;

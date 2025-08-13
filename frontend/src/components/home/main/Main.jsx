import { Button, Card, Col, Placeholder, Row } from "react-bootstrap";
import Categories from "./Categories";
import { useState, useEffect } from "react";
import ProductGrid from "../../generic/productDetails/ProductGrid";
import { getAllProducts, getProductsByCategory } from "../../../api/products";
import AddProductModal from "../../generic/productDetails/AddProductModal";

const Main = () => {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch products based on selected category
    const fetchProducts = async () => {
      if (category) {
        setProducts(await getProductsByCategory(category.id));
        return;
      } else {
        setProducts(await getAllProducts());
      }
    };
    fetchProducts();
  }, [category]);

  const handleProductClick = (product) => {
    product.models = product.productModels;
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <Row className="g-4 min-vh-100">
      <Col md={2} className="sidebar">
        <Categories setCategory={setCategory} category={category} />
      </Col>
      <Col md={10} className="content bg-light">
        <h2>Welcome to Yalla Market</h2>
        <p>
          Explore our wide range of products and enjoy a seamless shopping
          experience.
        </p>
        {products.length === 0 ? (
          <>
            <p>
              No products found for category <strong>{category?.name}</strong>
            </p>
            <Placeholder as={Card} className="m-4" />
          </>
        ) : (
          <ProductGrid
            products={products}
            handleProductClick={handleProductClick}
          />
        )}
      </Col>
      <AddProductModal
        product={selectedProduct}
        setProduct={setSelectedProduct}
        setShowModal={setShowModal}
        shopId={selectedProduct?.shopId}
        showModal={showModal}
        isEditable={false}
      />
    </Row>
  );
};

export default Main;

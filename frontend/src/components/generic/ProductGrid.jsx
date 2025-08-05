import { Col, Row } from "react-bootstrap";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  return (
    <Row xs={2} md={4}>
      {products.map((product, idx) => (
        <Col key={idx}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};
export default ProductGrid;

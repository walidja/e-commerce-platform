import { Button, Card, Col, Placeholder, Row } from "react-bootstrap";
import Categories from "./Categories";
import { useState } from "react";

const Main = () => {
  const [category, setCategory] = useState("");
  return (
    <Row className="g-4 min-vh-100">
      <Col md={2} className="sidebar ps-4 pt-3 bg-secondary text-white">
        <Categories setCategory={setCategory} />
      </Col>
      <Col md={10} className="content bg-light">
        <h2>Welcome to Yalla Market</h2>
        <p>
          Explore our wide range of products and enjoy a seamless shopping
          experience.
        </p>
        <div className="product-list">
          <Row className="g-4">
            {/* Product cards will go here */}
            <Col md={4}>
              <Card>
                <Placeholder
                  as="image"
                  variant="top"
                  animation="wave"
                  src="../assets/sample-product.jpg"
                  alt="Sample Product"
                />
                <Card.Body>
                  <Card.Title>Sample Product</Card.Title>
                  <Card.Text>$19.99</Card.Text>
                  <Button variant="primary">Add to Cart</Button>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Last updated 3 mins ago</small>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default Main;

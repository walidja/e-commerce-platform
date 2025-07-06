import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Navbar,
  Row,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/home">
            <img
              src="/assets/ecommerce-logo.svg"
              alt="Yalla Market Logo"
              style={{ height: "40px", width: "auto" }} // <-- Add this line
              className="d-inline-block align-top"
            />{" "}
            Yalla Market
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-flex align-items-center justify-content-center"
          >
            <Form className="ms-auto d-flex flex-grow-1">
              <span className="navbar-text me-2">Search:</span>
              <InputGroup className="flex-grow-1">
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control type="text" placeholder="Search" />
                <Button variant="outline-success">Search</Button>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
          <Navbar.Text className="ms-2">
            <a href="/login">Login</a>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container className="ms-0 mt-0 flex-grow-1">
        <Row className="g-4">
          <Col md={3} className="sidebar bg-secondary p-3 text-white">
            <h5>Categories</h5>
            <ul>
              <li>
                <a href="/category/electronics">Electronics</a>
              </li>
              <li>
                <a href="/category/fashion">Fashion</a>
              </li>
              <li>
                <a href="/category/home">Home</a>
              </li>
            </ul>
          </Col>
          <Col md={9} className="content bg-light">
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
                    <Card.Img
                      variant="top"
                      src="../assets/sample-product.jpg"
                      alt="Sample Product"
                    />
                    <Card.Body>
                      <Card.Title>Sample Product</Card.Title>
                      <Card.Text>$19.99</Card.Text>
                      <Button variant="primary">Add to Cart</Button>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Last updated 3 mins ago
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <footer className="mt-auto bg-dark text-white py-3">
        <Container>
          <Row>
            <Col className="text-center">
              <p>&copy; 2023 Yalla Market. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;

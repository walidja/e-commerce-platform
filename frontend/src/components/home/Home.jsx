import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Navbar,
  Offcanvas,
  Row,
} from "react-bootstrap";
import { List, Search } from "react-bootstrap-icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import checkAuth from "../../api/auth";
import { logout } from "../../api/user";

const Home = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkUserAuth = async () => {
      setIsLoading(true);
      const { isAuthenticated, data } = await checkAuth();
      setIsAuthenticated(isAuthenticated);
      if (isAuthenticated) {
        setUsername(data.username);
      }
      setIsLoading(false);
    };
    checkUserAuth();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        data-bs-theme="light"
        variant="dark"
        expand="lg"
        sticky="top"
        className="px-3 space-between app-bg-gradient"
      >
        {/* <Container> */}
        <Navbar.Brand href="/">
          <img
            src="/assets/ecommerce-logo.svg"
            alt="Yalla Market Logo"
            style={{ height: "40px", width: "auto" }} // <-- Add this line
            className="d-inline-block align-top"
          />{" "}
          Yalla Market
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="">
          <Form className="w-100">
            <InputGroup className="flex-grow-1">
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Search" />
              <Button variant="primary">Search</Button>
            </InputGroup>
          </Form>
        </Navbar.Collapse>
        <Navbar.Text className="ms-2">
          {isAuthenticated ? (
            <Button
              variant="outline-light"
              className="ms-2"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <List />
            </Button>
          ) : (
            <a href="/login">Login</a>
          )}
        </Navbar.Text>
        {/* </Container> */}
      </Navbar>
      <Offcanvas
        placement="end"
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Welcome, {username}!</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            <ListGroup.Item>
              <Link
                to="/profile"
                className="text-decoration-none"
                onClick={() => setShowSidebar(false)}
              >
                Profile
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link
                to="/orders"
                className="text-decoration-none"
                onClick={() => setShowSidebar(false)}
              >
                Orders
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link
                to="/wishlist"
                className="text-decoration-none"
                onClick={() => setShowSidebar(false)}
              >
                Wishlist
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link
                to="/settings"
                className="text-decoration-none"
                onClick={() => setShowSidebar(false)}
              >
                Settings
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link
                to="/shop"
                className="text-decoration-none"
                onClick={() => setShowSidebar(false)}
              >
                Shop
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link
                to="/cart"
                className="text-decoration-none"
                onClick={() => setShowSidebar(false)}
              >
                Cart
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
      <Container fluid className="flex-grow-1 m-0 px-0">
        <Outlet />
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

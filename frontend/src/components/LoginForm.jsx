import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { loginUser } from "../api/user";
import RedAlert from "./RedAlert";
import PasswordInput from "./PasswordInput";
import LoadingButton from "./LoadingButton";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    if (email === "" || password === "") {
      setMessage("Please enter both email and password.");
    } else {
      setIsLoading(true); // Set loading state
      loginUser(email, password, rememberMe)
        .then((response) => {
          console.log("Login successful:", response);
          const accessToken = response.accessToken;
          // Store the access token in local storage or context
          localStorage.setItem("accessToken", accessToken);
          // Clear the form fields after a "successful" submission
          setEmail("");
          setPassword("");
          // Redirect to home page after successful login
          navigate("/home");
        })
        .catch((error) => {
          console.error("Login error:", error);
          setMessage(`Login failed. ${error}`);
        })
        .finally(() => {
          setIsLoading(false); // Reset loading state
        });
    }
  };

  return (
    <div className="background-style d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="card-transition shadow-lg p-4 p-md-5 rounded-4 transform transition-all duration-300 hover:scale-105">
              <Card.Body>
                <h2 className="title-style text-center mb-4">Welcome Back!</h2>
                <p className="text-center text-secondary mb-4">
                  Sign in to your account to continue.
                </p>
                <RedAlert message={message} />
                <Form id="loginForm" onSubmit={handleSubmit} className="mt-4">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="fw-bold text-gray-700">
                      Email address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-pill px-4 py-2" // Applying rounded-pill and padding
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label className="fw-bold text-gray-700">
                      Password
                    </Form.Label>
                    <PasswordInput
                      password={password}
                      setPassword={setPassword}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Group controlId="formBasicCheckbox" className="mb-0">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        className="text-gray-900"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    </Form.Group>
                    <div className="text-sm">
                      <a
                        href="/forgot-password"
                        className="text-primary hover:text-primary-dark"
                        style={{ textDecoration: "none" }}
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    {" "}
                    {/* w-full flex justify-center, d-grid for full width button */}
                    <LoadingButton
                      buttonName={"Sign in"}
                      form={"loginForm"}
                      isLoading={isLoading}
                    />
                  </div>
                </Form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-primary hover:text-primary-dark"
                      style={{ textDecoration: "none" }}
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginForm;

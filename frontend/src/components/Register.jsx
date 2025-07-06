import { useState, useEffect } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import { registerUser } from "../api/user";
import RedAlert from "./RedAlert";
import PasswordIndicator from "./PasswordIndicator";
import { isGoodPasswordScore, scrollToTop } from "../utils/helperFunctions";
import { Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import LoadingButton from "./LoadingButton";
import "react-phone-number-input/style.css";

const EMPTY_USER = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  address: "",
};

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(EMPTY_USER);
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState(0); // 0-4 score from zxcvbn
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (message) {
      scrollToTop();
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    setMessage(""); // Clear previous messages
    // Basic validation for mandatory fields
    if (!Object.values(user).every((value) => value)) {
      setMessage("All fields are mandatory. Please fill them out.");
      return;
    }
    // Validate password strength
    if (!isGoodPasswordScore(strength)) {
      setMessage("Passwrod is weak. Please provide a good password.");
      return;
    }
    if (user.password !== user.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Validate mobile number
    if (!isValidPhoneNumber(user.mobile)) {
      console.log("Invalid mobile number:", user.mobile);
      setMessage("Please provide a valid mobile number.");
      return;
    }
    const { _, ...userData } = user;
    setIsLoading(true);
    console.log(user.mobile);

    registerUser(userData)
      .then((newUser) => {
        console.log(`new user registered successfully. ${newUser}`);
        setIsRegistered(true);
        // Clear form fields after successful registration
        setUser(EMPTY_USER);
      })
      .catch((err) => {
        setMessage(`Registeration Failed. ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="background-style d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="card-transition shadow-lg p-4 p-md-5 rounded-4">
              <Card.Body>
                {isRegistered ? (
                  <p>
                    You have successfully completed the registeration!! Welcome
                    to Yalla market.{" "}
                    <Link
                      to="/login"
                      className="ext-primary hover:text-primary-dark"
                      style={{ textDecoration: "none" }}
                    >
                      Login
                    </Link>
                  </p>
                ) : (
                  <>
                    <h2 className="text-center mb-4 title-style">
                      Create Your Account
                    </h2>
                    <p className="text-center text-secondary mb-4">
                      Join us today to start shopping!
                    </p>
                    <RedAlert message={message} />
                    <Form
                      id="registerForm"
                      onSubmit={handleSubmit}
                      className="mt-4"
                    >
                      <Row>
                        <Col md={6}>
                          <Form.Group
                            className="mb-3"
                            controlId="formFirstName"
                          >
                            <Form.Label className="fw-bold text-gray-700">
                              First Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter first name"
                              name="firstName"
                              value={user.firstName}
                              onChange={handleChange}
                              required
                              className="rounded-pill px-4 py-2"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formLastName">
                            <Form.Label className="fw-bold text-gray-700">
                              Last Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              placeholder="Enter last name"
                              value={user.lastName}
                              onChange={handleChange}
                              required
                              className="rounded-pill px-4 py-2"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group
                        className="mb-3"
                        controlId="formRegisterEmail"
                      >
                        <Form.Label className="fw-bold text-gray-700">
                          Email address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                          required
                          className="rounded-pill px-4 py-2"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formMobileNumber">
                        <Form.Label className="fw-bold text-gray-700">
                          Mobile Number
                        </Form.Label>
                        <PhoneInput
                          placeholder="Enter mobile number"
                          name="mobile"
                          value={user.mobile}
                          onChange={(val) => setUser({ ...user, mobile: val })}
                          className="rounded-pill px-4 py-2 form-control"
                          required
                        />
                      </Form.Group>
                      <PasswordIndicator
                        password={user.password}
                        setPassword={(pwd) =>
                          setUser({ ...user, password: pwd })
                        }
                        strength={strength}
                        setStrength={setStrength}
                      />
                      <Form.Group
                        className="mb-4"
                        controlId="formConfirmPassword"
                      >
                        <Form.Label className="fw-bold text-gray-700">
                          Confirm Password
                        </Form.Label>
                        <PasswordInput
                          password={user.confirmPassword}
                          setPassword={(pass) =>
                            setUser({ ...user, confirmPassword: pass })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="formAddress">
                        <Form.Label className="fw-bold text-gray-700">
                          Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your address"
                          name="address"
                          value={user.address}
                          onChange={handleChange}
                          required
                          className="rounded-pill px-4 py-2"
                        />
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <LoadingButton
                          buttonName={"Register Account"}
                          form={"registerForm"}
                          isLoading={isLoading}
                        />
                      </div>
                    </Form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                          href="/login"
                          className="text-primary hover:text-primary-dark"
                          style={{ textDecoration: "none" }}
                        >
                          Sign in
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;

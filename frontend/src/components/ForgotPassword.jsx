import { useState } from "react";
import { Form, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { forgotPassword } from "../api/user";
import LoadingButton from "./LoadingButton";
import RedAlert from "./RedAlert";

function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    setMessage(""); // Clear previous messages
    setIsLoading(true);

    if (email === "") {
      setMessage("Please enter your email address.");
    } else {
      forgotPassword(email)
        .then((res) => {
          setMessage(res.message);
          setIsEmailSent(true);
        })
        .catch((err) => {
          setMessage(err);
        })
        .finally(() => {
          setIsLoading(false);
          setEmail(""); // Clear the email field
        });
    }
  };

  return (
    <div className="background-style d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="card-transition shadow-lg p-4 p-md-5 rounded-4">
              {isEmailSent ? (
                <p>
                  {message}
                  <a
                    href="/login"
                    className="text-primary hover:text-primary-dark"
                    style={{ textDecoration: "none" }}
                  >
                    Back to Login
                  </a>
                </p>
              ) : (
                <Card.Body>
                  <h2 className="text-center mb-4 title-style">
                    Forgot Password
                  </h2>

                  <p className="text-center text-secondary mb-4">
                    Enter your email to receive a password reset link.
                  </p>

                  {!isEmailSent && <RedAlert message={message} />}

                  <Form
                    id="ForgotForm"
                    onSubmit={handleSubmit}
                    className="mt-4"
                  >
                    <Form.Group className="mb-4" controlId="formResetEmail">
                      <Form.Label className="fw-bold text-gray-700">
                        Email address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-pill px-4 py-2"
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <LoadingButton
                        buttonName={"Send reset link"}
                        isLoading={isLoading}
                        form={"ForgotForm"}
                      />
                    </div>
                  </Form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <a
                        href="/login"
                        className="text-primary hover:text-primary-dark"
                        style={{ textDecoration: "none" }}
                      >
                        Back to Login
                      </a>
                    </p>
                  </div>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ForgotPassword;

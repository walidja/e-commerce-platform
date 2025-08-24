import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { isGoodPasswordScore, scrollToTop } from "../../utils/helperFunctions";
import { resetPassword } from "../../api/auth";
import { useSearchParams } from "react-router-dom";
import LoadingButton from "../generic/LoadingButton";
import RedAlert from "../generic/RedAlert";
import PasswordInput from "./PasswordInput";
import PasswordIndicator from "./PasswordIndicator";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0); // 0-4 score from zxcvbn
  const [message, setMessage] = useState("");
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const resettoken = searchParams.get("token");

  useEffect(() => {
    if (message != "") {
      scrollToTop();
    }
  }, [message]);

  const submitPassword = (e) => {
    e.preventDefault();
    if (!isGoodPasswordScore(strength)) {
      setMessage("Passwrod is weak. Please provide a good password.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    resetPassword(resettoken, password)
      .then((res) => {
        console.log(res.message);
        setMessage(res.message);
        setIsPasswordUpdated(true);
      })
      .catch((err) => {
        setMessage(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="background-style flex justify-items-center justify-center">
        <Container className="">
          <Row className="justify-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="shadow-lg p-4 p-md-5 rounded-4">
                {isPasswordUpdated ? (
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
                  <>
                    <Card.Header>
                      <h2>Reset Password</h2>
                    </Card.Header>
                    <Card.Body>
                      <RedAlert message={message} />
                      <Form id="resetForm" onSubmit={submitPassword}>
                        <PasswordIndicator
                          password={password}
                          setPassword={setPassword}
                          strength={strength}
                          setStrength={setStrength}
                        />

                        <Form.Group>
                          <Form.Label>Confirm Password</Form.Label>
                          <PasswordInput
                            password={confirmPassword}
                            setPassword={setConfirmPassword}
                          />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                    <Card.Footer>
                      <LoadingButton
                        buttonName={"Update Password"}
                        form={"resetForm"}
                        isLoading={isLoading}
                      />
                    </Card.Footer>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default ResetPassword;

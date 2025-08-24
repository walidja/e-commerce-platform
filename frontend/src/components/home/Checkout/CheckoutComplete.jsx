import { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import {
  BsCheckCircleFill,
  BsExclamationCircleFill,
  BsInfoCircleFill,
} from "react-icons/bs";

// Icons provided as React components for consistency
const SuccessIcon = <BsCheckCircleFill />;
const ErrorIcon = <BsExclamationCircleFill />;
const InfoIcon = <BsInfoCircleFill />;

// A map to hold all the status-specific content
const STATUS_CONTENT_MAP = {
  succeeded: {
    text: "Payment succeeded",
    iconColor: "#28a745", // Green
    icon: SuccessIcon,
    message: "Your order has been placed successfully!",
  },
  processing: {
    text: "Your payment is processing.",
    iconColor: "#6c757d", // Gray
    icon: InfoIcon,
    message:
      "We're currently processing your payment. We will notify you once it's complete.",
  },
  requires_payment_method: {
    text: "Your payment was not successful, please try again.",
    iconColor: "#dc3545", // Red
    icon: ErrorIcon,
    message:
      "There was an issue with your payment. Please try a different payment method.",
  },
  default: {
    text: "Something went wrong, please try again.",
    iconColor: "#dc3545", // Red
    icon: ErrorIcon,
    message:
      "An unexpected error occurred. Please try again or contact support.",
  },
};

const CheckoutComplete = () => {
  const stripe = useStripe();
  const [status, setStatus] = useState("default");
  const [intentId, setIntentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      setLoading(false);
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setLoading(false);
        return;
      }

      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
      setLoading(false);
    });
  }, [stripe]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Verifying your payment status...</p>
      </Container>
    );
  }

  const statusInfo = STATUS_CONTENT_MAP[status] || STATUS_CONTENT_MAP.default;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center p-4 shadow">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle"
              style={{
                width: "70px",
                height: "70px",
                backgroundColor: statusInfo.iconColor,
                color: "white",
                fontSize: "2.5rem",
              }}
            >
              {statusInfo.icon}
            </div>
            <h2 className="mb-2">{statusInfo.text}</h2>
            <p className="mb-4">{statusInfo.message}</p>

            {intentId && (
              <>
                <div className="mb-4 text-start">
                  <h5 className="mb-3">Payment Details</h5>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Payment ID:</td>
                        <td>{intentId}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Status:</td>
                        <td>{status}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <Button
                    variant="link"
                    href={`https://dashboard.stripe.com/payments/${intentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Stripe Dashboard
                  </Button>
                </div>
              </>
            )}
            <div className="d-flex justify-content-center mt-3">
              <Button href="/" variant="primary">
                Continue Shopping
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutComplete;

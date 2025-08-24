import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Form } from "react-bootstrap";
import LoadingButton from "../../generic/LoadingButton";
import RedAlert from "../../generic/RedAlert";
import { toast } from "react-toastify";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  console.log("origin:", window.location.origin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-complete`,
      },
    });

    if (error) {
      console.error("Payment confirmation error:", error);
      setIsLoading(false);
      setMessage("Payment failed: " + error.message);
      return;
    }

    // Handle successful payment here
    console.log("Payment successful!");
    setIsLoading(false);
    setMessage("");
    toast.success("Payment successful!");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RedAlert message={message} />
      <PaymentElement />
      <LoadingButton buttonName={"Pay now"} isLoading={isLoading} />
    </Form>
  );
};

export default Payment;

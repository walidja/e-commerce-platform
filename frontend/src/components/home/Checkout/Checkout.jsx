import { Container } from "react-bootstrap";
import CartCard from "../Cart/CartCard";
import { useEffect, useState } from "react";
import LoadingPage from "../../generic/LoadingPage";
import ShippingInformation from "./ShippingInformation";
import { getUserProfile } from "../../../api/user";
import CONSTANTS from "../../../utils/constants";
import { getShippingInfo } from "../../../api/shippingInfo";
import Payment from "./Payment";
import { Elements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../../../api/payment";
import { stripePromise } from "../../../utils/helperFunctions";
import { useRef } from "react";

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ShippingInfo, setShippingInfo] = useState(CONSTANTS.SHIPPING_INFO);
  const isIntentCreated = useRef(false);

  useEffect(() => {
    if (isIntentCreated.current) {
      return;
    }
    const createIntent = async () => {
      isIntentCreated.current = true;
      const secret = await createPaymentIntent();
      setClientSecret(secret);
    };
    createIntent();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      const userInfo = await getUserProfile();
      setCart(userInfo.cart);
      if (!userInfo.cart || userInfo.cart.cartItems.length === 0) {
        setIsLoading(false);
        return;
      }
      await getShippingInfo()
        .then((data) => {
          console.log("Shipping Information:", data);
          if (data) {
            setShippingInfo(data);
          }
          setIsLoading(false);
        })
        .catch(async (error) => {
          console.error("Error fetching shipping information:", error);
          if (error?.response?.status === 404) {
            setShippingInfo({
              ...CONSTANTS.SHIPPING_INFO,
              fullName: userInfo.firstName + " " + userInfo.lastName,
              email: userInfo.email,
              mobile: userInfo.mobile,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchCart();
  }, []);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#3673b0",
    },
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";
  return (
    <Container className="mt-4">
      <LoadingPage
        isLoading={isLoading}
        pageComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              alignItems: "flex-start",
            }}
            className="mb-4"
          >
            <CartCard cart={cart} setCart={setCart} isOrder={true} />
            {cart && cart.cartItems.length > 0 && (
              <>
                <ShippingInformation
                  ShippingInfo={ShippingInfo}
                  setShippingInfo={setShippingInfo}
                />
                {clientSecret && (
                  <Elements
                    options={{ clientSecret, appearance, loader }}
                    stripe={stripePromise}
                  >
                    <Payment />
                  </Elements>
                )}
              </>
            )}
          </div>
        }
      />
    </Container>
  );
};

export default Checkout;

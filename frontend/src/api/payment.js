import createAxiosInstance from "./api";

const paymentApi = createAxiosInstance("payment");
export const createPaymentIntent = async () => {
  const response = await paymentApi.post("/create-payment-intent");
  return response.data.clientSecret;
};

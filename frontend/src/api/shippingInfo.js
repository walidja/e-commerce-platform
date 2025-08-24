import { everyFieldValid } from "../utils/helperFunctions";
import createAxiosInstance, { errorMessage } from "./api";

const shippingInfoApi = createAxiosInstance("shippingInfo");

export const getShippingInfo = async () => {
  const response = await shippingInfoApi.get("/");
  return response.data.data;
};

export const updateShippingInfo = async (data) => {
  try {
    if (!data) {
      throw new Error("No shipping information provided.");
    }
    if (!everyFieldValid(data)) {
      throw new Error("All fields are mandatory.");
    }
    const response = await shippingInfoApi.put("/", data);
    return response.data.data;
  } catch (error) {
    throw errorMessage(error);
  }
};

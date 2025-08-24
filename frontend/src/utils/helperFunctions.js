import { loadStripe } from "@stripe/stripe-js";
import CONSTANTS from "./constants";
export const isGoodPasswordScore = (strengthScore) => {
  if (strengthScore < CONSTANTS.GOOD_PASSWORD_SCORE) {
    return false;
  }
  return true;
};

export const everyFieldValid = (obj) => {
  return Object.values(obj).every((field) => field.trim() !== "");
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

import CONSTANTS from "./constants";
export const isGoodPasswordScore = (strengthScore) => {
  if (strengthScore < CONSTANTS.GOOD_PASSWORD_SCORE) {
    return false;
  }
  return true;
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

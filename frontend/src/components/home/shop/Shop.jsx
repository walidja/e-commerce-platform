import { Container } from "react-bootstrap";
import { getShopByUserId } from "../../../api/shop";
import ShopDetails from "./ShopDetails";
import CreateShop from "./CreateShop";
import { useEffect, useState } from "react";
import RedAlert from "../../generic/RedAlert";

const Shop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    getShopByUserId()
      .then((shop) => {
        setShop(shop);
      })
      .catch((err) => {
        console.error("Error. Failed to get user shop:", err);
        setMessage(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="">
      {message && <RedAlert message={message} />}
      {isLoading ? (
        <p>Loading...</p>
      ) : shop ? (
        <ShopDetails shop={shop} />
      ) : (
        <CreateShop />
      )}
    </div>
  );
};

export default Shop;

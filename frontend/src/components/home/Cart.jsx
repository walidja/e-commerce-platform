import { useEffect } from "react";
import { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import {
  getCart,
  removeAllCartItems,
  removeFromCart,
  updateCartItems,
} from "../../api/cart";
import CartCard from "./Cart/CartCard";
import { toast } from "react-toastify";
import LoadingPage from "../generic/LoadingPage";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const getItems = async () => {
      setIsLoading(true);
      await getCart()
        .then((cart) => {
          setCart(cart);
        })
        .catch((error) => {
          console.log("Error fetching cart:", error);
          toast.error("You must be logged in to view your cart");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    getItems();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      if (!cart || !cart.cartItems) return;
      const subtotal = cart.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(subtotal);
    };
    calculateTotal();
  }, [cart]);

  const handleRemoveItem = (itemId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this item from the cart?"
      )
    ) {
      return;
    }
    setIsLoading(true);
    removeFromCart(itemId)
      .then(async () => {
        let removedItem = cart.cartItems.find((item) => item.id === itemId);
        setCart((prevCart) => ({
          ...prevCart,
          totalCart:
            prevCart.totalCart - removedItem.price * removedItem.quantity,
        }));
        toast.success("Item removed from cart");
        setCart(await getCart());
      })
      .catch((error) => {
        console.log("Error removing item from cart:", error);
        toast.error("Failed to remove item from cart");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateCart = async () => {
    // Call API to update cart items
    setIsLoading(true);
    await updateCartItems(cart.id, cart.cartItems)
      .then(async () => {
        toast.success("Cart updated successfully");
        setCart(await getCart());
      })
      .catch((error) => {
        console.log("Error updating cart:", error);
        toast.error("Failed to update cart");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleClearCart = async () => {
    setIsLoading(true);
    removeAllCartItems(cart.id)
      .then(async () => {
        setCart(await getCart());
        toast.success("Cart cleared successfully");
      })
      .catch((error) => {
        console.log("Error clearing cart:", error);
        toast.error("Failed to clear cart");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container className="mt-4">
      <LoadingPage
        isLoading={isLoading}
        pageComponent={
          <>
            <CartCard
              handleRemoveItem={handleRemoveItem}
              setCart={setCart}
              cart={cart}
              total={total}
              isOrder={false}
            />
            <div className="mx-4 d-flex justify-content-between">
              <Button variant="outline-secondary" className="m-2" href="/">
                Continue Shopping
              </Button>
              <div>
                <Button
                  variant="outline-danger"
                  className="mt-2"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="outline-success"
                  className="mt-2"
                  onClick={handleUpdateCart}
                >
                  Update Cart
                </Button>
              </div>
            </div>
          </>
        }
      />
    </Container>
  );
};

export default Cart;

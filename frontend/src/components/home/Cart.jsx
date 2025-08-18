import { useEffect } from "react";
import { useState } from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import {
  getCart,
  removeAllCartItems,
  removeFromCart,
  updateCartItems,
} from "../../api/cart";
import CartTable from "./Cart/CartTable";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const getItems = async () => {
      setIsLoading(true);
      const cart = await getCart();
      console.log(cart);
      setCart(cart);
      setIsLoading(false);
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
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{
              width: "4rem",
              height: "4rem",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              background: "white",
              borderWidth: "0.4em",
            }}
          />
        </div>
      )}
      <div style={isLoading ? { pointerEvents: "none", opacity: 0.5 } : {}}>
        <Card>
          <Card.Header as="h5">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Shopping Cart</span>
              <Button variant="outline-primary" className="ms-2">
                Checkout
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {cart && cart.cartItems.length > 0 ? (
              <CartTable
                cartItems={cart.cartItems}
                onRemoveItem={handleRemoveItem}
                setCartItems={(items) => setCart({ ...cart, cartItems: items })}
              />
            ) : (
              <Card.Text>"Your cart is currently empty." </Card.Text>
            )}
          </Card.Body>
          <Card.Footer className="text-muted">
            <div className="d-flex justify-content-between align-items-center">
              <span>Total:</span>
              <span>${cart ? cart.totalCart : total}</span>
            </div>
          </Card.Footer>
        </Card>
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
      </div>
    </Container>
  );
};

export default Cart;

import { Button, Card } from "react-bootstrap";
import CartTable from "./CartTable";

const CartCard = ({
  handleRemoveItem = () => {},
  setCart = () => {},
  cart = {},
  total = 0,
  isOrder = false,
}) => {
  return (
    <Card>
      <Card.Header as="h5">
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">
            {isOrder ? "Cart Summary" : "Shopping Cart"}
          </span>
          {!isOrder ? (
            <Button
              variant="outline-primary"
              className="ms-2"
              href="/checkout"
              disabled={cart?.cartItems?.length === 0}
            >
              Checkout
            </Button>
          ) : (
            <Button variant="outline-secondary" className="ms-2" href="/cart">
              Edit Cart
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {cart && cart.cartItems.length > 0 ? (
          <CartTable
            cartItems={cart.cartItems}
            onRemoveItem={handleRemoveItem}
            setCartItems={(items) => setCart({ ...cart, cartItems: items })}
            isOrder={isOrder}
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
  );
};

export default CartCard;

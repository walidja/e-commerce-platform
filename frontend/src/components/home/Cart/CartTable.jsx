import { CloseButton, Col, Container, FormControl, Row } from "react-bootstrap";
import ProductImage from "../../generic/productDetails/ProductImage";

const CartTable = ({ cartItems, onRemoveItem, setCartItems }) => {
  const onChangeQuantity = (e, itemId) => {
    const newQuantity = parseInt(e.target.value);
    setCartItems(
      cartItems.map((prevItem) =>
        prevItem.id === itemId
          ? { ...prevItem, quantity: newQuantity }
          : prevItem
      )
    );
  };
  return (
    <Container>
      <Row className="fw-bold text-center">
        <Col xs={1}> </Col>
        <Col xs={1}>Image</Col>
        <Col xs={5}>Name</Col>
        <Col xs={1}>Price</Col>
        <Col xs={2}>Quantity</Col>
        <Col xs={2}>Subtotal</Col>
      </Row>
      {cartItems.map((item) => (
        <Row key={item.id} className="align-items-center text-center mb-3">
          <Col xs={1}>
            <CloseButton onClick={() => onRemoveItem(item.id)} />
          </Col>
          <Col xs={1}>
            <ProductImage img={item.productModel.image} />
          </Col>
          <Col xs={5}>
            <span>{item.productModel.name}</span>
          </Col>
          <Col xs={1}>
            <span>${item.price}</span>
          </Col>
          <Col xs={2}>
            <FormControl
              type="number"
              value={item.quantity}
              onChange={(e) => onChangeQuantity(e, item.id)}
            />
          </Col>
          <Col xs={2}>
            <span>${item.price * item.quantity}</span>
          </Col>
        </Row>
      ))}
    </Container>
  );
};
export default CartTable;

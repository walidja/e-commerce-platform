import { Button, Card } from "react-bootstrap";

const ProductCard = ({ product }) => {
  return (
    <Card className="mt-3">
      {/* <Placeholder
        as="image"
        variant="top"
        animation="wave"
        src="../assets/sample-product.jpg"
        alt="Sample Product"
      /> */}
      <Card.Img variant="top" src={product.productModels[0].image} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${product.productModels[0].price}</Card.Text>
        <Button variant="primary">Add to Cart</Button>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          Stock: {product.productModels[0].stock}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;

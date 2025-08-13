import { Card } from "react-bootstrap";
import ProductImage from "./ProductImage";

const ProductCard = ({ product, handleProductClick }) => {
  return (
    <Card className="mb-3">
      <ProductImage
        cursorPointer={true}
        img={product.productModels[0].image}
        onImgClick={() => handleProductClick(product)}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${product.productModels[0].price}</Card.Text>
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

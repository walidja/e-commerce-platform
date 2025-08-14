import { Col, Form, Image, Row } from "react-bootstrap";
import CONSTANTS from "../../../utils/constants";
import ProductImage from "./ProductImage";

const ProductModelForm = ({ product, index, isEditable, handleChange }) => {
  return (
    <>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-model-name">
          Model Name
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="text"
            id="modal-model-name"
            name="name"
            value={product.productModels[index].name}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-model-description">
          Model Description
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="text"
            id="modal-model-description"
            name="description"
            value={product.productModels[index].description}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-price">
          Price:
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="number"
            step="0.01"
            id="modal-price"
            name="price"
            value={product.productModels[index].price}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-stock">
          stock:
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            id="modal-stock"
            type="number"
            name="stock"
            onChange={handleChange}
            value={product.productModels[index].stock}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-image">
          Image:
        </Form.Label>
        {isEditable && (
          <Col sm={8}>
            <Form.Control
              id="modal-image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              disabled={!isEditable}
              required
            />
          </Col>
        )}
      </Form.Group>
      {product.productModels[index].image && (
        <Col className="text-center">
          <ProductImage img={product.productModels[index].image} />
        </Col>
      )}
    </>
  );
};

export default ProductModelForm;

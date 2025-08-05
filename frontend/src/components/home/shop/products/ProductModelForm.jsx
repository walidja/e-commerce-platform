import { Col, Form, Row } from "react-bootstrap";

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
            value={product.models[index].name}
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
            value={product.models[index].description}
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
            value={product.models[index].price}
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
            value={product.models[index].stock}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-image">
          Image:
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            id="modal-image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            value={product.models[index].image}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
    </>
  );
};

export default ProductModelForm;

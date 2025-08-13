import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import CONSTANTS from "../../../utils/constants";
import ProductModelForm from "./ProductModelForm";
import DropdownButton from "../DropdownButton";
import { useEffect, useState } from "react";
import { getCategories } from "../../../api/categories";

const ProductForm = ({
  formId,
  product,
  setProduct,
  handleChange,
  saveChanges,
  isEditable,
  onAddToCart,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    getCategories()
      .then((categories) => {
        setCategories(categories);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleModelChange = (e, index) => {
    let { name, value } = e.target;
    let newModels = product.models;
    if (name === "image") {
      value = e.target.files[0];
    }
    newModels.splice(index, 1, {
      ...product.models[index],
      [name]: value,
    });
    setProduct({
      ...product,
      ["models"]: newModels,
    });
  };

  const onClickAnotherModelBtn = () => {
    // add the current model to the modles list
    setProduct({
      ...product,
      ["models"]: [...product.models, CONSTANTS.PRODUCT_MODEL],
    });
  };

  const removeModel = (index) => {
    console.log("before product.models::", product.models);
    console.log(`remove model '${index}'`);
    product.models.splice(index, 1);
    console.log("produce after remove:", product.models);

    setProduct(product);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(
      1,
      Math.min(product.productModels[0].stock, Number(e.target.value))
    );
    setQuantity(value);
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <Form id={formId} onSubmit={saveChanges}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-product-name">
          Name
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="text"
            id="modal-product-name"
            name="name"
            value={product.name}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-category">
          Category
        </Form.Label>
        <Col sm={7}>
          <DropdownButton
            required={true}
            items={categories}
            title={"categories"}
            disabled={!isEditable}
            onSelect={(item) => setProduct({ ...product, categoryId: item.id })}
            category={
              product.categoryId
                ? categories.find((cat) => cat.id === product.categoryId)
                : null
            }
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="modal-desc">
          Description
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="text"
            as={"textarea"}
            id="modal-desc"
            name="description"
            rows={2}
            value={product.description}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />
        </Col>
      </Form.Group>
      <Card>
        <Card.Header>Add Models</Card.Header>
        <Card.Body>
          {product.models.map((_, i) => (
            <>
              {isEditable && product.models.length > 1 && (
                <Button variant="outline-danger" onClick={() => removeModel(i)}>
                  Remove model
                </Button>
              )}
              <ProductModelForm
                isEditable={isEditable}
                product={product}
                index={i}
                handleChange={(e) => handleModelChange(e, i)}
                key={i}
              />
              {i < product.models.length - 1 && <hr />}
            </>
          ))}
        </Card.Body>
        <Card.Footer>
          {isEditable ? (
            <Button onClick={onClickAnotherModelBtn}>Another model?</Button>
          ) : (
            <div className="d-flex">
              <Button
                className="text-nowrap me-3"
                variant="primary"
                onClick={onAddToCart}
              >
                Add to Cart
              </Button>
              <InputGroup className="mb-2">
                <Form.Control
                  type="number"
                  min={1}
                  max={product.productModels[0].stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{ maxWidth: "60px", textAlign: "center" }}
                />
              </InputGroup>
            </div>
          )}
        </Card.Footer>
      </Card>
    </Form>
  );
};
export default ProductForm;

import { Button, Card, Col, Form, Row } from "react-bootstrap";
import CONSTANTS from "../../../../utils/constants";
import ProductModelForm from "./ProductModelForm";
import DropdownButton from "../../../generic/DropdownButton";
import { useEffect, useState } from "react";
import { getCategories } from "../../../../api/categories";

const ProductForm = ({
  formId,
  product,
  setProduct,
  handleChange,
  saveChanges,
  isEditable,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
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
    const { name, value } = e.target;
    let newModels = product.models;
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
            onSelect={(item) => setProduct({ ...product, categoryId: item.id })}
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
              {product.models.length > 1 && (
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
          <Button onClick={onClickAnotherModelBtn}>Another model?</Button>
        </Card.Footer>
      </Card>
    </Form>
  );
};
export default ProductForm;

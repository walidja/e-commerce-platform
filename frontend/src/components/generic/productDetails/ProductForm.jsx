import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import CONSTANTS from "../../../utils/constants";
import ProductModelForm from "./ProductModelForm";
import DropdownButton from "../DropdownButton";
import LoadingButton from "../LoadingButton";
import { useEffect, useState } from "react";
import { getCategories } from "../../../api/categories";
import { addToCart } from "../../../api/cart";
import { toast } from "react-toastify";

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
  const defaultQuantities = product.productModels?.map((model) => {
    return model.stock < 1 ? 0 : 1;
  });
  const [modelsQuantity, setModelsQuantity] = useState(defaultQuantities);

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
    let newModels = product.productModels;
    if (name === "image") {
      value = e.target.files[0];
    }
    newModels.splice(index, 1, {
      ...product.productModels[index],
      [name]: value,
    });
    setProduct({
      ...product,
      ["productModels"]: newModels,
    });
  };

  const onClickAnotherModelBtn = () => {
    // add the current model to the modles list
    setProduct({
      ...product,
      ["productModels"]: [...product.productModels, CONSTANTS.PRODUCT_MODEL],
    });
  };

  const removeModel = (index) => {
    product.productModels.splice(index, 1);
    setProduct(product);
  };

  const handleQuantityChange = (e, index) => {
    const value = Math.max(
      1,
      Math.min(product.productModels[index].stock, Number(e.target.value))
    );
    const newModelsQuantity = [...modelsQuantity];
    newModelsQuantity[index] = value;
    setModelsQuantity(newModelsQuantity);
  };

  const onAddToCart = (index) => {
    const cartItem = {
      productModelId: product.productModels[index].id,
      price: product.productModels[index].price,
      quantity: modelsQuantity[index],
    };
    console.log("Cart item:", cartItem);
    setIsLoading(true);
    addToCart(cartItem)
      .then(() => {
        toast.success("Item added to cart successfully!");
      })
      .catch((error) => {
        toast.error(`Error adding item to cart: ${error}`);
        console.error("Error adding to cart:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          {product.productModels.map((_, i) => (
            <>
              {isEditable && product.productModels.length > 1 && (
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
              {!isEditable && (
                <div className="d-flex mt-2">
                  <LoadingButton
                    buttonName={"Add to Cart"}
                    isLoading={isLoading}
                    form={"addto cart"}
                    onClick={() => onAddToCart(i)}
                  />
                  <InputGroup className="mt-2">
                    <Form.Control
                      className="text-center"
                      type="number"
                      min={product.productModels[i].stock < 1 ? 0 : 1}
                      max={product.productModels[i].stock}
                      value={modelsQuantity[i]}
                      onChange={(e) => handleQuantityChange(e, i)}
                      style={{ maxWidth: "70px" }}
                    />
                  </InputGroup>
                </div>
              )}

              {i < product.productModels.length - 1 && <hr />}
            </>
          ))}
        </Card.Body>
        <Card.Footer>
          {isEditable && (
            <Button onClick={onClickAnotherModelBtn}>Another model?</Button>
          )}
        </Card.Footer>
      </Card>
    </Form>
  );
};
export default ProductForm;

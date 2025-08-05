import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import LoadingButton from "../../../generic/LoadingButton";
import CONSTANTS from "../../../../utils/constants";
import ProductForm from "./ProductForm";
import { addShopProduct } from "../../../../api/shop";
import RedAlert from "../../../generic/RedAlert";

const AddProductModal = ({
  showModal,
  setShowModal,
  shopId,
  product,
  setProduct,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  if (!showModal) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const saveProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);
    addShopProduct(shopId, product)
      .then((data) => {
        console.log("The added data:", data);
        // setProduct(CONSTANTS.PRODUCT);
        setProduct({
          ...CONSTANTS.PRODUCT,
          ["models"]: [CONSTANTS.PRODUCT_MODEL],
        });
        setMessage("");
        setShowModal(false);
      })
      .catch((error) => {
        setMessage(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      size="lg"
      id="modal"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <RedAlert message={message} />
      <Modal.Body>
        <ProductForm
          formId="add-product-form"
          product={product}
          setProduct={setProduct}
          handleChange={handleChange}
          saveChanges={saveProduct}
          isEditable={true}
        />
      </Modal.Body>
      <Modal.Footer className="custom-modal-footer">
        <Button
          variant="secondary"
          onClick={() => {
            setShowModal(false);
            setProduct({
              ...CONSTANTS.PRODUCT,
              ["models"]: [CONSTANTS.PRODUCT_MODEL],
            });
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          buttonName={"Add Product"}
          form={"add-product-form"}
          isLoading={isLoading}
        />
      </Modal.Footer>
    </Modal>
  );
};
export default AddProductModal;

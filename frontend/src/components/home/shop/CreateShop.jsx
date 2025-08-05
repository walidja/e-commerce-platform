import { Container, Form } from "react-bootstrap";
import LoadingButton from "../../generic/LoadingButton";
import { useState } from "react";
import { createShop } from "../../../api/shop";
import RedAlert from "../../generic/RedAlert";
import { useNavigate } from "react-router-dom";

const CreateShop = () => {
  const [shop, setShop] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setShop((prevShop) => ({ ...prevShop, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    createShop(shop)
      .then(() => {
        setShop({ name: "", description: "" });
        // redirect to the shop page
        navigate("/shop");
      })
      .catch((error) => {
        console.log(error);
        setMessage('"Failed to create shop. Please try again later."');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <h2>Create Your Shop now, Yalla..</h2>
      {message && <RedAlert message={message} />}
      <Form id="createShopForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="name">Shop Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            required
            value={shop.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="description">Description</Form.Label>
          <Form.Control
            as="textarea"
            id="description"
            rows="3"
            required
            value={shop.description}
            onChange={handleChange}
          />
        </Form.Group>
        <LoadingButton
          isLoading={isLoading}
          buttonName={"Create Shop"}
          form={"createShopForm"}
          type="submit"
          className="btn btn-primary"
        >
          Create Shop
        </LoadingButton>
      </Form>
    </Container>
  );
};
export default CreateShop;

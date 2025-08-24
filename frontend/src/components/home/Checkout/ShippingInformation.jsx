import { Card } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import LoadingButton from "../../generic/LoadingButton";
import { everyFieldValid } from "../../../utils/helperFunctions";
import { updateShippingInfo } from "../../../api/shippingInfo";
import { toast } from "react-toastify";

const ShippingInformation = ({ ShippingInfo, setShippingInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log("Shipping Information:", ShippingInfo);
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...ShippingInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Shipping Information:", ShippingInfo);

    if (!everyFieldValid(ShippingInfo)) {
      setIsLoading(false);
      return;
    }

    if (!isValidPhoneNumber(ShippingInfo.mobile)) {
      console.log("Invalid mobile number:", ShippingInfo.mobile);
      setIsLoading(false);
      return;
    }
    await updateShippingInfo(ShippingInfo)
      .then(() => {
        toast.success("Shipping information updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating shipping information:", error);
        toast.error("Failed to update shipping information.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Card>
      <Card.Header as="h5">Shipping Information</Card.Header>
      <Card.Body>
        <Form className="mb-3" onSubmit={handleSubmit} id="shipping-info-form">
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={ShippingInfo.fullName}
              name="fullName"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="streetAddress">
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your street address"
              value={ShippingInfo.streetAddress}
              name="streetAddress"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your city"
              value={ShippingInfo.city}
              name="city"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="stateProvince">
            <Form.Label>State/Province</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your state or province"
              value={ShippingInfo.stateProvince}
              name="stateProvince"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="zipCode">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your zip code"
              value={ShippingInfo.zipCode}
              name="zipCode"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your country"
              value={ShippingInfo.country}
              name="country"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <PhoneInput
              placeholder="Enter mobile number"
              name="mobile"
              value={ShippingInfo.mobile}
              onChange={(val) =>
                setShippingInfo({ ...ShippingInfo, mobile: val })
              }
              className="rounded-pill px-4 py-2 form-control"
              required
            />
          </Form.Group>
        </Form>
      </Card.Body>
      <Card.Footer>
        <LoadingButton
          buttonName={"Save shipping information"}
          form={"shipping-info-form"}
          isLoading={isLoading}
        />
      </Card.Footer>
    </Card>
  );
};

export default ShippingInformation;

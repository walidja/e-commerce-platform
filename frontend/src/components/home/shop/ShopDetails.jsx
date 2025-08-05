// import { useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import ShopProducts from "./products/ShopProducts";
import ShopOrders from "./Orders";

const ShopDetails = ({ shop }) => {
  console.log("Shop:", shop);

  return (
    <Tab.Container id="shop tabs" defaultActiveKey="#products">
      <Row>
        <Col className="ps-4 pt-3 text-white" lg={2}>
          <Nav variant="pills">
            <Nav.Item>
              <Nav.Link href="#products">Shop products</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#orders">Shop Orders</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col lg={10}>
          <h2>{shop.name}</h2>
          <p>{shop.description}</p>

          <Tab.Content>
            <Tab.Pane eventKey="#products">
              <ShopProducts shopId={shop.id} />
            </Tab.Pane>
            <Tab.Pane eventKey="#orders">
              <ShopOrders shopId={shop.id} />
            </Tab.Pane>
          </Tab.Content>
          {/* <Outlet /> */}
        </Col>
      </Row>
    </Tab.Container>
  );
};
export default ShopDetails;

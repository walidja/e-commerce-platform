// forwardRef again here!

import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().includes(value)
          )}
        </ul>
      </div>
    );
  }
);

const DropdownButton = ({ title, items, onSelect, required }) => {
  const [selected, setSelected] = useState(null);
  const handleSelect = (eventKey) => {
    const selectedItem = items.find((item, idx) => String(idx) === eventKey);
    setSelected(selectedItem);
    if (onSelect) onSelect(selectedItem);
  };
  return (
    <div>
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle
          variant="outline-primary"
          id="dropdown-custom-components"
          className={required && !selected ? "is-invalid" : ""}
        >
          {selected ? selected.name : title}
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu}>
          {items.map((item, idx) => (
            <Dropdown.Item eventKey={String(idx)} key={item.name}>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {required && !selected && (
        <div className="invalid-feedback d-block">Please select an option.</div>
      )}
    </div>
  );
};

export default DropdownButton;

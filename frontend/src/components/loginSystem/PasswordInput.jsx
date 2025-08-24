import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Form } from "react-bootstrap";

const PasswordInput = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="position-relative">
      <Form.Control
        className="rounded-pill px-4 py-2"
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        {!showPassword ? <BsEyeSlash /> : <BsEye />}
      </span>
    </div>
  );
};

export default PasswordInput;

import { Alert } from "react-bootstrap";
const RedAlert = ({ message }) => {
  return message ? (
    <Alert variant="danger" className="mt-3 rounded-lg">
      {message}
    </Alert>
  ) : (
    <></>
  );
};

export default RedAlert;

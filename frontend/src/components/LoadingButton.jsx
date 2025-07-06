import { Button, Spinner } from "react-bootstrap";
const LoadingButton = ({ isLoading, buttonName, form }) => {
  return (
    <Button
      type="submit"
      variant="primary"
      className="font-medium rounded-2xl py-2 mt-2"
      form={form}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          className="me-2"
          aria-hidden="true"
          role="status"
        />
      ) : (
        buttonName
      )}
    </Button>
  );
};

export default LoadingButton;

import { Button, Spinner } from "react-bootstrap";
const LoadingButton = ({
  isLoading,
  buttonName,
  form,
  type = "submit",
  onClick = () => {},
}) => {
  return (
    <Button
      type={type}
      variant="primary"
      className="font-medium rounded-2xl py-2 mt-2 text-nowrap"
      form={form}
      disabled={isLoading}
      onClick={onClick}
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

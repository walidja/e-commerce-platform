import { Spinner } from "react-bootstrap";

const LoadingPage = ({ isLoading, pageComponent }) => {
  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{
              width: "4rem",
              height: "4rem",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              background: "white",
              borderWidth: "0.4em",
            }}
          />
        </div>
      )}
      <div style={isLoading ? { pointerEvents: "none", opacity: 0.5 } : {}}>
        {pageComponent}
      </div>
    </>
  );
};

export default LoadingPage;

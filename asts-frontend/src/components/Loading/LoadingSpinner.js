import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center py-5">
      <Spinner animation="grow" variant="light" size="lg" />
    </div>
  );
}

export default LoadingSpinner;

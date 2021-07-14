import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function ErrorModal(props) {
  const { error, clearError } = props;
  console.log(error);

  return (
    <Modal show={!!error} onHide={clearError}>
      <Modal.Header closeButton>
        <Modal.Title>Something went wrong!</Modal.Title>
      </Modal.Header>
      <Modal.Body>{error}</Modal.Body>
    </Modal>
  );
}

export default ErrorModal;

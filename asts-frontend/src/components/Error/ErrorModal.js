import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function ErrorModal(props) {
  const { error, errorDetails, clearError } = props;

  return (
    <Modal show={!!error} onHide={clearError} size='lg' className='pt-5'>
      <Modal.Header closeButton>
        <Modal.Title>Something went wrong!</Modal.Title>
      </Modal.Header>
      <Modal.Body>{error}</Modal.Body>
      <Modal.Footer className='d-flex pl-3 justify-content-start text-muted'>{errorDetails}</Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;

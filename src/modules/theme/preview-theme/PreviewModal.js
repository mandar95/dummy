import React from 'react';
import { Modal } from "react-bootstrap";
import { Components } from './Components';

const PreviewModal = ({ onHide, show }) => {
  
    return (
        <Modal
        onHide={onHide}
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="fullscreen-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Preview Theme
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Components />
        </Modal.Body>
      </Modal>
    );
};

export default PreviewModal;
import React from "react";
import { Modal } from "react-bootstrap";

export const QRCode = ({ show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header className='border-white' closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Download App
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='mx-auto pb-5'>
        <img alt='' src='/assets/images/employee-home/QRCode.jpg' />
      </Modal.Body>
    </Modal>
  );
};

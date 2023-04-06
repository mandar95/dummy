import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "../../components";

function ModalMessage(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Disclaimer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This is to inform that by clicking on the link you will be leaving
          employee benefit portal and entering Vivant Wellness website operated
          by other party: The use of website is also subject to the terms of use
          and other terms and guidelines if any, contained within website. In
          the event that any of the terms contained herein conflict with the
          terms of use or other terms and guidelines contained within website,
          then the terms of use and other terms and guidelines of website shall
          prevail.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button buttonStyle="danger" onClick={props.onHide}>
          Close
        </Button>
        <Button onClick={props.confirm}>Okay</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ModalMessage;

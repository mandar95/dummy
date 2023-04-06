import React from "react";
import Modal from "react-bootstrap/Modal";
import ModalContent from "./ModalContent";

const ModalComponent = (props) => {
  return (
    <Modal
      {...props}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span >Policy Balance Details</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: "auto" }}>
        <ModalContent
          TotalMembers={props.TotalMembers}
          policynoId={props?.policyNoId}
          onHide={props.onHide}
        />
      </Modal.Body>
    </Modal>
  );
};
export default ModalComponent;

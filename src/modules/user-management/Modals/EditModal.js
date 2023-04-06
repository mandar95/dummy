import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button } from 'components'

export const EditModal = (props) => {

  return (
    <Modal
      {...props}
      style={{ borderRadius: "30px" }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title className="mx-auto" id="contained-modal-title-vcenter">
          Edit
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="col-md-9 col-sm-12 text-center mx-auto">
        <h1>Edit Modal</h1>
        <Button className="mt-3" buttonStyle='danger' onClick={props.onHide}>Cancel</Button>
        <Button className="mb-3">Update</Button>
      </Modal.Body>
    </Modal>
  );
}

// PropTypes 
EditModal.propTypes = {
  props: PropTypes.object
}

// DefaultTypes
EditModal.defaultProps = {
  props: { onHide: () => { } }
}

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button } from 'components'

export const RemoveModal = ({ remove, ...props }) => {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Body className="col-md-9 col-sm-12 text-center mx-auto">
        <h4>Confirmation</h4>
        <Button className="mt-3" buttonStyle='danger' onClick={() => remove()}>Remove</Button>
        <Button className="mt-3" onClick={props.onHide} buttonStyle='outline-secondary'>Cancel</Button>
      </Modal.Body>
    </Modal>
  );
}

// PropTypes 
RemoveModal.propTypes = {
  props: PropTypes.object
}

// DefaultTypes
RemoveModal.defaultProps = {
  props: { onHide: () => { } }
}

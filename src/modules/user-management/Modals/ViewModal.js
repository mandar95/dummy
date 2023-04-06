import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button } from 'components'

export const ViewModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title className="mx-auto" id="contained-modal-title-vcenter">
          User Data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <pre>
          Name: {props.data?.name}<br />
          Email: {props.data?.email}<br />
          Account Type: {props.data?.type}<br />
          Mobile No.: {props.data?.mobile_no}
        </pre>
        <Button className="m-3" buttonStyle='danger' onClick={props.onHide}>Close</Button>
      </Modal.Body>
    </Modal>
  );
}

// PropTypes 
ViewModal.propTypes = {
  props: PropTypes.object
}

// DefaultTypes
ViewModal.defaultProps = {
  props: { onHide: () => { } }
}

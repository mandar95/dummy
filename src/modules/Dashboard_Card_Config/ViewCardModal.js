import React from "react";
import Modal from "react-bootstrap/Modal";
import { Card2 } from "../employeeHome/employeeHome";
import { useHistory } from 'react-router-dom';
const ViewCardModal = ({
  show,
  onHide,
  state,
  reducerDispatch,
  Fetch,
  Modules,
  currentUser,
}) => {
    const history = useHistory();
  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Card
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <div className="row flex-wrap justify-content-center">
            <div className="col-12 col-md-7">
                  <Card2 v={state.viewCardModalData.data} history={history} callFromHome={false} />
            </div>
          </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewCardModal;

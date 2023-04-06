import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FetchTemplate } from "./UCC.action";
const ModalComponent = ({
  show,
  onHide,
  HtmlArray,
  api = "/admin/get/email-log-template",
}) => {
  const [state, setState] = useState("");
  useEffect(() => {
    FetchTemplate(HtmlArray, setState, api);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      fullscreen={"yes"}
      aria-labelledby="contained-modal-title-vcenter"
      //   dialogClassName="my-modal"
      dialogClassName="fullscreen-modal fullheight-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span >View</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {_.isEqual(api, "/admin/get/email-log-template?id=") ? (
          <iframe
          style={{ minHeight: "580px" }}
          className="w-100 h-100"
          // src={`${process.env.REACT_APP_API_BASE_URL}${api}${HtmlArray?.master_system_trigger_id}`}
          src={`${process.env.REACT_APP_API_BASE_URL}${api}${HtmlArray}`}
          title="description"
          >
          </iframe>
        ) : ( */}
        <iframe
          style={{ minHeight: "580px" }}
          className="w-100 h-100"
          srcDoc={state}
          title="description"
        ></iframe>
        {/* )} */}
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;

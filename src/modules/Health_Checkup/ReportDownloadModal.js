import React from "react";
import { Modal } from "react-bootstrap";
import classes from "./index.module.css";

const ReportDownloadModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg">

      <Modal.Header closeButton>
        <Modal.Title>
          {<h5 className={classes.redColor}>Download Documents</h5>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row w-100 justify-content-center align-items-center flex-wrap">
          {(props?.id?.document_url?.length > 0) ? (
            props?.id?.document_url?.map((data, i) => <div key={"document_url" + i} className="col-12 text-center justify-content-center my-2 w-100">
              <a style={{ wordBreak: "break-word" }} className="btn btn-primary btn-sm text-light" href={data} download target="_blank" rel="noopener noreferrer">Download {props?.id?.document_name[i]}</a>
            </div>)
          ) : "No Report Found"}

        </div>
      </Modal.Body>
      <Modal.Footer>

      </Modal.Footer>

    </Modal>
  );
};

export default ReportDownloadModal;

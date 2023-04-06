import React from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { Head } from "../plan-configuration/style";
import { DataTable } from "modules/user-management";
import { TableDataDefView } from "./helper.js";

export const EditModal = ({ show, onHide, Data }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>{"Deficiency Trail"}</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mr-5 ml-5">
        <Row className="d-flex justify-content-center flex-wrap">
          <Col sm={12} lg={12} md={12} xl={12}>
            <DataTable
              columns={TableDataDefView || []}
              data={Data || []}
              noStatus={true}
              pageState={{ pageIndex: 0, pageSize: 5 }}
              pageSizeOptions={[5, 10]}
              rowStyle
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={() => onHide()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

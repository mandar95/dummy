import React, { useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { DataTable } from "modules/user-management";
import { approvePolicy } from 'modules/policies/approve-policy/approve-policy.slice';
import { AuditTrailColumn } from './enrollments/AuditTrailEnrollment';
import { Loader, NoDataFound } from '../../../components';
import { clearAuditTrail, loadAuditTrail } from '../approve-policy/approve-policy.slice';
import { createGlobalStyle } from "styled-components";

export const AuditTrailModal = ({ show, onHide, policy_id }) => {

  const dispatch = useDispatch();

  const { loading, audit_trail } = useSelector(approvePolicy);

  useEffect(() => {
    dispatch(loadAuditTrail(policy_id));

    return () => {
      dispatch(clearAuditTrail())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span>Audit Trail Detail</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xl={12} lg={12} md={12} sm={12} style={{}}>
            {loading && !audit_trail.length ? (<Loader />) :
              audit_trail.length ? (
                <DataTable
                  columns={AuditTrailColumn}
                  data={audit_trail}
                  noStatus
                  rowStyle
                  pageState={{ pageIndex: 0, pageSize: 5 }}
                  pageSizeOptions={[5, 10, 20]}
                />
              ) : (<NoDataFound />)}
          </Col>
          <GlobalStyle />
        </Row>
      </Modal.Body>
    </Modal>
  );
};

const GlobalStyle = createGlobalStyle`
.table-responsive {
  width: auto;
  margin: 0px -14px;
}
`

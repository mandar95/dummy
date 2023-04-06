import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';

import { Modal, Row, Col, Table } from 'react-bootstrap';

import { initialState, loadAuditData, reducer } from './qcr.action';
import { TableDiv } from '../../../../../policies/steps/premium-details/styles';

const style = { zoom: '0.9' }

export const AuditDetails = ({ show, onHide }) => {
  const [{ audit_details }, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (show.original.id) {
      loadAuditData(dispatch, { quote_id: show.original.id })
    }
  }, [show])

  return (
    <Modal
      show={!!show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>{'Audit Slip'}</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row className='d-flex justify-content-center m-1 p-2'>

          <Col md={12} lg={4} xl={4} sm={12} className='mb-3'>
            <img
              src={'/assets/images/users/Audit-vector.png'}
              className="mx-auto"
              width="auto"
              height={150}
              alt="img"
            />
          </Col>
          <Col md={12} lg={8} xl={8} sm={12} className='mb-3'>
            <div className='d-flex justify-content-between'>
              <TitleSpan>Placement Slip Created On -</TitleSpan>
              <OutputSpan>{audit_details?.placement_slip_created_no || "-"}</OutputSpan>
            </div>
            {/* <div className='d-flex justify-content-between'>
              <TitleSpan>Placement Slip Send To Insurer -</TitleSpan>
              <OutputSpan>{audit_details?.placement_slip_send_to_insurer || "-"}</OutputSpan>
            </div>
            <div className='d-flex justify-content-between'>
              <TitleSpan>Send To Insurer On -</TitleSpan>
              <OutputSpan>{audit_details?.send_to_insurer_on || "-"}</OutputSpan>
            </div> */}
            <div className='d-flex justify-content-between'>
              <TitleSpan>Modified On -</TitleSpan>
              <OutputSpan>{audit_details?.quote_slip_modified_on || "-"}</OutputSpan>
            </div>
            <div className='d-flex justify-content-between'>
              <TitleSpan>Quote Slip generated on -</TitleSpan>
              <OutputSpan>{audit_details?.quote_slip_generated_on || "-"}</OutputSpan>
            </div>
          </Col>
          {!!audit_details?.audit?.length && <TableDiv className='col col-xl-8 col-lg-10 col-md-12 col-sm-12'>
            <Table
              className="text-center rounded text-nowrap"
              style={{ border: "solid 1px #e6e6e6" }}
              responsive
            >
              <thead>
                <tr>
                  <th style={style} className="align-top">
                    Name
                  </th>
                  <th style={style} className="align-top">
                    Email
                  </th>
                  <th style={style} className="align-top">
                    Type
                  </th>
                  <th style={style} className="align-top">
                    Sent On
                  </th>
                </tr>
              </thead>
              <tbody>
                {audit_details?.audit?.map(({ email, placement_slip_send_to, send_to_insurer_on, sendto }, index) => <tr key={index + 'top_base'}>
                  <td>
                    {placement_slip_send_to}
                  </td>
                  <td>
                    {email}
                  </td>
                  <td>
                    {sendto}
                  </td>
                  <td>
                    {send_to_insurer_on}
                  </td>
                </tr>
                )}
              </tbody>
            </Table>
          </TableDiv>}
        </Row>
      </Modal.Body>
    </Modal>
  );
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`

const TitleSpan = styled.span`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
letter-spacing: 1px;
`
const OutputSpan = styled(TitleSpan)`
font-weight:bold;
`

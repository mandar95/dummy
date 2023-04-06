import React from 'react';
import styled from 'styled-components';

import { Modal, Row, Col } from 'react-bootstrap';

export const AuditDetails = ({ show, onHide }) => {

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
          <Head>{'Audit Details'}</Head>
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
              <TitleSpan>Created On -</TitleSpan>
              <OutputSpan>{show?.created_at || "-"}</OutputSpan>
            </div>
            <div className='d-flex justify-content-between'>
              <TitleSpan>Created By -</TitleSpan>
              <OutputSpan>{show?.created_by || "-"}</OutputSpan>
            </div>
            {show?.updated_at && <div className='d-flex justify-content-between'>
              <TitleSpan>Updated On -</TitleSpan>
              <OutputSpan>{show?.updated_at || "-"}</OutputSpan>
            </div>}
            {show?.updated_by && <div className='d-flex justify-content-between'>
              <TitleSpan>Updated By -</TitleSpan>
              <OutputSpan>{show?.updated_by || "-"}</OutputSpan>
            </div>}
            {show?.deleted_at && <div className='d-flex justify-content-between'>
              <TitleSpan>Deleted On -</TitleSpan>
              <OutputSpan>{show?.deleted_at || "-"}</OutputSpan>
            </div>}
            {show?.deleted_by && <div className='d-flex justify-content-between'>
              <TitleSpan>Deleted By -</TitleSpan>
              <OutputSpan>{show?.deleted_by || "-"}</OutputSpan>
            </div>}

          </Col>

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

import React, { useEffect, useState } from "react";
import styled from 'styled-components';

import { Modal, Row, Col } from "react-bootstrap";
import { downloadFile, isValidHttpUrl } from "../../../utils";
import { findExtension } from "../portal-claim/view-claim/step/third";
import { Tab, TabWrapper } from "../../../components";
import { isString } from "lodash";

const DataKey = [
  { label: 'deduction_sheet', name: 'Deduction Sheet' },
  { label: 'calculation_sheet', name: 'Calculation Sheet' },
  { label: 'query_letter', name: 'Query Letter' },
  { label: 'denial_letter', name: 'Denial Letter' },
  { label: 'rejection_letter', name: 'Rejection Letter' },
  { label: 'final_settlement_letter', name: 'Final Settlement Letter' }
]

export const DocumentsModal = ({ data, onHide, show }) => {

  const [tab, setTab] = useState(1);

  useEffect(() => {
    if (!data.tpa_claim_documents?.length) {
      setTab(2)
    }
  }, [data])

  return (
    <Modal
      onHide={onHide}
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Claim Documents & Letters
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Wrapper>
          {!!data.tpa_claim_documents?.length && DataKey.some(({ label }) => data[label]) &&
            <Col xl={12} lg={12} md={12} sm={12} className='d-flex justify-content-center'>
              <TabWrapper width={'max-content'}>
                <Tab isActive={tab === 1} onClick={() => setTab(1)}>Claim Documents</Tab>
                <Tab isActive={tab === 2} onClick={() => setTab(2)}>Claim Letters</Tab>
              </TabWrapper>
            </Col>}
          {tab === 1 && data.tpa_claim_documents?.map((elem, index) => {
            let document_name = '';
            let document_url = '';
            if (isString(elem)) {
              document_name = 'Document-' + (index + 1);
              document_url = (isValidHttpUrl(elem) ? elem : (elem.length > 6) ? 'https://' + elem : '') || ''
            }
            else {
              document_name = elem.document_name
              document_url = (isValidHttpUrl(elem.document_url) ? elem.document_url : (elem.document_url?.length > 6) ? 'https://' + elem.document_url : '') || ''
            }

            return !!(document_name && document_url) &&
              <Col xl={2} lg={3} md={6} sm={12} className='py-4' key={index + '-tpa_claim_documents'}>
                <div className="div--project" onClick={() => downloadFile(document_url, undefined, true)}>
                  {["png", "jpg", "jpeg", "gif"].includes(
                    findExtension(document_url)
                  ) ? (
                    <div className="project" style={{ backgroundImage: `url(${document_url})` }}></div>
                  ) : (
                    <div className="project project1"></div>
                  )}
                  <div className="project--title">
                    <h6>{document_name}</h6>
                  </div>
                </div>
              </Col>
          })}
          {tab === 2 && DataKey.map(({ label, name }) => data[label] && (
            <Col xl={2} lg={3} md={6} sm={12} className='py-4'>
              <div className="div--project" onClick={() => downloadFile(data[label], undefined, true)}>
                {["png", "jpg", "jpeg", "gif"].includes(
                  findExtension(data[label])
                ) ? (
                  <div className="project" style={{ backgroundImage: `url(${data[label]})` }}></div>
                ) : (
                  <div className="project project1"></div>
                )}
                <div className="project--title">
                  <h6>{name}</h6>
                </div>
              </div>
            </Col>
          ))}
        </Wrapper>
      </Modal.Body>
    </Modal>
  );
};


const Wrapper = styled(Row)`
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    cursor: pointer;
 a{
    width: 40%;
    min-width: 30.0rem;
    flex-grow: 1;
}
.div--project{
    width: 100%;
    height: 17vw;
    min-height: 250px;
    background-color: rgba(0, 0, 0);
    position: relative;
    overflow: hidden;
    border-radius: 0.4rem;
    cursor: pointer;
    box-shadow: -0.5rem -0.5rem 2.0rem rgba(0, 0, 0, 0.2), 0.5rem 0.5rem 2.0rem rgba(0, 0, 0, 0.2);
}
.div--project:hover .project--title{
    transform: translateY(100%);
}
.div--project:hover .project{
    opacity: 1;
}
.project--title{
    background-color: rgba(32,37,41,0.5);
    backdrop-filter: blur(0.5rem);
    width: 100%;
    color: #fff;
    height: 30%;
    position: absolute;
    bottom: 0%;
    padding: 1.0rem;
    border-top: 0.1rem solid #4C555C;
    box-shadow: 0rem -0.1rem 0.5rem rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    transition: 0.2s ease-in;
    h6{
      word-break: break-word;
      overflow: hidden;
    height: max-content !important;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    }
    
}
.project{
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    opacity: 0.8;
    transition: 0.2s ease-in-out;
}
.project1{
    background-image: url("/assets/images/icon/document-icon.jpeg");
}
`

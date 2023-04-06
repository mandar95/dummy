import React from "react";
import styled from 'styled-components';

import { Modal, Row, Col } from "react-bootstrap";
import { downloadFile } from "../../../utils";
import { findExtension } from "../../claims/portal-claim/view-claim/step/third";

export const DocumentsModal = ({ onHide, show }) => {


  return (
    <Modal
      onHide={onHide}
      show={!!show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {show[0].document_type === 1 ? 'Policy Document' : 'CD Statement'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Wrapper>

          {show.map(({ document_path, document_name }) => (
            <Col xl={6} lg={6} md={12} sm={12} className='py-4'>
              <div className="div--project" onClick={() => downloadFile(document_path, undefined, true)}>
                {["png", "jpg", "jpeg", "gif"].includes(
                  findExtension(document_path)
                ) ? (
                  <div className="project" style={{ backgroundImage: `url(${document_path})` }}></div>
                ) : (
                  <div className="project project1"></div>
                )}
                <div className="project--title">
                  <h6>{document_name}</h6>
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

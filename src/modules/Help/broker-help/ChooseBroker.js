import React from "react";
import styled from "styled-components";

import { Modal, Row, Col } from "react-bootstrap";
import { CardContentConatiner } from "../../Insurance/style";

const Data = [
  { name: 'Post Sale', url: '/assets/images/businessman-is-thinking-idea-illustration_39663-280.jpg', value: 'normal' },
  { name: 'Pre Sale', url: '/assets/images/website-faq-section-user-help-desk-customer-support-frequently-asked-questions-problem-solution-quiz-game-confused-man-cartoon-character_335657-1602.jpg', value: 'rfq' }
]
const ChooseBroker = ({ show, onHide, setHelpType }) => {


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Help Type</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Row className="d-flex flex-wrap">
          {Data.map(({ name, url, value }) =>

            <Col md={12} lg={6} xl={6} sm={12} key={value + 'broker-choose'} className='p-3'>
              <div
                className="card"
                style={{
                  borderRadius: "18px",
                  boxShadow: "1px 1px 15px rgba(179, 179, 179, 0.5)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setHelpType(value)
                  onHide()
                }}
              >
                <div className="card-body card-flex-em">
                  <div
                    className="row rowButton2"
                    style={{
                      marginRight: "-15px !important",
                      marginLeft: "-15px !important",
                    }}
                  >
                    <CardContentConatiner>
                      <div className="col-md-10 text-center mb-2 mx-auto">
                        <img
                          src={url}
                          className="mx-auto"
                          width="150"
                          height="auto"
                          alt="img"
                        />
                      </div>

                      <div className="col-md-12 text-center"><Head>{name}</Head></div>
                    </CardContentConatiner>
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>

      </Modal.Body>
    </Modal>
  );
};

export default ChooseBroker;

const Head = styled.span`
	text-align: center;
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
	
	letter-spacing: 1px;
	color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`;

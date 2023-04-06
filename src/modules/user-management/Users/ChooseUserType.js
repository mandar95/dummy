import React from "react";
import styled from "styled-components";

import { Modal, Row, Col } from "react-bootstrap";
import { CardContentConatiner } from "../../Insurance/style";

const Data = {
  1: [
    { name: 'Organization User', url: '/assets/images/users/user-min.jpg', value: '/broker-create-user' },
    { name: 'Employer User', url: '/assets/images/users/employer-min.jpg', value: '/broker-create-employer' }
  ],
  2: [
    { name: 'Broker', url: '/assets/images/users/user-min.jpg', value: '/onboard-broker' },
    { name: 'Employer', url: '/assets/images/users/employer-min.jpg', value: '/onboard-employer' },
    { name: 'Insurer', url: '/assets/images/users/10921-min.jpg', value: '/onboard-insurer' }
  ],
  3: [
    { name: 'Organization User', url: '/assets/images/users/super-min.jpg', value: '/admin-create-user' },
    { name: 'Broker User', url: '/assets/images/users/user-min.jpg', value: '/admin-create-broker' },
    { name: 'Employer User', url: '/assets/images/users/employer-min.jpg', value: '/admin-create-employer' },
    { name: 'Insurer User', url: '/assets/images/users/10921-min.jpg', value: '/admin-create-insurer' },
  ]
}

export const ChooseUserType = ({ show, onHide, history }) => {


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
          <Head>User Type</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Row className="d-flex flex-wrap justify-content-center">
          {Data[show].map(({ name, url, value, height = 130 }) =>

            <Col md={12} lg={6} xl={6} sm={12} key={value + 'broker-choose'} className='p-3'>
              <div
                className="card"
                style={{
                  borderRadius: "18px",
                  boxShadow: "1px 1px 15px rgba(179, 179, 179, 0.5)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  history.push(value)
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
                          width="auto"
                          height={height}
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

const Head = styled.span`
	text-align: center;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
	
	letter-spacing: 1px;
	color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`;

import React from "react";
import styled from "styled-components";

import { Modal, Row, Col } from "react-bootstrap";
import { CardContentConatiner } from "../../Insurance/style";
import { handleAzureLogin } from "./login.slice";
import { useDispatch } from "react-redux";

import AppDetail from './appLink'

export function isMobileIOS() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  // if (/windows phone/i.test(userAgent)) {
  //     return "Windows Phone";
  // }

  // if (/android/i.test(userAgent)) {
  //     return "Android";
  // }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true/* "iOS" */;
  }

  return false/* "Android" */;
}

const Data = [
  { name: 'Open with Web', imgUrl: '/assets/images/icon/web.png' },
  { name: 'Open with App', imgUrl: '/assets/images/icon/mobile.png' }
]
export const MobileChooseModal = ({ show, onHide, paramObj, queryKeys, setType }) => {

  const dispatch = useDispatch();

  const onClick = (type) => {
    switch (type) {
      case 'Open with App':
        setTimeout(function () {
          window.location = isMobileIOS() ? AppDetail.appStoreURL : AppDetail.playStoreURL;
        }, 250);
        window.location = `${AppDetail.appName}://${queryKeys}`;
        break;
      default:
        dispatch(handleAzureLogin(paramObj));
    }
  }

  return (
    <Modal
      show={!!show}
      onHide={onHide}
      backdrop={'static'}
      keyboard={false}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Login</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Row className="d-flex flex-wrap justify-content-center">
          {Data.map(({ name, imgUrl, value, height = 130 }) =>

            <Col md={12} lg={6} xl={6} sm={12} key={value + 'broker-choose'} className='p-3'>
              <div
                className="card"
                style={{
                  borderRadius: "18px",
                  boxShadow: "1px 1px 15px rgba(179, 179, 179, 0.5)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onClick(name);
                  (name === 'Open with App') ? onHide() : setType(2);
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
                          src={imgUrl}
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
	font-weight: 700;
	letter-spacing: 1px;
	/* color: ${({ theme }) => theme?.Tab?.color || '#6334E3'}; */
  color: #3f97e7;
`;

import React, { useState } from 'react';
import styled from 'styled-components';
import Slide from 'react-reveal/Slide';

import { Row, Col } from 'react-bootstrap';
import { Button, Loader } from '../../../../components';
import { Link } from 'react-router-dom';

import OTPEditModal from "./modal";
import { useSelector } from 'react-redux';

export const MainContent = () => {
  const [OTPModal, setOTPModal] = useState(null);
  const { loading } = useSelector(state => state.RFQHome);
  return (
    <>
      <Row className="d-flex flex-wrap">
        <Col md={12} lg={6} xl={6} sm={12}>
          <Slide left delay={800} duration={1500}>
            <Title>Benefitz</Title>
            <H5>A comprehensive solution which can help manage employee benefits with ease</H5>
            <div className='p-3'>
              <Link to='/login'>
                <Button
                  className='mr-3 mb-3'
                  buttonStyle="outline-solid">
                  Login
          </Button>
              </Link>

              <Link to="/company-details">
                <Button
                  // onClick={() => setOTPModal(true)}
                  buttonStyle="outline-solid"
                  hex2="#0084f4"
                  hex1="#00c48c"
                >
                  Get Quotes
            </Button>
              </Link>
            </div>
          </Slide>
        </Col>
        <ImageCol md={12} lg={6} xl={6} sm={12} className='text-center'>
          <Slide right delay={800} duration={1500}>
            <Image src="/assets/images/Home.png" alt="Close" />
            {/* <Image style={{right: '-97px',top: '109px'}} src="/assets/images/landing-page/broker2.png" alt="Close" />
        <Image style={{right: '48px',top: '459px'}} src="/assets/images/landing-page/broker3.png" alt="Close" />
        <Image style={{right: '368px',top: '246px'}} src="/assets/images/landing-page/broker4.png" alt="Close" /> */}
          </Slide>
        </ImageCol>
      </Row>
      {!!OTPModal &&
        <OTPEditModal
          show={OTPModal}
          onHide={() => setOTPModal(false)}
        />
      }
      {(loading) && <Loader />}
    </>
  )
}

const Title = styled.p`
margin-top: 50px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(4rem + ${fontSize - 92}%)` : '4rem'};

line-height: 1.2;`

const H5 = styled.h5`
max-width: 480px;
`

const ImageCol = styled(Col)`
min-height: 550px;
color: #FFF;
height:auto;
`

const Image = styled.img`
height:auto;
width:60%;
@media (max-width: 500px) {
  width: 100%;
}`

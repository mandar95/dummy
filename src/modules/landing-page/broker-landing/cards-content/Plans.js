import React from 'react';
import styled from 'styled-components';

// import { PlanCard } from '../../../../components';
import { Row, Col } from "react-bootstrap";
import Carousel from "../../employer/carousel";

export const Plans = ({ plans = [] }) => {

  return (

    <Row id='plans_carousel' className="d-flex flex-wrap mt-5 mb-5">
      <Col md={12} lg={12} xl={12} sm={12} className='text-center'>
        <Title>No Hidden Charges! Choose your Plan.</Title>
      </Col>
      <Col md={12} lg={12} xl={12} sm={12}>
        <Carousel Data={plans} />
      </Col>
      {/* <Col md={12} lg={4} xl={4} sm={12}>
          // <PlanCard />
        </Col>
        <Col md={12} lg={4} xl={4} sm={12}>
          <PlanCard />
        </Col>
        <Col md={12} lg={4} xl={4} sm={12}>
          <PlanCard />
        </Col> */}
    </Row>
  )
}


const Title = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.8rem + ${fontSize - 92}%)` : '2.8rem'};

line-height: 1.2;
margin-bottom: 60px;`

/*
button_url: "google.com"
description: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
hex1: "#505050"
hex2: "#E8E8E8"
id: 5
name: "Silver"
price: 50000
see_detail_url: "google.com"
tagline: null

button_url: "https://www.google.com/"
description: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
hex1: "#505050"
hex2: "#E8E8E8"
id: 1
name: "Silver"
price: 5000
see_detail_url: "https://www.google.com/"
tagline: null*/

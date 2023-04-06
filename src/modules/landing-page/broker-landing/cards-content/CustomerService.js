import React from 'react';
import styled from 'styled-components';

import { LandingCard } from '../../../../components';
import { Row, Col } from 'react-bootstrap';

const Images = [
  '/assets/images/landing-page/customers.png',
  '/assets/images/landing-page/policies.png',
  '/assets/images/landing-page/claims.png',
]

export const CustomerService = ({ customer_service }) => {

  return (
    <Row className="d-flex flex-wrap mt-5 mb-5">
      <Col md={12} lg={12} xl={12} sm={12} className='text-center'>
        <Title>Take Your Customer Services To The Next Level</Title>
      </Col>
      <Col md={12} lg={4} xl={4} sm={12}>
        <LandingCard data={customer_service[0]} image={Images[0]} />
      </Col>

      <Col md={12} lg={4} xl={4} sm={12}>
        <LandingCard data={customer_service[1]} image={Images[1]} />
      </Col>

      <Col md={12} lg={4} xl={4} sm={12}>
        <LandingCard data={customer_service[2]} image={Images[2]} />
      </Col>
    </Row>
  )
}

const Title = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.8rem + ${fontSize - 92}%)` : '2.8rem'};

line-height: 1.2;`

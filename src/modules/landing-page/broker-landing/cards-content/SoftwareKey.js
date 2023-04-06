import React from 'react';
import styled from 'styled-components';
import Slide from 'react-reveal/Slide';
import Fade from 'react-reveal/Fade';

import { LandingCard } from '../../../../components';
import { Row, Col } from 'react-bootstrap';

const Images = [
  '/assets/images/landing-page/customer & policy.png',
  '/assets/images/landing-page/automation.png',
  '/assets/images/landing-page/reporting made easy.png',
]

export const SoftwareKey = ({ benefits }) => {

  return (
    <Row className="d-flex flex-wrap align-items-center mt-5 mb-5">
      <Col md={12} lg={4} xl={4} sm={12} className='text-center'>
        <Slide left>
          <Title>Insurance Broker Software Key Benefits</Title>
        </Slide>
      </Col>
      <Col md={12} lg={4} xl={4} sm={12}>
        <Fade>
          <LandingCard data={benefits[1]} image={Images[1]} />
        </Fade>
      </Col>

      <Col md={12} lg={4} xl={4} sm={12}>
        <Slide right>
          <LandingCard data={benefits[0]} image={Images[0]} />
          <LandingCard data={benefits[2]} image={Images[2]} />
        </Slide>
      </Col>
    </Row>
  )
}

const Title = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.8rem + ${fontSize - 92}%)` : '2.8rem'};

line-height: 1.2;`

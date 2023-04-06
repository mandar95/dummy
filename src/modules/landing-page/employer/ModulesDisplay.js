import React, { useState } from 'react';
import styled from 'styled-components';

import { Row, Col } from 'react-bootstrap';
import Roll from 'react-reveal/Roll';

export const ModulesDisplay = ({ stepers }) => {
  const [focus, setFocus] = useState(0);

  return (
    <>
      <Title>Brain of the system</Title>
      <Row className="d-flex flex-wrap mb-5">
        <Col md={5} lg={5} xl={5} sm={5} className="align-self-center" style={{ transition: "ease-in-out 0.2s" }}>
          {stepers?.map((module, index) => (
            <SubTitle key={index + 'brain-system'} onClick={() => setFocus(index)} active={(focus === index) ? true : false}><Number active={(focus === index) ? true : false} >{index + 1}</Number> {module.title}</SubTitle>
          ))}
        </Col>
        <ImageCol md={7} lg={7} xl={7} sm={7}>
          <Roll left>
            <Image src={stepers?.length && stepers[focus]?.image} alt='image' />
            <ModuleCard>
              <Icon src="/assets/images/landing-page/bulb.png" alt='image' />
              <Holder>{stepers[focus] && stepers[focus]?.description}</Holder>
            </ModuleCard>
          </Roll>
        </ImageCol>
      </Row>
    </>
  )
}


const Title = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.8rem + ${fontSize - 92}%)` : '2.8rem'};

line-height: 1.2;
`

const Number = styled.span`
color: #8c8c8c;

padding-right: 2.5rem;
font-size: ${({ theme, active }) => theme.fontSize ? `calc(${active ? "1.4rem" : "1.1rem"} + ${theme.fontSize - 92}%)` : (active ? "1.4rem" : "1.1rem")};
color: ${({ active }) => (active ? "#0066ff" : "#8c8c8c")};
transition:ease-in-out 0.2s;
transition-duration:0.2s;
`

const SubTitle = styled.span`
cursor: pointer;

display: block;
margin: 2.5rem 0;
font-size: ${({ theme, active }) => theme.fontSize ? `calc(${active ? "1.5rem" : "1.2rem"} + ${theme.fontSize - 92}%)` : (active ? "1.5rem" : "1.2rem")};
color: ${({ active }) => (active ? "#0066ff" : "#8c8c8c")};
transition:ease-in-out 0.2s;
transition-duration:0.2s;
`
const ImageCol = styled(Col)`
color: #FFF;
height:auto;
background-repeat: repeat;
background-size: 300px 300px;
background-image: url('/assets/images/landing-page/dot-shape.png')
`

const Image = styled.img`
height:auto;
width:100%;

`
const Icon = styled.img`
background: linear-gradient(11.43deg,#20c4a4 0%,#11ffbb 100%);
border-radius: 50%;
padding: 0.7rem;
max-width: 50px;
`
const ModuleCard = styled.div`
margin: -30px 0 0 0;`

const Holder = styled.div`
background-color: #ffffff;
color: #1557cc;

font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
`

import React from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "../../../components";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const MainContent = () => {
  return (
    <RowDiv className="d-flex flex-wrap h-100">
      <Col md={5} lg={5} xl={5} sm={12} className='h-100'>
        <p className="display-3">Benefitz</p>
        <h4>
          A comprehensive solution which can help manage employee benefits with
          ease
        </h4>
        <div style={{ paddingTop: "10px" }}>
          <Link to="/login">
            <Button
              buttonStyle="outline-solid"
              hex1="#009933"
              hex2="#99ff99"
              style={{ boxShadow: "0 6.7px 5.3px rgba(0, 0, 0, 0.048)" }}
            >
              Login
            </Button>
          </Link>
        </div>
      </Col>
      <Col md={5} lg={5} xl={5} sm={12}>
        <IMG
          src="/assets/images/headerSide.png"
          alt="headerImg"
          width="460"
          height="460"
          style={{ zIndex: "200", float: "right", marginRight:'-20px'}}
        /> 
      </Col>
    </RowDiv>
  );
};

// const ColDiv = styled(Col)`
//   float: right;
//   height: 100%;
//   background-image: url("/assets/images/headerSide.png");
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: 100% 100%;
//   @media (max-width: 767px) {
//   }
// `;

const IMG = styled.img`
  
  @media (max-width: 768px) {
    display:none;
  }
`;

const RowDiv = styled(Row)`
  color: white;
  @media (max-width: 767px) {
    color: black;
  }
`;

import React from "react";
import { Row, Col } from "react-bootstrap";
import _ from "lodash";
import styled, { keyframes } from "styled-components";
import Fade from "react-reveal/Fade";
import { useSelector } from "react-redux";

const MobileTile = (props) => {
  const Data = props?.Data;
  const { globalTheme } = useSelector(state => state.theme)
  return (
    <Row className="h-100">
      <Col xs={12} sm={12} md={12} lg={7} xl={7}>
        <Fade left delay={100}>
          <h2>Get the Employee Benefitz App</h2>
        </Fade>
        <Fade left delay={200}>
          <h5>Get Control of all your insurance needs anywhere,anytime</h5>
        </Fade>
        <div style={{ paddingTop: "20px" }}>
          <Fade left delay={350}>
            {!_.isEmpty(Data?.benefit_features) ? (
              Data?.benefit_features?.map((item, index) => (
                <p key={index + 'feature'} style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px' }}>
                  <i className="fa fa-star" style={{ color: "#ffcc00" }} />{" "}
                  {item}
                </p>
              ))
            ) : (
              <noscript />
            )}
          </Fade>
        </div>
        <div style={{ paddingTop: "40px" }}>
          <Fade delay={1400} duration={1000}>
            <a
              href={Data?.app_url ? Data?.app_url : "/broker"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/images/playstore.png"
                alt="plystr"
                height="100"
                width="100"
              />
            </a>
          </Fade>
        </div>
      </Col>
      <Col xs={12} sm={12} md={12} lg={5} xl={5}>
        <Fade right delay={500}>
          <Div></Div>
        </Fade>
      </Col>
    </Row>
  );
};

const Animation = keyframes`
 0% { background-image:url("/assets/images/m0.png"); }
 25% { background-image:url("/assets/images/m1.png"); }
 50% { background-image:url("/assets/images/m2.png"); }
 75% { background-image:url("/assets/images/m3.png"); }
 100% { background-image:url("/assets/images/m4.png"); }
`;

const Div = styled.div`
  animation-name: ${Animation};
  animation-timing-function: ease-in-out;
  -webkit-animation-timing-function: ease-in-out;
  animation-direction: alternate;
  transition: transform 1s ease-in-out 0s;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  float: right;
  /*height:40rem*/
  height: 90vh;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 80%;
  @media (max-width: 991px) {
    width:459px;
    float:left;
  }
  @media (max-width: 767px) {
    width:459px;
    float:left;
  }
  @media (max-width: 480px) {
    background-size: 340px;
    background-position-x: -15px;
    height: 500px;
    width: 300px;
  }
  @media (max-width: 360px) {
    background-size: 280px;
    background-position-x: -33px;
    height: 500px;
    width: 250px;
  }
`;

export default MobileTile;

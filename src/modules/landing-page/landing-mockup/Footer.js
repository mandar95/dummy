import React from "react";
import styled from "styled-components";
import { TextContent } from "./InsureYourLife";

const Footer = () => {
  return (
    <FooterContainer>
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="content d-flex align-items-center">
        <div className="d-flex flex-column flex-md-row w-100 justify-content-around align-items-center px-5">
          <TextContent>
            <h4 className="text-white">
              Friendly and helpful <br /> support when you need it.
            </h4>
          </TextContent>
          <div className="d-flex footer-button">
            <TextContent color={"#efdc009e"}>
              <button className="text-light px-4 py-3">
                <p className="m-0">Get Started</p>
              </button>
            </TextContent>
            <TextContent color={"#ef6ea7"}>
              <button className="text-light ml-md-5 ml-0 px-4 py-3">
                <p className="m-0">Get Support</p>
              </button>
            </TextContent>
          </div>
          <div></div>
        </div>
      </div>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  position: relative;
  .top {
    background: #fff;
    height: 200px;
  }
  .bottom {
    background: #e9a7c6;
    height: 200px;
  }
  .content {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: #ff4094;
    height: 300px;
    width: 85%;
    border-radius: 3rem;
  }
  @media (max-width: 767px) {
    .top {
      height: 120px;
    }
    .bottom {
      height: 120px;
    }
    .content {
      height: 160px;
    }
    .footer-button {
      width: 212px;
    }
  }
`;

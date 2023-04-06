import React from "react";
import Header from "./Header";
import styled from "styled-components";
import InsureYourLife from "./InsureYourLife";
import RewardingCover from "./RewardingCover";
import InternetGeneration from "./InternetGeneration";
import ClientReview from "./ClientReview";
import Footer from "./Footer";

const LandingMockup = () => {
  return (
    <>
      <Header />
      <Container>
        <InsureYourLife />
      </Container>
      <InternetGeneration />
      <Container>
        <RewardingCover />
      </Container>
      <ClientReview />
      <Footer />
    </>
  );
};

export default LandingMockup;

export const Container = styled.div`
  width: 85%;
  margin: auto;
  @media (max-width: 1024px) {
    width: 95%;
  }
`;

export const IconBg = styled.span`
  width: ${({ width }) => (width ? width : "40px")};
  height: ${({ height }) => (height ? height : "40px")};
  padding: 10px;
  background: ${({ bgColor }) => (bgColor ? bgColor : "#ffe4df")};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize ? fontSize : "1.3rem"} + ${theme.fontSize - 92}%)` : (fontSize ? fontSize : "1.3rem")};
  }
`;

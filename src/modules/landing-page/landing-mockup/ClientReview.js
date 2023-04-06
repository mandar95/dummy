import React from "react";
import { Container } from "./LandingMockup";
import { TextContent } from "./InsureYourLife";
import styled from "styled-components";

const ClientReview = () => {
  return (
    <ClientReviewContainer className="py-5">
      <Container>
        <div className="d-flex text-center justify-content-center">
          <TextContent>
            <h4>
              We serve our client with our <br />
              best capability
            </h4>
          </TextContent>
        </div>
        <SliderContent className="d-flex flex-column justify-content-center align-items-center text-center">
          <p className="mt-4 mt-md-5 mb-2 mb-md-3">
            <i className="fas fa-quote-left fa-xs"></i> Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Magnam eligendi necessitatibus est
            voluptates minus pariatur dolorem illo reiciendis aliquid corporis
            sunt, voluptate dicta rem dolorum totam labore ipsum nihil qui modi
            dolore! Accusamus veritatis pariatur debitis mollitia suscipit,
            architecto culpa quae officia laudantium at quasi quisquam neque
            optio nostrum ratione rerum dolores? Dolore necessitatibus,
            laudantium hic id esse excepturi expedita.
            <i className="fas fa-quote-right fa-xs"></i>
          </p>
          <div className="mt-4">
            <img
              src={"/assets/images/landing-mockup/customer-face.png"}
              alt=""
            />
            <h6 className="mb-0 mt-3">Andrew Russel</h6>
            <span>Managing Director, Blueberry</span>
          </div>
        </SliderContent>
        <div className="d-flex mt-5 justify-content-center align-items-center">
          <button>
            <i className="fal fa-long-arrow-left"></i>
          </button>
          <button className="ml-5">
            <i className="fal fa-long-arrow-right"></i>
          </button>
        </div>
      </Container>
    </ClientReviewContainer>
  );
};

export default ClientReview;

const ClientReviewContainer = styled.div`
  background: #fff1f7d8;
  .fa-long-arrow-left {
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    transform: translate(0px, -1px);
  }
  .fa-long-arrow-right {
    transform: scale(2.5);
    color: #ff4094;
  }
  button {
    border: none;
    background: none;
  }
`;

const SliderContent = styled.div`
  p {
    width: 80%;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
  }
  img {
    width: 65px;
  }
  h6 {
    
  }
  .fa-quote-left,
  .fa-quote-right {
    transform: translate(0px, -5px);
  }
  @media (max-width: 767px) {
    p {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};
    }
  }
`;

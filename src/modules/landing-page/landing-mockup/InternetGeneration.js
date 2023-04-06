import React from "react";
import { IconBg } from "./LandingMockup";
import { TextContent } from "./InsureYourLife";
import styled from "styled-components";
import { Container } from "./LandingMockup";

const allData = [
  {
    icon: (
      <span role="img" aria-label="Computer">
        🖥
      </span>
    ),
    title: "Better technology better value",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, voluptate!",
  },
  {
    icon: (
      <span role="img" aria-label="Notification">
        📣
      </span>
    ),
    title: "Get notified all of updates",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, voluptate!",
  },
  {
    icon: (
      <span role="img" aria-label="Smile-Dollar">
        🤑
      </span>
    ),
    title: "Don't just get insured, create wealth",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, voluptate!",
  },
  {
    icon: (
      <span role="img" aria-label="Watch">
        🕐
      </span>
    ),
    title: "You are covered instantly",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, voluptate!",
  },
  {
    icon: (
      <span role="img" aria-label="Money-bag">
        💰
      </span>
    ),
    title: "Skip all the premiums",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, voluptate!",
  },
  {
    icon: (
      <span role="img" aria-label="World">
        🌍
      </span>
    ),
    title: "Do everything Online",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, voluptate!",
  },
];

const InternetGeneration = () => {
  return (
    <InternetGenerationContainer className="py-5">
      <Container>
        <div className="d-flex text-center justify-content-center">
          <TextContent width={"60%"}>
            <h4>
              Build From Ground Up for <br />
              the internet generation.
            </h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
              magnam minus esse voluptas assumenda perspiciatis repellendus modi
              iure, adipisci in.
            </p>
          </TextContent>
        </div>
        <div className="row mt-4 mx-0">
          {allData.map((data, i) => (
            <div key={`data-id${i}`} className="col-md-4 col-6 p-md-4 p-3">
              <ColumnContent className="d-flex flex-column">
                <IconBg
                  width={"70px"}
                  height={"70px"}
                  fontSize={"2.3rem"}
                  bgColor={"#e4f7ff"}
                >
                  {data.icon}
                </IconBg>
                <h5 className="mt-3">{data.title}</h5>
                <p>{data.desc}</p>
              </ColumnContent>
            </div>
          ))}
        </div>
      </Container>
    </InternetGenerationContainer>
  );
};

export default InternetGeneration;

const InternetGenerationContainer = styled.div`
  background: #f2f2ff69;
`;

const ColumnContent = styled.div`
  h5 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    
  }
  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
  }
  @media (max-width: 767px){
    h5{
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    }
    p{
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.8rem + ${fontSize - 92}%)` : '0.8rem'};
    }
  }
`;

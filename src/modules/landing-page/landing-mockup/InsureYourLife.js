import React from "react";
import styled from "styled-components";

const InsureYourLife = () => {
  return (
    <ImageWithContent
      className="align-items-center pb-5 pb-md-0"
      height={"90vh"}
      reverse={true}
    >
      <TextContent width={"40%"} color={"#37474f"}>
        <h4>
          We are here committed to <br />
          Insure your life, and Seclife will invest in you.
        </h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
          eveniet inventore asperiores fuga, nostrum debitis a autem
          reprehenderit. Dicta, soluta.
        </p>
        <button className="text-light px-4 mt-0 mt-md-4 py-3">
          <div className="d-flex align-items-center">
            <p className="m-0">Learn More</p>
          </div>
        </button>
      </TextContent>
      <ImageContent className="mb-5 mb-md-0" width={"60%"}>
        <img src={"/assets/images/landing-mockup/family-pic2.png"} alt="" />
        <div className="content">
          <div className="d-flex px-3 h-100 align-items-center">
            <div className="d-flex align-items-center w-100 justify-content-between">
              <div className="d-flex flex-column">
                <h1 className="m-0">90k+</h1>
                <p className="m-0">People Trust Us</p>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex">
                  {Array.from(Array(5).keys()).map((data) => (
                    <i
                      key={data}
                      style={{ color: "#fdc221" }}
                      className="fas fa-star fa-2x"
                    ></i>
                  ))}
                </div>
                <div className="custom-line1"></div>
                <div className="custom-line2"></div>
              </div>
            </div>
          </div>
        </div>
      </ImageContent>
    </ImageWithContent>
  );
};

export default InsureYourLife;

export const ImageWithContent = styled.div`
  display: flex;
  flex-direction: ${({ reverse }) => reverse && "row-reverse"};
  justify-content: space-between;
  height: ${({ height }) => height && height};
  @media (max-width: 767px) {
    flex-direction: ${({ reverse }) => reverse && "column-reverse"};
    justify-content: start;
    height: fit-content;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    height: 45vh;
  }
`;

export const TextContent = styled.div`
  width: ${({ width }) => width && width};
  display: flex;
  flex-direction: column;
  column-gap: 0.8rem;

  h1 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(60px + ${fontSize - 92}%)` : '60px'};
    margin: 1.5rem 0;
    
  }

  h4 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.5rem + ${fontSize - 92}%)` : '2.5rem'};
    
  }

  h5 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    
  }

  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
  }

  button {
    width: fit-content;
    border: none;
    background: ${({ color }) => (color ? color : "#ff4094")};
    
    border-radius: 9999px;

    .far {
      border: 1px solid white;
      padding: 0px 5px;
      border-radius: 10px;
      background: #ef6ea7;
    }
  }
  .fa-long-arrow-right {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
  }
  @media (max-width: 767px) {
    width: 100%;
    h1 {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
      margin: 8px 0px;
    }
    p {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.8rem + ${fontSize - 92}%)` : '0.8rem'};
      
    }
    .fa-long-arrow-right {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    }
    h4 {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    }
    h3,
    h5 {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    h4 {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.9rem + ${fontSize - 92}%)` : '1.9rem'};
    }
  }
`;

export const ImageContent = styled.div`
  width: ${({ width }) => width && width};
  position: relative;
  img {
    width: 100%;
  }
  .content {
    position: absolute;
    width: 290px;
    height: 110px;
    background-color: #ff4094;
    right: 80px;
    bottom: -10px;
    border-radius: 15px;
    color: #fff;
    h1 {
      
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(3rem + ${fontSize - 92}%)` : '3rem'};
    }
    p {
      
    }
    .custom-line1 {
      width: 85%;
      height: 10px;
      background: #f3efefc9;
      margin-top: 8px;
      margin-left: 4px;
    }
    .custom-line2 {
      width: 40%;
      height: 10px;
      background: #f3efefc9;
      margin-top: 8px;
      margin-left: 4px;
    }
  }
  @media (max-width: 767px) {
    width: 100%;
    .content {
      width: 210px;
      height: 80px;
      right: 68px;
      bottom: -25px;
      h1 {
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
      }
      .fa-star {
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
      }
    }
  }
`;

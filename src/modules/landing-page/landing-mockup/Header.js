import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Container } from "./LandingMockup";

const Header = () => {
  const [input, setInput] = useState("");
  const [barOpened, setBarOpened] = useState(false);
  const formRef = useRef();
  const inputFocus = useRef();

  const onFormSubmit = (e) => {
    // When form submited, clear input, close the searchbar and do something with input
    e.preventDefault();
    setInput("");
    setBarOpened(false);
    // After form submit, do what you want with the input value
  };

  return (
    <>
      <TopHeader className="mb-3 mb-md-5">
        <Container>
          <Navbar>
            <Logo>
              <i
                className="fas fa-heart-circle fa-2x"
                style={{ color: "#FF4094" }}
              ></i>
              <span>SecLife</span>
            </Logo>
            <Form
              barOpened={barOpened}
              onClick={() => {
                // When form clicked, set state of baropened to true and focus the input
                setBarOpened(true);
                inputFocus.current.focus();
              }}
              // on focus open search bar
              onFocus={() => {
                setBarOpened(true);
                inputFocus.current.focus();
              }}
              // on blur close search bar
              onBlur={() => {
                setBarOpened(false);
              }}
              // On submit, call the onFormSubmit function
              onSubmit={onFormSubmit}
              ref={formRef}
            >
              <Button type="submit" barOpened={barOpened}>
                <i className="fas fa-search"></i>
              </Button>
              <Input
                onChange={(e) => setInput(e.target.value)}
                ref={inputFocus}
                value={input}
                barOpened={barOpened}
                placeholder="Search..."
              />
            </Form>
          </Navbar>
          <ImageWithContent className="mt-3">
            <TextContent>
              <h1>
                Life Insurance That <br /> Creates Wealth
              </h1>
              <p>
                Only Seclife Inc gives you an investment with your life <br />{" "}
                insurance policy at no extra cost. 😍
              </p>
              <button className="text-light px-4 mt-0 mt-md-4 py-md-3 py-2">
                <div className="d-flex align-items-center">
                  <p className="m-0">Get Started</p>
                  <span className="ml-3">
                    <i className="far fa-long-arrow-right "></i>
                  </span>
                </div>
              </button>
            </TextContent>
            <ImageContent>
              <img
                src={"/assets/images/landing-mockup/family-pic.png"}
                alt=""
              />
            </ImageContent>
          </ImageWithContent>
        </Container>
      </TopHeader>
    </>
  );
};

export default Header;

const ImageWithContent = styled.div`
  display: flex;
  flex-direction: ${({ reverse }) => reverse && "row-reverse"};
  justify-content: space-between;
  height: ${({ height }) => height && height};
`;

const TextContent = styled.div`
  width: ${({ width }) => width && width};
  display: flex;
  flex-direction: column;
  column-gap: 0.8rem;

  h1 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(60px + ${fontSize - 92}%)` : '60px'};
    margin: 1.5rem 0;
    
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
    width: 80%;
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
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    h1 {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.5rem + ${fontSize - 92}%)` : '2.5rem'};
    }
  }
`;

const ImageContent = styled.div`
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
    width: 70%;
  }
`;

const TopHeader = styled.div`
  padding: 50px 0px;
  height: 100vh;
  width: 100%;
  background-image: url("/assets/images/landing-mockup/landing-mockup-bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  @media (max-width: 767px) {
    padding: 20px 0px;
    height: auto;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    height: 50vh;
  }
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 767px) {
    margin-bottom: 2rem;
  }
`;
const Logo = styled.div`
  display: flex;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
  align-items: center;
  gap: 10px;
`;
const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #37474f;
  /* Change width of the form depending if the bar is opened or not */
  width: ${(props) => (props.barOpened ? "20rem" : "10rem")};
  /* If bar opened, normal cursor on the whole form. If closed, show pointer on the whole form so user knows he can click to open it */
  cursor: ${(props) => (props.barOpened ? "auto" : "pointer")};
  padding: 2rem;
  height: 2rem;
  border-radius: 10rem;
  transition: width 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
  @media (max-width: 767px) {
    padding: 1.4rem;
    width: ${(props) => (props.barOpened ? "14rem" : "10rem")};
  }
`;

const Input = styled.input`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  line-height: 1;
  background-color: transparent;
  width: 100%;
  margin-left: ${(props) => (props.barOpened ? "1rem" : "10px")};
  border: none;
  color: white;
  transition: margin 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  &:focus,
  &:active {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const Button = styled.button`
  line-height: 1;
  cursor: ${(props) => (props.barOpened ? "pointer" : "none")};
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
`;

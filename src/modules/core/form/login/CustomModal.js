import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";

export const Popup = ({ show, onClose, height, width, position }) => {
  function googleTranslateElementInit() {
    new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element_login');
  };
  const { globalTheme } = useSelector(state => state.theme)

  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, [])


  return (

    <PopupC visible={show}>
      <Content style={{ height: height, width: width }} position={position} maxwidth={width}>
        <CloseButton
          onClick={() => {
            onClose(false);
          }}
        >
          &times;
        </CloseButton>
        <Content1 className='text-center'>
          <div className="contact__imgbox">
            <ContactImg
              src="/assets/images/Google_Translate_logo.png"
              alt="Lakshmi"
              style={{ border: "solid 1px #d2d3d4", borderRadius: "50%" }}
            ></ContactImg>
          </div>
          <ContactText>
            <p style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px' }}>
              Would you like to change the default language
            </p>
          </ContactText>
          <div id="google_translate_element_login"></div>

        </Content1>

      </Content>
    </PopupC>

  );
};


const moveDown = keyframes`
from{
    top:0;
    opacity:0;
}
to {
    top:${props => props.position === "top" ? "20%" : "35%"};
    opacity:1;
}
`;

const ContactImg = styled.img`
  float: left;
  margin-right: 10px;
  height: 70px;
`;

const ContactText = styled.div`
  padding: 1rem;
  
  font-family: basier_squareregular;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
  margin-bottom: 20px;
  color: #111;
`;

const Content1 = styled.div`
  height: 90%;
  padding: 60px 80px;
`;

const PopupC = styled.div`
  min-height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  background-color: rgba(1, 1, 1, 0.6);
  z-index: 9999;
  opacity: ${(props) => (props.visible === true ? "1" : "0")};
  visibility: ${(props) => (props.visible === true ? "visible" : "hidden")};
  transition: all 0.3s; 
`;

const Content = styled.div`
  position: absolute;
  animation: ${moveDown} 0.5s;
  top:${props => props.position === "top" ? "12rem" : "35%"};
  left: 50%;
  transform: translate(-50%, -40%);
  background-color: #fff;
  transition: all 0.5s;
  border-radius:4px;
  @media (max-width:${props => props.maxwidth}){
    width:96% !important;
    height:auto !important;
  }
`;

const CloseButton = styled.a`
  float: right;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(32px + ${fontSize - 92}%)` : '32px'};
  margin-right: 10px;
  cursor: pointer;
  &:link,
  &:visited {
    text-decoration: none;
    color: #666;
  }
`;

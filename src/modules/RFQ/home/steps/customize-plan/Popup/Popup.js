import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from 'prop-types';
import { useOutsideClick } from './UseOutsideClick'

const Popup = ({ show, onClose, content, height, width, position, children }) => {

  const dropDownRef = useRef(null);
  useOutsideClick(dropDownRef, () => onClose(false));

  return (
    show && (
      <PopupC visible={show}>
        <Content ref={dropDownRef} height={height} width={width} position={position} maxwidth={width}>
          <CloseButton
            onClick={() => {
              onClose(false);
            }}>
            &times;
          </CloseButton>
          {content ? content : children}
        </Content>
      </PopupC>
    )
  );
};

// PropTypes
Popup.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  content: PropTypes.element,
  height: PropTypes.string,
  width: PropTypes.string,
  position: PropTypes.string
}

// DefaultTypes
Popup.defaultProps = {
  show: false,
  onClose: () => { },
  content: null,
  height: '200px',
  width: '640px',
  position: 'middle'
}


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

const PopupC = styled.div`
  min-height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  background-color: rgba(1, 1, 1, 0.6);
  z-index: 9999;
  opacity: ${({ visible }) => (visible === true ? "1" : "0")};
  visibility: ${({ visible }) => (visible === true ? "visible" : "hidden")};
  transition: all 0.3s;
`;

const Content = styled.div`
  position: absolute;
  animation: ${moveDown} 0.5s;
  top:${({ position }) => position === "top" ? "20%" : "35%"};
  height:${({ height }) => height};
  width:${({ width }) => width};
  left: 50%;
  transform: translate(-50%, -40%);
  background-color: #fff;
  transition: all 0.5s;
  border-radius:4px;
  @media (max-width:${({ maxwidth }) => maxwidth}){
    width:96% !important;
    height:auto !important;
  }
`;

const CloseButton = styled.a`
  float: right;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(26px + ${fontSize - 92}%)` : '26px'};
  margin-right: 10px;
  cursor: pointer;
  font-family: 'sans-serif';
  color: #363636;
  text-decoration: none;
  &:link,
  &:visited,
  &:hover {
    text-decoration: none;
    color: #363636;
  }
`;

export default Popup;

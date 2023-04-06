import styled from 'styled-components';

import { InputGroup } from 'react-bootstrap'

export const Container = styled.div`
  letter-spacing: 1px;
  padding: 20px 0 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: top right;
  background-size: 1060px;
  background-image: url(/assets/images/landing-page/bg-2.png);
`;

export const FormContainer = styled.div`
  margin:0px 45px;
  width: ${({ width }) => width || '100%'};
  @media (max-width: 991px) {
    width: ${({ width }) => width === '1007.990px' ? '750px' : width || '690px'};
    margin: 0 15px 50px;
  }
  @media (max-width: 767px) {
    width: 100%;
    margin: 0 15px 50px;
  }
  @media (max-width: 450px) {
    margin: 0 15px 50px;
  }
`;

export const Wrapper = styled.div`

`

export const Input = styled(InputGroup)`
  height: 50px;
  .input-group-text{
    background-color: #ffffff;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
    
    color: #1d1d1d;
    border-radius: 10px 0 0 10px;
  }
  #inlineFormInputGroup{
    height: 50px;
    border-radius: 0 10px 10px 0;
    text-align: start;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
  padding-left: 26px;
  }
`

export const OptionInput = styled.label`
  width: ${({ width }) => width || 'max-content'};
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  
  margin-top: ${({ single, small }) => !single ? small ? '8' : '8' : '0'}px;
  margin-bottom: ${({ single, small }) => !single ? small ? '4' : '2' : '-60'}px;
  margin-left: 30px;
  position: relative;
  cursor: ${({ notAllowed }) => notAllowed ? 'not-allowed' : 'pointer'};
  user-select: none;
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : 'rgb(131, 109, 109)'} !important;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  input {
    position: absolute;
    opacity: 0;
    cursor: ${({ notAllowed }) => notAllowed ? 'not-allowed' : 'pointer'};
    height: 0;
    width: 0;
  }
  span{
    position: relative;
    left: -25px;
    top: ${({ small }) => small ? '-2' : '-3'}px;
    height: ${({ small }) => small ? '20' : '25'}px;
    width: ${({ small }) => small ? '20' : '25'}px;
    min-width: ${({ small }) => small ? '20' : '25'}px;
    background-color: #fff;
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: 0px 2px 6px 0px #0b0b0b40;
    border: 1px solid #1bf29e;
  }
  span:after {
    content: "";
    position: relative;
    display: none;
    }
  &:hover input ~ span{
    background-color: #1bf29e3b;
    transition: all 0.2s;
  }
  input:checked ~ span {
    background-color: #1bf29e !important;
  }
  input:checked ~ span:after {
    display: block;
  }
  span:after {
    left: ${({ small }) => small ? '4.8' : '4'}px;
    top: ${({ small }) => small ? '2.5' : '2'}px;
    width: 5px;
    height: 10px;
    transition: all 1s;
    border: solid rgb(255, 255, 255);
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    zoom: ${({ small }) => small ? '1.3' : '1.7'};
    }
  p{
    font-size: ${({ theme, small }) => theme.fontSize ? `calc(${small ? '1rem' : '1.1rem'} + ${theme.fontSize - 92}%)` : (small ? '1rem' : '1.1rem')};
    padding-left: 0;
    margin-bottom: 0;
    /* white-space: nowrap; */
    color: #114a7d;
    max-width: ${({ small }) => small ? '258' : '280'}px;
    white-space: break-spaces;
  }
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
    margin-left: 0.4rem;
  }
  .tooltip.show {
    opacity: 1;
  }
  .tooltip {
    padding: 6px;
    max-width: 280px;
    border-radius: 0;

  }
  .tooltip-inner {
    max-width: 100%;
    width: 100%;
    padding: 10px 18px;
    border-radius: 0;
    color: #d2d3d4;
    line-height: 18px;
    background-color: #1c1c1c;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    text-align: start;
  }
`

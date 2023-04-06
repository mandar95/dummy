import React from "react";
import styled from "styled-components";

export const TemplateCard = ({ children, className = '', style = {}, variant = '#fce4ff', border, label }) => {
  return (
    <CardRow border={border} variant={variant} style={style} className={className} >
      {!!label && <Label>{label}</Label>}
      <Container>
        {children}
      </Container>
    </CardRow >
  )
}

export const Tags = styled.span`
word-break: break-word;
border: 1px dashed #2400ff;
border-radius: 5px;
background-color: #fff6b5;
color: #3b00a5;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};

padding: 2px 9px;
margin: 3px 3px;
cursor: pointer;
@media (max-width: 374px) {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
}
`

export const InputBox = styled.div`
  background-color: ${({ drag }) => (drag ? "#ffeff7" : '#fff')};
  border: 1px dashed rgb(36, 0, 255);
  border-radius: 10px;
  width: 100%;
  margin: 0 0 15px;
  padding: 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  span{
    word-break: break-word;
    padding: 0 5px 0 0;
  }
  :focus-visible {
  outline: none;
  background-color: #ffeff7;
  }

  @media (max-width: 560px) {
    display: contents
}

`

export const Input = styled.input`
border: 1px dashed #2400ff;
border-bottom: 5px solid #6834c6;
border-radius: 10px;
/* background-color: ${({ drag }) => (drag ? "#ffd3d3" : '#fff')}; */
color: #6834c6;
min-height: ${({ minheight }) => (minheight || 'auto')};
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${(fontSize || '1rem')} + ${theme.fontSize - 92}%)` : (fontSize || '1rem')};
font-weight: ${({ fontWeight }) => (fontWeight || '600')};
padding: 7px 10px;
width: 100%;
margin: 10px 0px;
overflow: hidden;
&::placeholder {
  color: #b992ff;
  font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${(fontSize || '1rem')} + ${theme.fontSize - 92}%)` : (fontSize || '1rem')};
  padding: 0 0 10px;
}

&:focus{
  outline: none;
  border: 1px dashed #2400ff;
border-bottom: 5px solid #6834c6;
}
`

export const SwitchInput = styled.input`
position: absolute;
opacity: 0;
height: 0px;
& + div {
  vertical-align: middle;
  width: 40px;
  height: 20px;
  border-radius: 999px;
  background-color: ${({ dark }) => dark ? '#cbcbcb' : '#ec3b3b'};
  -webkit-transition-duration: .4s;
  transition-duration: .4s;
  -webkit-transition-property: background-color, box-shadow;
  transition-property: background-color, box-shadow;
  cursor: pointer;
  width: 45px;
  height: 25px;
}
& + div span {
  position: absolute;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.6rem + ${fontSize - 92}%)` : '1.6rem'};
  color: white;
  margin-top: 12px;
}
& + div span:nth-child(1) {
  margin-left: 15px;
}
& + div span:nth-child(2) {
  margin-left: 45px;
}
&:checked + div {
  width: 45px;
  background-position: 0 0;
  background-color: #ec3b3b;
  background-color: ${({ dark }) => dark ? '#000000' : '#1ad2a4'};
}
& + div > div {
  float: left;
  width: 23px;
  height: 23px;
  border-radius: inherit;
  background: #ffffff;
  -webkit-transition-timing-function: cubic-bezier(1, 0, 0, 1);
  transition-timing-function: cubic-bezier(1, 0, 0, 1);
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition-property: transform, background-color;
  transition-property: transform, background-color;
  pointer-events: none;
  margin-top: 1px;
  margin-left: 1px;
}

&:checked + div > div {
  -webkit-transform: translate3d(20px, 0, 0);
  transform: translate3d(20px, 0, 0);
  background-color: #ffffff;
}

&:checked + div > div {
  -webkit-transform: translate3d(20px, 0, 0);
  transform: translate3d(20px, 0, 0);
}
`

export const CustomControl = styled.div`
  position: relative;
  display: block;
  min-height: 54px;
  padding:  0px 1.5rem;
`
export const SwitchContainer = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
`

const CardComponent = styled.div`  
  border: ${({ border = '' }) => (border)};
  border-radius: 10px;
  margin: 20px 0 40px;
  background-color: ${({ variant }) => (variant)};
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
`;

const CardBody = styled(CardComponent)`
  padding: 0.5rem;
`;

const CardRow = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

const Label = styled.span`
margin: -28px 0 0 -9px;
border: 1px double #2400ff;
border-radius: 30px;
background-color: #d2ff12;
color: #3b00a5;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};

padding: 10px 20px;`


const Container = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: auto;
`;

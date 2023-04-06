import styled from 'styled-components';


export const InputBorder = styled.div`
box-sizing: border-box;
  background-color: tranparent;
  border-radius: 5px;
  max-height: 54px;
  margin-bottom: 30px;
  position: relative;  
  // min-width: 210px;
  max-height: 53px;
  margin: 1rem 0px;
  border: 1px solid #cae9ff;
  &:active {
  border: 1px solid #9fc6e2;
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

export const SwitchInput = styled.input`
position: absolute;
opacity: 0;
height: 0px;
& + div {
  vertical-align: middle;
  width: 40px;
  height: 20px;
  border-radius: 999px;
  background-color: ${({dark})=> dark? '#cbcbcb':'#ec3b3b'};
  -webkit-transition-duration: .4s;
  transition-duration: .4s;
  -webkit-transition-property: background-color, box-shadow;
  transition-property: background-color, box-shadow;
  cursor: pointer;
  width: 57px;
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
  margin-left: 57px;
}
&:checked + div {
  width: 57px;
  background-position: 0 0;
  background-color: #ec3b3b;
  background-color: ${({dark})=> dark? '#000000':'#1ad2a4'};
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
  -webkit-transform: translate3d(32px, 0, 0);
  transform: translate3d(32px, 0, 0);
}
`

export const FormLabel = styled.label`
  position: absolute;
  transition: 0.25s ease;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'} !important;
  text-align: center; 
  
  width: 100%;
  
  display: inline-block;
  top: -12px;
  color: #000;
  left: -0px;
`

export const SpanLabel = styled.span`
background: ${({ theme }) => theme.dark ? '#2a2a2a' : '#fff'};
  padding: 2px 1px;
  
  letter-spacing: 1px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'};
  left: 5px;
`
export const CustomLabel = styled.label`
  position: relative;
  cursor: pointer;
  margin-top: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : 'rgb(131, 109, 109)'} !important;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  &:hover input ~ span{
    background-color: rgb(204, 198, 198);
    transition: all 0.2s;
  }
  input:checked ~ span {
    background-color: rgb(243, 73, 206)!important;
  }
  input:checked ~ span:after {
    display: block;
  }
  span{
    position: absolute;
    left: 0;
    top: -4px;
    height: 23px;
    width: 23px;
    background-color: rgb(228, 228, 228);
    border-radius: 50%;
    box-sizing: border-box;
  }
  span:after {
    content: "";
    position: absolute;
    display: none;
    }
  span:after {
    left: 8px;
    top: 4px;
    width: 5px;
    height: 10px;
    transition: all 1s;
    border: solid rgb(255, 255, 255);
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  p{
    
    padding-left: 27px;
  }
`
export const Img = styled.img`
  height: 8px;
`

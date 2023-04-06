import styled from 'styled-components';

export const CustomControl = styled.label`
  
  color: #000 !important;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  
  /* in test */
  margin-top: 12px;
  text-align: center;
  /* border: 2px solid red; */
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : 'rgb(131, 109, 109)'} !important;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  width: max-content;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
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
    top: -2px;
    position: absolute;
  }
`

import styled from "styled-components";

export const SelectInput = styled.select`
	${({ theme }) =>
    theme.dark
      ? `
option {
  background-color: #383838;  
}`
      : ""}

  min-height: 70px;
  width: 100%;
  transition: all 0.15s linear;
  min-width: 180px;
  border-radius: 15px;
  color: #000000;
  padding: 25px 15px 0 22px;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  border: ${({ error }) => (error ? '2px solid red' : 'none')};
  box-shadow: 1px 5px 14px 0px rgb(0 0 0 / 10%);
  text-align: left;
	cursor: pointer;
  &:focus {
    outline: none;
    border: 2px solid ${({ error }) => (error ? 'red' : '#1bf29e')};
    min-height: 70px;
    padding: 25px 15px 0 19px;
  }
  &:not(:placeholder-shown) {
    min-height: ${({ minHeight }) => minHeight || '70px'};
  } 
  @media (max-width: 767px) {
    min-width: 353px;
    max-width: inherit;
  }
  @media (max-width: 450px) {
    min-width: 195px;
    max-width: inherit;
  }
	
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	outline: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background: #ffffff url("data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==") no-repeat right 23px bottom;
	background-position-y: ${({ minHeight }) => minHeight ? `calc(${minHeight} - 28px)` : '44px'};
  ${({ disabled }) => disabled ? 'background-image: none;' : ''}
`;
export const Label = styled.label`
  position: absolute;
  color: #000000;
  transition: all 0.3s;
  cursor: pointer;
  top: 9px;
  left: 35px;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  width:79%;

  & > span {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  }
`;

export const LoaderDiv = styled.div`
    min-height: 110px;
    cursor: text;
    width: 100%;
    -webkit-transition: all 0.15s linear;
    transition: all 0.15s linear;
    min-width: 180px;
    border-radius: 15px;
    color: #000000;
    padding: 25px 15px 0 22px;
    
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
    border: none;
    background: #ffffff;
    box-shadow: 1px 5px 14px 0px rgb(0 0 0 / 10%);
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-around;


    & > div > div {
      width: 14px;
      height: 14px;
      background-color: #464646;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }
    & > div .bounce1 {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }
    & > div .bounce2 {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }
    @-webkit-keyframes sk-bouncedelay {
      0%,
      80%,
      100% {
        -webkit-transform: scale(0);
      }
      40% {
        -webkit-transform: scale(1);
      }
    }
    @keyframes sk-bouncedelay {
      0%,
      80%,
      100% {
        -webkit-transform: scale(0);
        transform: scale(0);
      }
      40% {
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }

`

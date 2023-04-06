import styled from "styled-components";

export const FormGroupSelect = styled.div`
margin-bottom: 30px;
position: relative;  
min-width: 210px;
max-height: 54px!important;
width:${({ width }) => width ? `${width}!important` : 'unset'};
margin:${({ margin }) => margin ? `${margin}!important` : '1rem 0px'};
`

export const SelectInput = styled.select`
${({ theme }) => theme.dark ? `
option {
  background-color: #383838;  
}`: ''}

background-color: rgb(255, 255, 255);
box-sizing: border-box;
max-height: 54px!important;
min-height:${({ minHeight }) => minHeight ? `${minHeight}!important` : '52px'};
width: 100%;

color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#000000'};
cursor: pointer;
border: 1px solid #cae9ff;
display: inline-block;
border-radius: 5px;
transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'} !important;
outline: none;
-moz-appearance: none;
-webkit-appearance: none;
appearance: none;
background: transparent url('data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==') no-repeat right 10px center;
border: 1px solid #cae9ff;
padding: 16px!important;
// min-height: 52px;
&:focus{
  border-color: #80bdff!important;
}
&:focus{
  box-shadow: none!important;
  border: 1px solid #7cbae7;
}
&&.error {
		border: 1px solid red;
	}
&:not([size]):not([multiple]) {
  text-align-last: center;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
}
`
export const SelectLabel = styled.label`
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

export const SelectSpan = styled.span`
background: ${({ theme }) => theme.dark ? '#2a2a2a' : '#fff'};
padding: 2px 4px;

letter-spacing: 1px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'};
left: 5px;
margin-bottom: 6px;
`
export const Img = styled.img`
height: 8px;
`

export const CardComponent = styled.div`
  border: ${({ border, theme }) => border ? '3px solid ' + theme.PrimaryColors?.color4 : 'none'};
  border-radius: 0 35px 0 35px;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#fff'};
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
  margin: 30px;
  @media (max-width: 767px) {
    margin: 15px;
  }
  min-height: 150px;
  p{
    padding: 15px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
    margin-bottom: -3px;
  }
  cursor: pointer;
`;

export const Flex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 15px;
`
export const Color = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  width: 100%;
`

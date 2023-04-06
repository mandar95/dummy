import styled from 'styled-components';
import TextArea from "react-textarea-autosize";

export const Header = styled.div`
border: 1px dashed #2400ff;
border-radius: 10px;
background-color: ${({ drag }) => (drag ? "#b992ff" : '#fff')};
color: #b992ff;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};

padding: 50px 27px;
width: 100%;
margin: 10px 0px;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
min-height: ${({ height }) => (height || 'inherit')};
`

export const Input = styled(TextArea)`
border: 1px dashed #2400ff;
border-bottom: 8px solid #6834c6;
border-radius: 10px;
background-color: ${({ drag }) => (drag ? "#ffd3d3" : '#fff')};
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
}
`

export const InputBox = styled.div`
border: 1px dashed #2400ff;
border-radius: 10px;
background-color: #fff;
color: #6834c6;

padding: 7px 10px;
width: 100%;
margin: 10px 0px;
`

export const Text = styled.div`
border-radius: 10px;
background-color: #fff;
color: #6834c6;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};

padding: 7px 10px;
width: 100%;
margin: 10px 0px;
::placeholder {
  color: #6834c6;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
  
}
`

export const Tags = styled.span`
border: 1px dashed #2400ff;
border-radius: 30px;
background-color: #fff6b5;
color: #3b00a5;
white-space: break-spaces
font-size: ${({ theme: { fontSize } }) => fontSize ? `1rem + ${fontSize - 92}%)` : '1rem'};

padding: 2px 9px;
margin: 3px 3px;
cursor: pointer;`

export const Div = styled.div`
width: 100%;
& .form-group-input{
  display:flex;
  justify-content: center;
}
`

export const PreviewImg = styled.img`
  width: -moz-available;
  width: -webkit-fill-available;
  background-position: center;
  background-size: cover;
  width: 100%;
`;

export const BorderDiv = styled.div`
border: 1px dashed #2400ff;
border-bottom: 8px solid #6834c6;
border-radius: 10px;
padding: 10px;
margin: 10px 0;`



export const Header2 = styled.div`
background-color: ${({ drag, bgColor }) => (drag ? "#b992ff" : bgColor)};
color: #b992ff;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};


border: 1px solid white;
margin: 1px;
border-radius: 1px;

width: 100%;

display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
min-height: ${({ height }) => (height || 'inherit')};
`

export const Input2 = styled(TextArea)`
// border: 1px dashed #2400ff;
// border-bottom: 8px solid #6834c6;
// border-radius: 10px;
background-color: ${({ drag }) => (drag ? "#ffd3d3" : '#fff')};
color: #6834c6;
min-height: ${({ minheight }) => (minheight || 'auto')};
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${(fontSize || '1rem')} + ${theme.fontSize - 92}%)` : (fontSize || '1rem')};
font-weight: ${({ fontWeight }) => (fontWeight || '600')};
padding: 7px 10px;
width: 100%;
margin: 5px 0px;
overflow: hidden;
&::placeholder {
  color: #b992ff;
  font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${(fontSize || '1rem')} + ${theme.fontSize - 92}%)` : (fontSize || '1rem')};
  padding: 0 0 10px;
}
&:not(:focus){
  border:none;
  text-align: center;
}

&:focus{
  outline: none;
  background-color: #fff !important;
}
`

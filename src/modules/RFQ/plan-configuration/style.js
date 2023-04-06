import styled from 'styled-components'
import TextArea from "react-textarea-autosize";

export const Wrapper = styled.div`
`;

export const Vline = styled.div`
border-left: 8px solid ${({ active }) => !active ? '#ffde31' : "#1bf29e"};
height: 35px;
position: absolute;
top: 15px;
border-top-left-radius: 10px;
border-top-right-radius: 13px 15px;
border-bottom-left-radius: 10px;
border-bottom-right-radius: 13px 15px;`


export const CardWrap = styled.div`
padding: 20px 20px 0;
min-height: 100%;

.header{
  display: flex;
  justify-content: space-between;
  h2{
    
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
  }
  .icon{
    margin-top: 0.5rem;
    i{
      cursor: pointer;
      background: #F0F4F7;
      padding: 10px;
      border-radius: 50%;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
      margin: auto 0.3rem;
    }
  }
}
.icon_view{
    margin-top: 0.5rem;
    i{
      cursor: pointer;
      background: #F0F4F7;
      padding: 10px;
      border-radius: 50%;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
      margin: auto 0.3rem;
    }
  }
.table-responsive{
  margin: 0;
  .table {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
    th, td{
     border-top: 0;
      
      padding: 0.45rem 0.75rem;
    }
    th{
      color: #878787;
    }  
  }
}
.waiver{
  
  color: #878787;
  display: flex;
  justify-content: start;
  align-items: center;
  span{
    margin: 2rem 1rem;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
  }
  b{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
    color: #000000;
  }
}
.pre-post{
  
  color: #878787;
  margin: 2rem 1rem;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
  span{
    color: #000000;
  }
}

`

export const TabWrapper = styled.div`
  @media (max-width: 767px) {
    margin: 15px;
  }
  display: inline-flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 2.6em;
  height: 35px;
  max-width: ${({ width }) => (width || "120px")};
  box-shadow: 0 10px 15px 11px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

export const Tab = styled.div`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.77rem + ${fontSize - 92}%)` : '0.77rem'};
  
  letter-spacing: 1px;
  text-align: center;
  cursor: pointer;
  border-radius: 2.4em;
  padding: ${({ isActive }) => (isActive ? "0.9em 2em" : "0.9em 2em")};
  transition : all 0.5s;
  color: ${({ isActive, color, theme }) => (isActive ? "#ffffff" : color || theme.Tab?.color || "#6334E3")};
  background-color: ${({ isActive, color, theme }) => (isActive ? color || theme.Tab?.color || "#6334E3" : "")};
  ${({ isActive, color, theme }) =>
    !isActive
      ? `&:hover{
     background-color : ${color || theme.Tab?.color || '#6334E3'};
     color : #ffffff;
  }`
      : ""}
`;


export const Title = styled.div`
  margin-bottom: 3rem;
  h4 {
    color: ${({ theme }) => theme.dark ? '#ffffff' : '#000000'};
    text-align: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
    
    letter-spacing: 1px;
    z-index: 1;
    span {
      height: 15px;
      width: 15px;
      background-color: #f2c9fb;
      border-radius: 50%;
      display: inline-block;
      margin-bottom: 5px;
      margin-right: -9px;
      opacity: 0.7;
    }
  }
`;

export const SelectInput = styled.select`
flex-grow: 3;
	${({ theme }) =>
    theme.dark
      ? `
option {
  background-color: #383838;  
}`
      : ""}

  min-height: 70px;
  width: 70%;
  transition: all 0.15s linear;
  min-width: 180px;
  border-radius: 15px;
  color: #000000;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(22px + ${fontSize - 92}%)` : '22px'};
  border: ${({ error }) => (error ? '3px solid  #bf1650' : 'none')};
  text-align: left;
	cursor: pointer;
  &:focus {
    outline: none;
  }

  & option { 
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
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
	background-position-y: 33px;
`;

export const SelectWrap = styled.div`
border-radius: 15px;
border: 3px solid ${({ error }) => (error ? '#bf1650' : '#c4c4c4')};
padding: 0 0 0 1.1rem;
margin: 0 0 1.5rem;
display: flex;
flex-wrap: nowrap;
`
export const Button = styled.button`
border-radius: 10px;
border: 1px dashed #c4c4c4;
flex-grow: 7;
margin: 0.4rem;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};

background: #f3f8fbb5;
outline: none;
&:focus {
  background: #e3f1fab5;
  outline: none;
}

`
// FamilyDetail

export const SmallInput = styled.div`
.form-group{min-width: 150px}`

export const FormWrapper = styled.div``;

export const InputWrapper = styled.div`
padding-bottom: 10px;
.custom-control-label {
  &:before {
    border-radius: 100%;
    height: 20px;
    width: 20px;
    background-color: rgb(228,228,228);
  }
}
.custom-control-input:checked~.custom-control-label::before {
  border-color: #F349CE;
  background-color: #F349CE;
  height: 20px;
  width: 20px;
}
.custom-control-input:checked~.custom-control-label::after {
  height: 20px;
  width: 20px;
}
.custom-control-label {
  padding-left: 5px;
  padding-top: 2px;
  margin-top: 4px;
}
.heading {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
  letter-spacing: 0.3px;
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
  
}
`;

export const TextInput = styled(TextArea)`
overflow: hidden;
min-height: ${({minHeight}) => minHeight || '80px'};
width: 100%;
${({ error }) => error ? 'border: 1px solid red' : 'border: 1px solid #cae9ff'};
`

export const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
export const Content = styled.div`

padding: 20px;
background: #eaf7ffb5;
border-radius: 10px;
white-space: pre-line;
`;

export const BucketWrap = styled.div`
  display: block;
  /* margin: 0 auto; */
  /* max-width: 40rem; */
  padding: 1rem;

  ol.gradient-list > li::before, ol.gradient-list > li {
    box-shadow: 0.25rem 0.25rem 0.6rem rgba(0, 0, 0, 0.05), 0 0.5rem 1.125rem rgba(75, 0, 0, 0.05);
  }

  ol.gradient-list {
    counter-reset: gradient-counter;
    list-style: none;
    margin: 1.75rem 0;
    padding-left: 1rem;
  }

  ol.gradient-list > li {
    background-color: ${({ active }) => active ? '#f1f1f1' : '#ffffff'};
    border-radius: 0 0.5rem 0.5rem 0.5rem;
    counter-increment: gradient-counter;
    margin-top: 0;
    min-height: 2.5rem;
    padding: 0.3rem 0.5rem 0.3rem 2rem;
    position: relative;
  }

  ol.gradient-list > li::before, ol.gradient-list > li::after {
    background: linear-gradient(135deg, #83e4e2 0%, #a2ed56 100%);
    border-radius: 1rem 1rem 0 1rem;
    content: "";
    height: 2.5rem;
    left: -1rem;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 2.5rem;
  }

  ol.gradient-list > li::before {
    align-items: flex-end;
    content: counter(gradient-counter);
    color: #1d1f20;
    display: flex;
    font: 900 1.5em/1 "Montserrat";
    justify-content: flex-end;
    padding: 0.125em 0.25em;
    z-index: 1;
  }

  ol.gradient-list > li:nth-child(10n+1):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.2) 0%, rgba(253, 220, 50, 0.2) 100%);
  }
  ol.gradient-list > li:nth-child(10n+2):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.4) 0%, rgba(253, 220, 50, 0.4) 100%);
  }
  ol.gradient-list > li:nth-child(10n+3):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.6) 0%, rgba(253, 220, 50, 0.6) 100%);
  }
  ol.gradient-list > li:nth-child(10n+4):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.8) 0%, rgba(253, 220, 50, 0.8) 100%);
  }
  ol.gradient-list > li:nth-child(10n+5):before {
    background: linear-gradient(135deg, #a2ed56 0%, #fddc32 100%);
  }
  ol.gradient-list > li:nth-child(10n+6):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.8) 0%, rgba(253, 220, 50, 0.8) 100%);
  }
  ol.gradient-list > li:nth-child(10n+7):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.6) 0%, rgba(253, 220, 50, 0.6) 100%);
  }
  ol.gradient-list > li:nth-child(10n+8):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.4) 0%, rgba(253, 220, 50, 0.4) 100%);
  }
  ol.gradient-list > li:nth-child(10n+9):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0.2) 0%, rgba(253, 220, 50, 0.2) 100%);
  }
  ol.gradient-list > li:nth-child(10n+10):before {
    background: linear-gradient(135deg, rgba(162, 237, 86, 0) 0%, rgba(253, 220, 50, 0) 100%);
  }
  ol.gradient-list > li + li {
    margin-top: 0.3rem;
  }
`;

export const BucketCard = styled.div`
  border: ${({ active, theme }) => active ? '3px solid #80bdff' : 'none'};
  border-radius: 20px;
  background-color: ${({ theme, active }) => theme.dark ? '#2a2a2a' : active ? '#ffffff' : '#f1f1f1'};
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
  margin: 5px;
  @media (max-width: 767px) {
    margin: 15px;
  }
  min-height: 150px;
  
  h3{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.75rem + ${fontSize - 92}%)` : '1.75rem'};
    text-align: center;
    padding-top: 0.5rem;
  }
  .form-group-input{ 
    margin: 1rem!important;
  }
  cursor: pointer;
`

export const AnchorTag = styled.a`
display:flex;
padding-top:5px;
justify-content:flex-end
`;

export const StatusWrap = styled.div`
padding: 0 25px 20px;
`

import styled from 'styled-components';

export const FileList = styled.div`
    margin-right: 24px;
    border: 1px dashed #deff;
    padding: 11px;
    background: #efefef;
    border-radius: 5px;
    width: 100%;
`;


export const OptionInput = styled.label`
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  
  /* in test */
  margin-top: 6px;
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
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  span{
    position: relative;
    left: -100px;
    top: -4px;
    height: 23px;
    width: 23px;
    background-color: rgb(228, 228, 228);
    border-radius: 50%;
    box-sizing: border-box;
  }
  span:after {
    content: "";
    position: relative;
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
    left: 9px;
    top: 5px;
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
    white-space: nowrap;
  }
`

export const CustomCheck = styled.div`
  padding: 15px 1.5rem;
  .container-check{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    justify-content: start;
    padding-left: 2rem;
    margin: 0;
  }
  .checkmark-check{
    top: -1px;
  }
`

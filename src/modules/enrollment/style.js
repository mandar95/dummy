import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap';

export const Wrapper = styled.div`
    padding: 20px 40px 20px 0;
`;

export const Title = styled.div`
    margin-bottom: 3rem;
    h4 {
        color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#000000'};
        text-align: center;
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(19px + ${fontSize - 92}%)` : '19px'};
        
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

export const Rows = styled(Row)`
margin-left: ${({ modal }) => modal ? '0' : '-15px'} !important;
margin-right: ${({ modal }) => modal ? '0' : '3px'} !important;`

export const Cols = styled(Col)`
@media (min-width: 992px) {
    ${({ even }) => even ? 'padding-left: 0' : 'padding-right: 0'}
}`


export const Label = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'}!important;
color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
`

export const Div = styled.div`
width: ${({ width }) => (width || '96.5%')};

display: grid;
${({ width }) => (width ? 'margin-left: 27px;' : '')}

${({swal})=>swal? `
.table-responsive{
    margin: 0 !important;
}
width: 100%;
`:''}


@media (max-width: 720px) {
  padding: 0 15px;
  ${({ width }) => (width ? 'margin-left: 15px;' : '')}
  
}
`
export const PTag = styled.p`
color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'};
line-height: 30px;
margin-bottom: 0;
.agree-pay-div{
    margin-bottom: 0;
}
`

export const Head = styled.span`
	text-align: center;
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
	
	letter-spacing: 1px;
	color: #007bff;
  svg {
    height: 15px;
    padding-left: 5px;
  }
`;

export const OptionInput = styled.label`
  margin-left: 20px;
  cursor: pointer;
  user-select: none;
  position: absolute;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  span{
    position: relative;
    left: -25px;
    top:  -7px;
    height: 20px;
    width: 20px;
    min-width: 20px;
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
  /* &:hover input ~ span{
    background-color: #1bf29e3b;
    transition: all 0.2s;
  } */
  input:checked ~ span {
    background-color: #1bf29e !important;
  }
  input:checked ~ span:after {
    display: block;
  }
  span:after {
    left: 3px;
    top: 0px;
    width: 5px;
    height: 10px;
    transition: all 1s;
    border: solid rgb(255, 255, 255);
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    zoom: 1.6;
    -moz-transform: scale(1.6);
}
`

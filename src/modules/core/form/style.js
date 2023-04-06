import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MainContent = styled.div`
  // background: #F3F8FB;
  -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
`
const LoginS2 = styled(MainContent)`
  position: relative;
  z-index: 1;
  overflow: hidden;
  &:after{
    content: '';
    position: absolute;
    height: 195%;
    width: 94%;
    // background: #d3d4cf;
    background-image: url('/assets/images/Intersection 4@2x.png');
    border-radius: 50%;
    right: -55%;
    z-index: -2;
   // opacity: 0.3;
   // top: -47%;
   top:-51%;
    //box-shadow: inset 0 0 51px rgba(0, 0, 0, 0.1);
  }
`

const Container = styled(LoginS2)`
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
`
const LoginBox = styled(Container)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  min-height: calc(100vh - 88.63px - 56px - 20px);
  form {
    margin: auto;
    // width: 450px;
    // max-width: 100%;
    background: #fff;
    border-radius: 3px;
    background: transparent;
}
@media (max-width:525px) {
  display:block !important;
  padding-top:75px;
    }
`
const Card = styled.div`
  border: none;
  border-radius:35px;
  background-color: #fff;
  -webkit-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  `
// box-shadow: 0 10px 15px 11px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
const CardBody = styled(Card)`
  padding: 1.6rem;
  width: 90%;
  margin: auto;
`
const LoginFormHead = styled.div`
  text-align: center;
  padding: 35px 50px 30px 50px;
  h4 {
    letter-spacing: 0;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};
    
    margin-bottom: 7px;
    letter-spacing: 1px;
    margin-top: -10px;
  }
  p {
    
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    line-height: 15px;
    color: grey;
  }
`
const LoginFormBody = styled.div`
  padding: 35px 50px;
  text-align: center;
`
const FormGroup = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  margin-bottom: 30px;
	position: relative;

  `

const FormTextInput = styled.input`
  padding-left: 16px;
  padding-top: 16px;
  text-align: center;
  box-shadow: 0 0 22px rgba(0, 0, 0, 0.07);
  border: 0.1px solid #ccc;
  //border-radius: 500px;
  padding-left: 16px;
	padding-top: 16px;
	padding-bottom: 15px;
  padding-right: 16px;
 // width: 150%;
  min-width: 250px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
  transition: 0.3s ease;
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
  &:focus{
    outline: none;
    box-shadow: none !important;
    border: 1px solid lightgray;
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    -o-box-shadow: none !important;
    -ms-box-shadow: none !important;
  }
`

const FormTextIcon = styled.span`
  margin-left: ${props => props.marginL ? props.marginL : "-35px"};
  float: right;
  position: absolute;
  // right: 14px;
  margin-top:10px;
  i {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  }
`;


const FormLabel = styled.label`
  position: absolute;
  border-radius: 500px;
	transition: 0.25s ease;
	-moz-transition: 0.25s ease;
	-webkit-transition: 0.25s ease;
	-o-transition: 0.25s ease;
	-ms-transition: 0.25s ease;
	color: #270f49;
	top: -12px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  text-align: center;
  span {
    background: #fff;
    padding: 2px 4px;
    display:flex;
    flex-wrap:nowrap;
    
    letter-spacing: 1px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
    color: #606060;
    }
`
const Button = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  margin-top:20px;
  margin-bottom: 20px;
  
  -webkit-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
  outline: none;
  cursor: pointer;
  background-image: ${({ bgColor }) => bgColor || 'linear-gradient(to left,#3fd49f 0%,#1ad2a4 100%)'};
  color: #fff;
  letter-spacing: 1px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  border: 1px dotted #1ad2a4;
  padding: 10px 40px;
  box-shadow: 0 10px 15px -3px #F9FBE7, 0 4px 6px -2px #F9FBE7;
  i {
    margin-left: 15px;
    -webkit-transition: margin-left 0.3s ease 0s;
    transition: margin-left 0.3s ease 0s;
  }
  &:hover, &:focus{
    outline: none;
  }
`
const AnchorTag = styled(Link)`
  
  letter-spacing: 1px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(11px + ${fontSize - 92}%)` : '11px'};
  text-align: center;
  margin-top: 25px;
  outline: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  padding:10px !important;
  label {
    cursor: pointer;
  }
`
const AnchorTag2 = styled.span`
  
  letter-spacing: 1px;
  font-size: ${({ theme: { fontSize }, fontSizeCustom }) => (fontSize || fontSizeCustom) ? `calc(${fontSizeCustom || '11px'} + ${fontSize - 92}%)` : '11px'};
  text-align: center;
  margin-top: 25px;
  outline: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  padding:10px !important;
  label {
    cursor: pointer;
  }
`
export {
  LoginBox,
  CardBody,
  LoginFormHead,
  LoginFormBody,
  FormGroup,
  FormTextInput,
  FormTextIcon,
  FormLabel,
  Button,
  AnchorTag,
  AnchorTag2
}

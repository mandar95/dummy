import styled from "styled-components";

// .container2inner {
//     padding: 0 15px 50px;
//     width: auto;
// }

// ::after,
//  ::before {
//     box-sizing: border-box;
// }

// .block1 {
//     margin-top: 1.5rem !important;
//     padding: 0 !important;
//     box-flex: 0;
//     flex: 0 0 75%;
//     max-width: 120%;
// }

const CardComponent = styled.div`
  border: none;
  border-radius: 0 35px 0 35px;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#ffffff'} !important;
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
  margin: 30px;
  @media (max-width: 767px) {
    margin: 15px;
  }
`;

const CardBody = styled(CardComponent)`
padding: 1.6rem;
`;

const CardRow = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

const Row1 = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

const IconlessCardRow = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  border-radius: 35px 35px 35px 35px;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#ffffff'} !important;
  @media (max-width: 767px) {
    margin: 15px;
    width : 80%;
  }
`;

const Container2 = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;

`;

const HeaderContainer = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;

`;

const Header = styled.div`
  margin-top: -16px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 24px;
  .icon {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(32px + ${fontSize - 92}%)` : '32px'};
    color: #fff;
    background: #000;
    height: 40px;
    width: 40px;
    text-align: right;
    position: absolute;
    left: -24px;
    top: -24px;
    border-radius: 3px 5px 20px 5px;
    background-color: #f2c9fb;
  }
  @media only screen and (max-width: 767px) and (min-width: 480px) {
    margin-top: -5px;
  }
  @media (max-width: 767px) {
    margin-top: -5px;
  }
`;

const HeaderBlue = styled.div`
  margin-top: -16px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 24px;
  .iconBlue {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(32px + ${fontSize - 92}%)` : '32px'};
    color: #fff;
    background: #000;
    height: 45px;
    width: 45px;
    text-align: right;
    position: absolute;
    left: -28px;
    top: -29px;
    border-radius: 100px;
    background-color: #6334e3;
  }
  @media only screen and (max-width: 767px) and (min-width: 480px) {
    margin-top: -5px;
  }
  @media (max-width: 767px) {
    margin-top: -5px;
  }
`;

const BottomHeader = styled.div`
  border-bottom: 1px dotted #d0ff37;
  margin-right: 0%;
  margin-left: 0%;
  width: inherit;
  margin-top: 8px;
`;

const Container3 = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: auto;
  padding-right: 18px;
  padding-left: 18px;
  margin-top: 3rem !important;

`;

const CardContentBox = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: auto;
  padding-right: 18px;
  padding-left: 18px;
  margin-top: 3rem !important;
`;

// flex benefit
const Container = styled.div`
    display: flex;
`;
const TabContainer = styled.div`
    display: flex;
    margin-top: 30px;
    margin-left: 30px;
    flex-direction: column;
    @media (max-width: 767px) {
    margin-left: 0;
  }
`;

//details
const CardInfo = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: -50px;
    /*margin-left:30px; media screen */
    flex-wrap: wrap;
    @media (max-width: 768px) {
    margin-left:-23px;
    margin-right:-23px;
    flex-wrap: wrap;
    justify-content : center;
    }
`;

const ImageBox = styled.div`
  border-radius: 50%;
  background: ${({ theme }) => (theme.Tab?.color || '#6334e3')};
  @media (max-width: 600px) {
   display:none;
  }
`;

const InfoBlock = styled.div`
  margin: 15px 80px 15px 80px;

`;

const InfoBlock1 = styled.div`
  margin: 15px 80px 15px 80px;

`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 0.2px dashed #6334e3;
  @media (max-width: 1050px) {
  border-left: none;
  }
`;

const Box1 = styled.div`
  display: flex;
  flex-direction: column;
`;

// CardBody

const CardBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin-top: 20px;
`;

const AccordianImage = styled.div`
  border-radius: 50%;
  border: 3px solid #d4e157;

`;

const LabelTag = styled.label`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 8px;
`;

const AccordionContainer = styled.label`
  min-width: 350px;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 7px 9px -2px rgba(0.01, 0.2, 0.2, 0.01);
  border-radius: 12px;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#ffffff'};
  flex-wrap:wrap;
  @media (max-width : 411px){
    min-width : 320px;
  }
`;

const BoxContent = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 5px;
  flex-wrap:wrap;
  @media (max-width : 411px){
  justify-content : center;
  }
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap:wrap;
`;


export const AccordianWrap = styled.div`
padding-right: 25px;
flex-direction: row;
@media (max-width : 411px){
  padding-right: 0px;
}
`;

export const OptionInput = styled.label`
  width: ${({ width }) => width || 'max-content'};
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  
  margin-top: ${({ single, small }) => !single ? small ? '8' : '8' : '0'}px;
  margin-bottom: ${({ single, small }) => !single ? small ? '4' : '2' : '-52'}px;
  margin-left: ${({ small }) => small ? '30' : '10'}px;
  position: relative;
  cursor: ${({ notAllowed }) => notAllowed ? 'not-allowed' : 'pointer'};
  user-select: none;
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : 'rgb(131, 109, 109)'} !important;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  input {
    position: absolute;
    opacity: 0;
    cursor: ${({ notAllowed }) => notAllowed ? 'not-allowed' : 'pointer'};
    height: 0;
    width: 0;
  }
  span{
    position: relative;
    left: -15px;
    top: ${({ small }) => small ? '-2' : '-3'}px;
    height: ${({ small }) => small ? '20' : '25'}px;
    width: ${({ small }) => small ? '20' : '25'}px;
    min-width: ${({ small }) => small ? '20' : '25'}px;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0px 2px 6px 0px #0b0b0b40;
    border: 1px solid ${({ theme }) => theme?.Tab?.color || '#41807f'};
    cursor: ${({ notAllowed }) => notAllowed ? 'not-allowed' : 'pointer'};
  }
  span:after {
    content: "";
    position: relative;
    display: none;
    }
  &:hover input ~ span{
    background-color: ${({ theme }) => theme?.Tab?.color || '#41807f'}3b;
    transition: all 0.2s;
  }
  input:checked ~ span {
    background-color: ${({ theme }) => theme?.Tab?.color || '#41807f'} !important;
  }
  input:checked ~ span:after {
    display: block;
  }
  span:after {
    left: ${({ small }) => small ? '4.8' : '4'}px;
    top: ${({ small }) => small ? '1.5' : '1'}px;
    width: 5px;
    height: 10px;
    transition: all 1s;
    border: solid rgb(255, 255, 255);
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    zoom: ${({ small }) => small ? '1.3' : '1.7'};
    }
  .label_name{
    max-width: ${({ label_name_width }) => label_name_width || '250px'};
    font-size: ${({ theme, small }) => theme.fontSize ? `calc(${(small ? '1' : '1.1') + 'rem'} + ${theme.fontSize - 92}%)` : ((small ? '1' : '1.1') + 'rem')};
    padding-left: ${({ label_padding }) => label_padding ? '20px' : '0'};
    margin-bottom: 0;
    color: #114a7d;
    margin-left: -5px;
    white-space: pre-wrap;
  }
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
    margin-left: 0.4rem;
  }
  .tooltip.show {
    opacity: 1;
  }
  .tooltip {
    padding: 6px;
    max-width: 280px;
    border-radius: 0;

  }
  .tooltip-inner {
    max-width: 100%;
    width: 100%;
    padding: 10px 18px;
    border-radius: 0;
    color: #d2d3d4;
    line-height: 18px;
    background-color: #1c1c1c;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    text-align: start;
  }
  .cursor-help{
    cursor:help;
  }
`


export {
  HeaderContainer,
  CardContentBox,
  CardRow,
  Row1,
  IconlessCardRow,
  Container2,
  Header,
  BottomHeader,
  Container3,
  HeaderBlue,
  Container,
  TabContainer,
  CardInfo,
  ImageBox,
  InfoBlock,
  InfoBlock1,
  Box,
  Box1,
  CardBox,
  AccordianImage,
  LabelTag,
  AccordionContainer,
  BoxContent,
  BoxContainer,
};

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
    flex-wrap: no-wrap;
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

import styled from "styled-components";

//cdbalance ---
const Container = styled.div`
  background: #f3f8fb;
  display: flex;
  flex-direction: row;
  @media (max-width:600px){
    flex-wrap:wrap;
  }
`;
const FilterContainer = styled.div`
  min-width: 70px;
  max-width: 100px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  @media (max-width:600px){
    width:100%;
    max-width: 100%;
  }
`;

const SecondContainer = styled.div`
  margin-left: 240px;
  width: 900px;
  @media (max-width:600px){
    flex-wrap:wrap;
    margin-left:0px;
    width:100%;
  }
`;
//---

//Cdcard --
const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 30px;
`;
const ImageBox = styled.div`
  display: flex;
  width: 300px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    flex: 0 0 50%;
    max-width: 50%;
    width: 200px;
  }
  @media (max-width:600px){
    display:none;
  }
`;

const TextBox = styled.div`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  
  line-height: 32px;
  width: 300px;
`;

const InfoBox = styled.div`
  border-top: 1px dashed #bed1db;
  border-bottom: 1px dashed #bed1db;
  width: 100%;
  text-align: center;
  padding: 24px;
`;

const DivButtonCard = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #bed1db;
`;
const DivPremiumText = styled.div`
  color: #f06292;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(28px + ${fontSize - 92}%)` : '28px'};
  @media (max-width:600px){
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
  }
`;

const SpanFloatRight = styled.span`
  float:right;
`;

const SpanFloatLeft = styled.span`
  float:left;
`;
//---

//Filters
const DivSelect = styled.div`
  margin: 25px 0px;
  margin-top: -2px;
`;

const DivButtonAlign = styled.div`
  float: right;
  margin-top: 10px;
`;
//---

//ButtonCard Component
const BoxContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  background: #eceff1;
  border-radius: 10px;
  padding: 20px;
  overflow:hidden;
`;
const ButtonContent1 = styled.div`
  padding: 30px 50px 30px 50px;
  display: flex;
  flex: 1;
  flex-direction: column;
  text-align: center;
  border-right: 1.2px dashed #8bc34a;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
`;

const ButtonContent = styled.a`
  padding: 30px 50px 30px 50px;
  display: flex;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
  flex: 1;
  flex-direction: column;
  text-align: center;
  color: black;
`;
//---

//Modal-Content
const ModalTopContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ModalContentBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 30px;
  height: 40%;
  border-bottom: 1px dashed #d0ff37;
`;

const ModalImageBox = styled.div`
  margin-left: 40px;
  display: flex;
  width: 350px;
  height: 130px;
  flex-wrap: wrap;
  /* @media(min-width: 768px){
  flex: 0 0 50%;
  max-width: 50%;
  width: 250px
} */
`;

const ModalTextBox = styled.div`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  
  line-height: 32px;
  width: 360px;
`;

const Modalbuttonstyle = styled.div`
  padding-top: 10px;
  display:flex;
  flexDirection:column;
`;

const InputFeild = styled.div`
margin-left: 35px;
align-items:center;
justify-content: space-between;
display: flex;
flex-direction: row;
flex-wrap: wrap;
width: 90%;
padding-bottom: 10px;
`;

const FloatHeader = styled.div`
text-align: center;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`;


export {
  Container,
  FilterContainer,
  SecondContainer,
  //cd-card
  TopContainer,
  ContentBox,
  ImageBox,
  TextBox,
  InfoBox,
  DivButtonCard,
  DivPremiumText,
  SpanFloatRight,
  SpanFloatLeft,
  //filters
  DivSelect,
  DivButtonAlign,
  //ButtonCard
  BoxContainer,
  ButtonContent1,
  ButtonContent,
  //Modal Content
  ModalTopContainer,
  ModalContentBox,
  ModalImageBox,
  ModalTextBox,
  Modalbuttonstyle,
  InputFeild,
  FloatHeader
};

import styled from "styled-components";
//add member
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 350px;
  margin-left: 30px;
  @media(max-width:400px){
    margin-left:10px;
    width:100%;
  }
`;

const ScreenContainer = styled.div`
  display: flex;
  margin-left:10px;
`;

//bulk member
const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const SelectContainer = styled.div`
  margin-top: -30px;
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;

const Spacer = styled.div`
padding-top:20px;
`;

//CardBody

const ContentBox = styled.div`
`;

const CardContent = styled.div`
/* display:flex; */
flex-direction:row;
padding-top:20px;
margin-top:20px;
padding-right:10px;
padding-bottom:20px;
padding-left:10px;
border:0.2px solid #6334e3;
border-radius:8px;

`;

const AnchorTag = styled.span`
color: ${({ theme }) => theme?.Tab?.color || '#6495ed'};
cursor: pointer;
display:flex;
padding-top:5px;
justify-content:flex-end;
`;

const ButtonContainer = styled.a`
display:flex;
padding-top:10px;
justify-content:flex-end;
`;

export {
  Container,
  RadioContainer,
  TabContainer,
  SelectContainer,
  ContentBox,
  CardContent,
  Spacer,
  AnchorTag,
  ButtonContainer,
  ScreenContainer
};

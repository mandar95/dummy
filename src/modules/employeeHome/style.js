import styled, { createGlobalStyle } from "styled-components";
import { Row } from "react-bootstrap";

export const GlobalStyle = createGlobalStyle`
    .custom-footer{
        margin-top: 0;
        padding: 20px 0 20px;
    }
`;

export const Wrapper = styled.div`
  //margin: 10px 80px;
  // margin: 10px 50px;
  margin: 10px 0px 0px 50px;
  min-height: calc(100vh - 153px);
  background-image: url(/assets/images/vector-shape.png);
  // background-position: right bottom;
  background-position: top 168px right -515px;
  background-repeat: no-repeat;

  @media (max-width: 767px) {
    background-image: none;
    margin: 10px 20px;
  }
`;
export const IMG = styled.img`
  height: auto;
  position: absolute;
  width: ${({ width }) => width || '82%'};
  max-height: 180px;
  @media (max-width: 987px) {
    width: auto;
  }
  @media (max-width: 767px) {
    width: auto;
    height: 100px;
    position: unset;
  }
  @media (max-width: 290px) {
    width: auto;
    height: 70px;
    position: unset;
  }
`;
export const Title = styled.div`
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};
  margin-top: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  @media (max-width: 987px) {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
  }
  @media (max-width: 767px) {
    margin-top: 15px;
  }
  @media (max-width: 290px) {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  }
`;

export const SubTitle = styled.div`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
  letter-spacing: 0.5px;
  
  @media (max-width: 987px) {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
  }
`;

export const SubTitle2 = styled(Title)`
  margin-top: 0px;
`;

export const SelectDiv = styled.div`
  background: ${({ BgColor }) => (BgColor ? BgColor : "red")};
  padding: 13px;
  width: 140px;
  border-top-left-radius: 14px;
  border-bottom-right-radius: 39px;
  
  color: #fff;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  letter-spacing: 1px;
  margin-top: 39px;
  margin-right: -2px;
  @media (max-width: 767px) {
    margin-top: 0px;
  }
`;

export const ContentDiv = styled(Row)`
  justify-content: center;
`;
export const TopDiv = styled.div`
  margin-bottom: 30px;
  @media (max-width: 992px) {
    margin-bottom: 0px;
  }
  @media (max-width: 767px) {
    margin-bottom: 0px;
  }
`;

export const LoginUICard = styled.div`
  // width:60%;
  width: 35%;
  cursor: pointer;
  margin: 5px;
  margin-bottom: 30px;

  padding: 15px 15px 0px 15px;
  border: ${({ Border }) => (Border ? `2px solid ${Border}` : "1px solid red")};
  background: ${({ BgColor }) => (BgColor ? BgColor : "red")};
  border-radius: 48px;
  margin-right: 36px;
  @media (max-width: 992px) {
    width: 80%;
  }
  @media (max-width: 767px) {
    text-align: center;
    width: 100%;
    margin-right: 0px;
  }
`;

export const LoginUICard2 = styled.div`
  // width:60%;
  cursor: pointer;
  margin: 5px;
  margin-bottom: 30px;

  padding: 15px 15px 0px 15px;
  border: ${({ Border }) => (Border ? `2px solid ${Border}` : "1px solid red")};
  background: ${({ BgColor }) => (BgColor ? BgColor : "red")};
  border-radius: 48px;
  margin-right: 36px;
  @media (max-width: 767px) {
    text-align: center;
    width: 100%;
    margin-right: 0px;
  }
`;
export const SMALL = styled.small`
  @media (max-width: 767px) {
    display: none;
  }
`;

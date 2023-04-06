import styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import Paper from "@material-ui/core/Paper";

const TableDiv = styled.div`
  margin-top: -20px;
`;

const PreviewImg = styled.img`
  height: 200px;
  display: flex;
  justify-content: flex-end;

  width: -moz-available;
  width: -webkit-fill-available;
  background-position: center;
  background-size: cover;
  @media (max-width: 600px) {
    width: 100%;
  }
`;


const CarausalDiv = styled.div`
  border-bottom: 1px dashed #d0ff37;
  padding: 10px;
  margin-top: -20px;
  width: -moz-available;
  width: -webkit-fill-available;
`;

const BenefitList = styled.div`
  margin-left: 5px;
  border: 1px dashed #deff;
  padding: 11px;
  background: #efefef;
  border-radius: 5px;
  width: 90%;
`;

//Announcement display
// const Paper = styled(Row)`
// background-color : ${props => props.backgroundColor || "#f2c9fb"};
// border-radius : ${props => props.radius || '12px'};
// box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
// margin-top : ${props => props.margin || "2em"};
// margin-bottom : ${props => props.margin || "2em"};
// padding-top : ${props => props.padding || "2em !important"};
// padding-bottom : ${props => props.padding || "2em !important"};
// color : ${props => props.color || "#6334e3"};
// display: flex;
// width:fill-available;
// flex-wrap: wrap;
// @media (max-width: 767px) {
// 	margin: 15px !important;
// }
// `;
//alignment
const DivTag = styled.div`
  display: flex;
  justify-content: ${(props) => props.alignment || "flex-start"};
  margin-left:30px;
  margin-right:30px;
`;

const RowDiv = styled(Row)`
  padding: 10px;
  display: flex;
  overflow:auto;
  justify-content: center;
`;

const ImgTag = styled.img`
  height: 60px;
  display: flex;
  justify-content: flex-end;
  width: auto;
  background-position: center;
  background-size: cover;
  @media (max-width: 600px) {
    padding-top: 10px;
  }
  @media(max-width:778px){
    display:none;
  }
`;

const NotificationImg = styled.img`
  height: 60px;
  display: flex;
  justify-content: flex-end;

  width: auto;
  background-position: center;
  background-size: cover;
  @media (max-width: 600px) {
    padding-top: 10px;
  }
`;

//font color,weight
const ColDiv = styled(Col)`
  overflow:auto;
  flex-wrap:wrap;
  padding-right:30px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  color: ${props => props.color || "white" };
  white-space: pre-line;
`;

const ColImgDiv = styled(Col)`
  display:flex;
  align-items:center;
  justify-content:flex-end;

`;

const PreviewImgTag = styled.img`
  height: 250px;
  width: ${ props => props.size || "-webkit-fill-available"};
  background-position: center;
  background-size: cover;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export {
  TableDiv,
  PreviewImg,
  BenefitList,
  CarausalDiv,
  Paper,
  RowDiv,
  ImgTag,
  DivTag,
  ColDiv,
  ColImgDiv,
  PreviewImgTag,
  NotificationImg
};

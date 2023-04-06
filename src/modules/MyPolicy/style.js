import styled from "styled-components";
import { Row } from 'react-bootstrap';

const Container = styled.div`
  margin-top:10px;
`;

const Paper = styled(Row)`
background-color : ${props => props.backgroundColor || "#f2c9fb"};
border-radius : ${props => props.radius || "2.6em"};
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
margin : ${props => props.margin || "2em"};
padding : ${props => props.padding || "2em !important"};
color : ${props => props.color || "#6334e3"};
display: flex;
margin-right: 35px !important;
margin-left: 35px !important;
flex-wrap: wrap;
@media (max-width: 767px) {
	margin: 15px !important;
}
`;

//My Insurance
const DivSelect = styled.div`
`
  ;

const DivButton = styled.div`
display:flex;
justify-content: flex-end;
flex-wrap:wrap;
@media (max-width: 600px) {
  flex-wrap:nowrap ;
  justify-content:space-evenly;
}
`
  ;

export { Container, Paper, DivSelect, DivButton };

import styled from "styled-components";
//Dashboard
const Container = styled.div`
 display:flex,
 flex-direction:column;
  margin-top: 20px;
  margin-bottom: 60px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const FieldContainer = styled.div`
  margin-top: -20px;
  @media (max-width: 600px) {
    margin-left: 15%;
    width: 50%;
  }
`;
//widgetboard
const WidgetWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content:space-evenly;
  @media (max-width: 600px) {
    display: block;
    overflow: auto;
  }
`;
const GraphContainer = styled.div`
  display: flex;
  margin-top: -40px;
  margin-bottom: -10px;
  margin-right: -20px;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    margin-left: -10px;
    margin-bottom: -10px;
  }
`;

const SubGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  padding: 10px;
`;

const TableCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  @media (max-width: 1206px) {
    flex-wrap: wrap;
  }
`;

const TableContainer = styled.div`
  display: flex;
  margin-top: -20px;
  margin-bottom: -10px;
  margin-right: -20px;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    margin-left: 2px;
    margin-bottom: -10px;
  }
`;

const SubTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  padding: 5px;
`;

const TableDiv = styled.div`
  display: flex;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  
  padding-bottom:5px;
  padding-top:5px;
  overflow:auto;
  padding-right: 1rem;
    border: 1px dotted #dbdbdb;
    &:nth-child(even){border-left:0;}&:nth-child(even){border-left:0;}
    &:first-child{border-radius: 30px 0 0;}
    &:nth-child(2){border-radius: 0 30px 0 0;}
    &:nth-child(7){border-radius: 0 0 0 30px;}
    &:last-child{border-radius: 0 0 30px;}
  @media (max-width: 600px) {
    border-bottom:none;
    border-top:none;
    width:100%;
    overflow:auto;
  }
`;


const TableRow = styled.div`
  display: flex;
`;

const TableSubDiv = styled.div`
  display: flex;
  width: 100%;
  padding: 15px;
  color: #000000;
`;

const TableValueDiv = styled.div`
  justify-content: flex-end;
  padding: 15px;
  color: #000000;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
  
`;

export {
  Container,
  CardContainer,
  FieldContainer,
  GraphContainer,
  SubGraphContainer,
  WidgetWrapper,
  TableCardWrapper,
  TableContainer,
  SubTableContainer,
  TableRow,
  TableDiv,
  TableSubDiv,
  TableValueDiv,
};

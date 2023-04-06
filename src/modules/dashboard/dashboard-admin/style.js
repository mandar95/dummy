import styled from "styled-components";
//Dashboard
const Container = styled.div`
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
    margin-left:15%;
    width:50%;
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
  margin-right:-20px;
  width:100%;
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
  padding:10px;
`;



export {
  Container,
  CardContainer,
  FieldContainer,
  GraphContainer,
  SubGraphContainer,
  WidgetWrapper,
};

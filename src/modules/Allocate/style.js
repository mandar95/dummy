import styled from "styled-components";

const Container = styled.div`
  display: flex;
  margin: 0;
  @media (max-width: 600px) {
    width:100%;
    overflow:auto;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 600px) {
    flex-wrap:wrap;
  }
`;

const DivButton = styled.div`
  margin-top:20px;
  float:right;
  @media (max-width: 600px) {
    padding-top:10px;
    float:right;
  }

`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  @media only screen and (max-width: 767px)  {
    flex-wrap:  wrap;
`;
export { Container, Content, DivButton, ButtonContainer };

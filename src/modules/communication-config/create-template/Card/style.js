import styled from "styled-components";

const CardComponent = styled.div`  
  border: ${({ border = '' }) => (border)};
  border-radius: 10px;
  margin: 20px 0 40px;
  background-color: ${({ variant }) => (variant)};
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
`;

const CardBody = styled(CardComponent)`
  padding: 0.5rem;
`;

const CardRow = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

const Label = styled.span`
margin: -28px 0 0 -9px;
border: 1px double #2400ff;
border-radius: 30px;
background-color: #d2ff12;
color: #3b00a5;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};

padding: 10px 20px;`


const Container = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: auto;
`;

export { CardRow, Container, Label };

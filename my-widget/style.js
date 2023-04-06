import styled from "styled-components";

const Card = styled.div`
  ${({ Hex1, Hex2 }) => {
    return `
  display: flex;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(to bottom, ${Hex1} 0%, ${Hex2} 52%);
  padding: 6px;
  border: 1px solid #efefef;
  border-radius: 30px;
  // background-color: #fff;
  -webkit-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 5px;
  min-width:188px;
`;
  }}
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  color: white;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
  letter-spacing: 1px;
  margin-left: 20px;
  margin-right: 20px;
`;

const ImageTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  padding: 10px;
`;
export { Card, WidgetHeader, ImageTag };

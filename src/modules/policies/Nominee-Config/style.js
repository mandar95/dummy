// styling
import styled from "styled-components";
export const TR = styled.tr`
background: ${({ theme }) =>
    theme.PrimaryColors?.tableColor || "rgb(243,243,243,243)"};
color:#FFFFFF;
text-align: center;
`;
export const HeaderDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: -12px;
  margin-bottom: 15px;
  .icon {
    background-color: ${({ theme }) =>
    theme.PrimaryColors?.tableColor || "rgb(243,243,243,243)"};
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin: -1px 10px 0 -30px;
    i {
      color: white;
      padding: 13px 16px;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};
    }
  }
  .title {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    margin: 0;
    
  }
  .secondary-title {
    margin: 0;
    color: #5b5b5b;
  }
`;

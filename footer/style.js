import styled from "styled-components";

export const FooterWrapper = styled.div`
  text-align: center;
  padding: 15px 0 15px;
  background: ${({ theme }) => (theme.PrimaryColors?.color2 || '#2e0d34')};
  margin-top: 20px;
  p,span  {
    color: #fff;
    margin-bottom: 0;
    letter-spacing: 1px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    line-height: 26px;
  }
  p {
    padding: 0 9rem;
  }
  span{
    position: absolute;
    bottom: 15px;
    right: 6px;
  }
  @media screen and (max-width: 668px) {
    p {
    padding: 0 1rem;
  }
  span{
    position: inherit;
  }
  }
  ${({ noLogin }) => noLogin ? `position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;` : ''}
  
`;

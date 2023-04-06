import styled from 'styled-components';

export const RoundColor = styled.div`
height: 40px;
background-color: #d0ff37;
border-radius: 50%;
float: right;
width: 40px;
position: relative;
i{
  top: 8px;
  cursor: pointer;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
  position: absolute;
  left: 10px;
}`


//Modal-Content
export const ModalTopContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Modalbuttonstyle = styled.div`
  padding-top: 10px;
  display:flex;
  /* flex-direction:column; */
`;

export const SpanFloatRight = styled.span`
  float:right;
`;


export const FloatHeader = styled.div`
text-align: center;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`;

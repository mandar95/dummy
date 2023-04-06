import styled from 'styled-components';


export const TabWrapper = styled.div`
  min-width: 110px;
  overflow:auto;
  margin: ${({ margin }) => margin || '30px'};
  @media (max-width: 767px) {
    margin: ${({ margin }) => margin || '15px'};
  }
  display: flex;
  justify-content: space-between;
  background-color:${({ bgColor, theme }) => theme.dark ? '#000000' : (bgColor || "#ffffff")};
  border-radius: 2.6em;
  padding: 0.6em 0.8em;
  max-width: ${({ width }) => (width || "250px")};
  box-shadow:${({ shadow }) => shadow || '0 10px 15px 11px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)'} ;
`;

export const Tab = styled.div`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.87em + ${fontSize - 92}%)` : '0.87em'};
  
  letter-spacing: 1px;
  text-align: center;
  cursor: pointer;
  border-radius: ${({ borderRadius }) => borderRadius || '2.4em'};
  transition : all 0.5s;
  padding: ${({ isActive }) => (isActive ? "1.4em 2em;" : "1.4em 1.5em")}; ;
  color: ${({ isActive, color, theme, textColor }) => (isActive ? "#ffffff" : color || textColor || theme.Tab?.color || "#6334E3")};
  background-color: ${({ isActive, bgColor, theme, secondary }) => ((isActive ? bgColor || theme.Tab?.color || "#6334E3" : "") + (secondary ? 'bf' : ''))};
  ${({ isActive, color, theme, bgColor, secondary }) =>
    !isActive
      ? `&:hover{
     background-color : ${(color || bgColor || theme.Tab?.color || '#6334E3') + (secondary ? 'bf' : '')};
     color : #ffffff;
  }`
      : ""}
`;

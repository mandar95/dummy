import styled from 'styled-components';
import { ProgressBar } from 'react-bootstrap';

export const ContainerStep = styled.div`
margin: auto;
z-index: 0;
width: 100%;
position: relative;
`

export const Wrapper = styled.div`
width : 190%;
`

export const ProgessBarStep = styled.ul`
counter-reset: step;
padding: 0px;
width: auto;
display: flex;
justify-content:space-between;
flex: wrap;
 li {
  list-style-type: none;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  position: relative;
  text-align: center;
  text-transform: capitalize;
  color: #7d7d7d;
}
  li:before {
  width: 40px;
  height: 40px;
  content: counter(step);
  counter-increment: step;
  line-height: 37px;
  
  display: block;
  text-align: center;
  margin: auto;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
  cursor: pointer;
  }
  .liner {
    height: 2px;
    background: #c8d657;
    position: absolute;
    margin: 0 auto;
    width: 100%;
    left: 0px;
    right: 0;
    top: 21px;
    z-index: 0;
  }
  
  @media (min-width: 320px) {
    .liner {
      width: 90%;
      left: 0;
    }
  }
  @media (min-width: 450px) {
    .liner {
      width: 85%;
      left: -17px;
    }
  }
  @media (min-width: 820px) {
    .liner{
      width: 85%;
    left: -17px;
    }
  }
  @media (min-width: 960px) {
    .liner{
      width: 90%;
    left: -17px;
    }
  }
`

export const ClaimHead = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
color: ${({ theme }) => theme.dark ? '#fafafa' : '#6c757d'};
cursor: pointer;
padding: 25px 10px;
max-width: 180px;
display:none;
@media (min-width: 450px) {
  & {display:contents;}
  
}

`

export const List = styled.li`
&:before{
${({ status, theme }) => {
    switch (status) {
      case 'completed': return `
    border: 2px solid #a6bb00;
    color: #ffffff;
    background-color: #c8d657 !important;
    p {
      color: #000000 !important;
    }`
      case 'active': return `
    border: 2px solid ${(theme?.Tab?.color)};
    color: #ffffff;
    background-color: ${(theme?.Tab?.color) + ' !important'};
  p {
    color: ${theme.dark ? (theme?.Tab?.color || '#888fef') : '#3f51b5'} !important;
  }`
      default: return `
    border: 2px solid #deff;`
    }
  }}
}
`
export const CaneclDiv = styled.div`
@media (max-width: 434px) {
  margin: 0 0 12px 0;
}
`;

export const ProgressText = styled.p`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    letter-spacing: 1px;
    
`;

export const StyledProgressBar = styled(ProgressBar)`
    height: 17px;
    border-radius: 10px;
    .progress-bar {
        background: linear-gradient(to left, #3fd49f 0%, #d0ff37 100%);
    }
`;

export const ProgressCount = styled.span`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    letter-spacing: 1px;
    
    color: #b0de1a;
`;

export const FileList = styled.div`
    margin-right: 24px;
    border: 1px dashed #deff;
    padding: 11px;
    background: #efefef;
    border-radius: 5px;
    width: 100%;
`;


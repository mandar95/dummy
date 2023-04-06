import styled from 'styled-components';

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
    width: 89%;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 21px;
    z-index: 0;
  }
  
  @media (max-width: 870px) {
    &{
      flex-direction: column;
    }
    .liner {
      height: 82%;
      width: 2px;
    }
  }

`

export const ClaimHead = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#929aa1'};
cursor: pointer;
padding: 25px 10px;
max-width: 180px;
span{
  display: block;
}

@media (max-width: 870px) {
  & {margin: 4px auto 42px auto;
  background: white;
  padding: 0px;}
  
}

`

export const List = styled.li`
${({ status, theme }) => {
    switch (status) {
      case 'completed': return `
      &:before{
    border: 2px solid #a6bb00;
    color: #ffffff;
    background-color: #c8d657 !important;
  }
    p {
      color: ${theme.dark ? '#c8d657' : '#000000'} !important;
    }
    `
      case 'active': return `
      &:before{
    border: 2px solid ${(theme?.Tab?.color)};
    color: #ffffff;
    background-color: ${(theme?.Tab?.color) + ' !important'};
  }
  p {
    color: ${theme.dark ? (theme?.Tab?.color || '#888fef') : (theme?.Tab?.color || '#3f51b5')} !important;
  }`
      default: return `
      &:before{
    border: 2px solid #deff;
  }`
    }
  }}

`

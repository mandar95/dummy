import styled from 'styled-components';

export const DashboardCard = styled.div`
    background: ${({ theme }) => theme.dark ? '#2a2a2a' : '#ffffff'};
    box-shadow: 2px 10px 20px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: 40px 25px 20px;
    height: 100%;
    width:auto;
  & + h4,h5 {
    color: #6c6c6c;
     font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.18em + ${fontSize - 92}%)` : '1.18em'};
  }
  & + h5 {
    display: block;  
  }
  h6 {
    
     font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.5em + ${fontSize - 92}%)` : '2.5em'};
    line-height: 64px;
    color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#323c43'};
  }
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    content: "";
    ${({ color }) => {

    switch (color) {
      case '1': return `
          background: linear-gradient(82.59deg, #00c48c 0%, #00a173 100%);
          `
      case '2': return `
          background: linear-gradient(81.67deg, #0084f4 0%, #1a4da2 100%);
          `
      case '3': return `
          background: linear-gradient(69.83deg, #0084f4 0%, #00c48c 100%);
          `

      default: return `
          background: linear-gradient(81.67deg, #ffb2be 0%, #69a1ff 100%);
          `
    }
  }}
  }
  
`

export const Div = styled.div`
  margin: 35px;
  @media (max-width: 767px) {
    margin: 15px 10px;
  }
`

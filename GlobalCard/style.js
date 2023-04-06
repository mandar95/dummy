import styled from "styled-components";

// .container2inner {
//     padding: 0 15px 50px;
//     width: auto;
// }

// ::after,
//  ::before {
//     box-sizing: border-box;
// }

// .block1 {
//     margin-top: 1.5rem !important;
//     padding: 0 !important;
//     box-flex: 0;
//     flex: 0 0 75%;
//     max-width: 120%;
// }

const CardComponent = styled.div`
  border: none;
  border-radius: 10px 35px 0 35px;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#ffffff'} !important;
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
  margin: 30px;
  @media (max-width: 767px) {
    margin: 15px 10px;
  }
  @media (max-width: 384px) {
    margin: 15px 20px;
  }
`;


export const CardBody = styled(CardComponent)`
  padding: 1.6rem;
  @media (max-width: 374px) {
    padding: 15px 0px;
  }
`;

const CardRow = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;


const Row1 = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

const IconlessCardRow = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  border-radius:35px 35px 35px 35px;

  ${({ Ribbon }) => Ribbon && `
  &::before{
    right: 0.9rem;
    content: '';
    position: absolute;
    z-index: 1;
    border-style: solid;
    border-width: 0 0 14px 16px;
    border-color: transparent transparent transparent #ffdf00;
    top: 190px;

  }
  
  &::after{
    position: absolute;
    content: "";
    border-radius: 3px;
    top: 170px;
    right: 13px;
    padding: 0.7rem;
    width: 10rem;
    background: #ffdf00;
    color: white;
    text-align: center;
    font-family: 'Roboto',sans-serif;
    box-shadow: 4px 4px 15px rgb(26 35 126 / 20%);
  }
`}
  

`;

const Container2 = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
`;


const HeaderContainer = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
`;

const Header = styled.div`
  margin-top: -16px;
  font-weight: 500;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  letter-spacing: 1px;
  margin-left: 24px;
  .icon {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(32px + ${fontSize - 92}%)` : '32px'};
    color: #fff;
    background: #000;
    height: 40px;
    width: 40px;
    text-align: right;
    position: absolute;
    left: -24px;
    top: -24px;
    border-radius: 3px 5px 20px 5px;
    background-color: ${({ theme }) => (theme.Card?.color || '#f2c9fb')};
  }
  @media only screen and (max-width: 767px) and (min-width: 480px) {
    margin-top: -5px;
  }
  @media (max-width: 767px) {
    margin-top: -5px;
  }
  @media (max-width: 374px) {
    & .icon {
     height: 35px;
     width: 35px;
     left: -5px;
     top: -24px;
    }
   }
`;

const HeaderBlue = styled.div`
  margin-top: -16px;
  font-weight: 500;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  letter-spacing: 1px;
  margin-left: 24px;
  .iconBlue {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(32px + ${fontSize - 92}%)` : '32px'};
    color: #fff;
    background: #000;
    height: 45px;
    width: 45px;
    text-align: right;
    position: absolute;
    left: -28px;
    top: -29px;
    border-radius: 100px;
    background-color: ${({ theme }) => (theme.CardBlue?.color || '#6334e3')};
  }
  @media only screen and (max-width: 767px) and (min-width: 480px) {
    margin-top: -5px;
  }
  @media (max-width: 767px) {
    margin-top: -5px;
  }
  @media (max-width: 374px) {
    & .iconBlue {
     height: 35px;
     width: 35px;
     left: -5px;
     top: -24px;
    }
   }
`;

const BottomHeader = styled.div`
  border-bottom: 1px dotted ${({ theme }) => (theme.CardLine?.color || '#d0ff37')};
  margin-right: 0%;
  margin-left: 0%;
  width: inherit;
  margin-top: 8px;
`;

const Container3 = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: auto;
  padding-right: 18px;
  padding-left: 18px;
  margin-top:${({ containerstyle }) => (containerstyle.marginTop || '3rem')} !important;
  @media (max-width: 374px) {
    padding-left: ${({ containerstyle }) => (containerstyle.padding || '18px')};
    padding-right: ${({ containerstyle }) => (containerstyle.padding || '18px')};
  }
`;

const CardContentBox = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: auto;
  padding-right: 18px;
  padding-left: 18px;
  margin-top: ${props => props.marginTop || "3rem !important"};
`;


export { HeaderContainer, CardContentBox, CardRow, Row1, IconlessCardRow, Container2, Header, BottomHeader, Container3, HeaderBlue };

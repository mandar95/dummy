import styled from "styled-components";

const CardComponent = styled.div`
  border: none;
  border-radius: 0 35px 0 35px;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#ffffff'} !important;
  transition: all 0.3s ease 0s;
  box-shadow: ${({ theme }) => theme.dark ? '1px 1px 11px 0px #2e2e2e' : '1px 4px 26px 7px #dcdcdc'};
  width: auto;
  margin: 30px 10px 10px 10px;
  @media (max-width: 767px) {
    margin: 10px 10px;
  }
`;

const CardBody = styled(CardComponent)`
  padding: ${(props) => props.padding || "13.6px"};
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
  border-radius: 10px;
  background:green;
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
  color: ${({ color, theme }) => theme.dark ? '#fafafa' : color || "black"};
`;
// padding-right: 6px;
// padding-left: 6px;
// margin-top: -16px;
const Header = styled.div`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  letter-spacing: 0px;
  margin-left: 8px;
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
`;
// margin-left: 6px;
const HeaderBlue = styled.div`
  margin-top: -16px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  font-weight: 500;
  letter-spacing: 1px;
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
  margin-top: 3rem !important;
`;

const CardContentBox = styled.div`
  box-flex: 0;
  flex: 0 0 100%;
  max-width: 100%;
  width: 100%;
  min-height: auto;
  padding-right: 10px;
  padding-left: 10px;
  margin-top: ${(props) => props.marginTop || "3rem !important"};
`;

const SpanTag = styled.div`
  margin-left: -80px;
  margin-top: -80px;
  @media screen and (max-width: 992px) {
    margin-left: 40%;
    margin-top: -60px;
  }
  @media screen and (max-width: 991px) {
    margin-left: 39%;
    margin-top: -60px;
  }
  @media screen and (max-width: 930px) {
    margin-left: 38%;
    margin-top: -60px;
  }
  @media screen and (max-width: 913px) {
    margin-left: 37%;
    margin-top: -60px;
  }
  @media screen and (max-width: 878px) {
    margin-left: 36%;
    margin-top: -60px;
  }
  @media screen and (max-width: 860px) {
    margin-left: 35%;
    margin-top: -60px;
  }
  @media screen and (max-width: 807px) {
    margin-left: 34.5%;
    margin-top: -60px;
  }
  @media screen and (max-width: 780px) {
    margin-left: 34%;
    margin-top: -60px;
  }
  @media screen and (max-width: 769px) {
    margin-left: 34%;
    margin-top: -60px;
  }

  @media (max-width: 768px) {
    margin-left: 38%;
    margin-top: -60px;
  }

  @media screen and (max-width: 768px) {
    margin-left: 32%;
    margin-top: -60px;
  }
  @media screen and (max-width: 686px) {
    margin-left: 38%;
    margin-top: -60px;
  }
  @media screen and (max-width: 668px) {
    margin-left: 37%;
    margin-top: -60px;
  }
  @media screen and (max-width: 630px) {
    margin-left: 36%;
    margin-top: -60px;
  }
  @media screen and (max-width: 480px) {
    margin-left: 34%;
    margin-top: -60px;
  }
  @media screen and (max-width: 455px) {
    margin-left: 32.5%;
    margin-top: -60px;
  }
  @media screen and (max-width: 430px) {
    margin-left: 32.5%;
    margin-top: -60px;
  }
  @media screen and (max-width: 425px) {
    margin-left: 32%;
    margin-top: -60px;
  }
  @media screen and (max-width: 390px) {
    margin-left: 30%;
    margin-top: -60px;
  }
  @media screen and (max-width: 370px) {
    margin-left: 29%;
    margin-top: -60px;
  }
  @media screen and (max-width: 330px) {
    margin-left: 24%;
    margin-top: -60px;
  }
  @media screen and (max-width: 310px) {
    margin-left: 22%;
    margin-top: -60px;
  }
  @media screen and (max-width: 279px) {
    margin-left: 18%;
    margin-top: -60px;
  }
`;

export {
  HeaderContainer,
  CardContentBox,
  CardRow,
  Row1,
  IconlessCardRow,
  Container2,
  Header,
  BottomHeader,
  Container3,
  HeaderBlue,
  SpanTag,
};

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
  border-radius: 0 35px 0 35px;
  background-color: #fff;
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
  margin: 30px 15px 30px 30px;
  @media (max-width: 767px) {
    margin: 15px;
    box-shadow: 0;
  }
`;

const CardBody = styled(CardComponent)`
  padding: 1.6rem;
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
  border-radius: 0px;
`;

const IconlessCardRow = styled(CardBody)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  border-radius: 9px;
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
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  font-weight: 500;
  letter-spacing: 1px;
  text-align:center;
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
    background-color: #6334e3;
  }
  @media only screen and (max-width: 767px) and (min-width: 480px) {
    margin-top: -5px;
  }
  @media (max-width: 767px) {
    margin-top: -5px;
  }
`;

const InfoHeader = styled.div`
  margin-top: -16px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 24px;
  p {
    color: ${({ theme }) => theme?.Tab?.color};
  }
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
    background-color: ${({ theme }) => theme?.Tab?.color};
  }
  @media only screen and (max-width: 767px) and (min-width: 480px) {
    margin-top: -5px;
  }
  @media (max-width: 767px) {
    margin-top: -5px;
  }
`;

const HeaderBlue = styled.div`
  margin-top: -16px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  font-weight: 500;
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
    background-color: #6334e3;
  }
  @media only screen and (max-width: 767px) and (min-width: 480px) {
    margin-top: -5px;
  }
  @media (max-width: 767px) {
    margin-top: -5px;
  }
`;

const BottomHeader = styled.div`
  border-bottom: 1px dotted #d0ff37;
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
  position: relative;
  width: 100%;
  min-height: auto;
  padding-right: 18px;
  padding-left: 18px;
  margin-top: 3rem !important;
`;

// netowrk hospital
const Page = styled.div`
display:flex;
flex-direction:row;
@media only screen and (max-width: 600px) {
  flex-wrap:wrap;
}
`;
const DivContainer = styled.div`
  display: flex;
  max-width: 300px;
`;

const DivInput = styled.div`
  padding-top: 1px;
  padding-bottom: 1px;
`;
const InputBox = styled.div`
  margin-top: -22px;
  margin-bottom: 0;
  padding: 0;
  min-width:250px;
  overflow:hidden;
`;
const ImageBox = styled.div`

#img{border:7px inset grey;border-radius:5px;}

`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
`;

const CardSlot = styled.div`
display:flex;
flex-wrap:wrap;
flex-direction:column;
max-width:100%;
overflow-y: auto;
overflow-x: ${({ status }) => status ? 'auto' : 'hidden'};
max-height:104vh;
margin-top:30px;
@media only screen and (max-width: 992px) {
  margin-left:5px;
  width:100%; 
overflow-x:auto;
}
`;

const InputElement = styled.div`
padding-top: 1px;
padding-bottom: 1px;
margin-left:10px;
margin-right:10px;
`;

const Wrapper = styled.div`
width:100%;
display: ${({ status }) => status ? 'flex' : 'block'};
@media only screen and (max-width: 992px) {
  display:flex;
}
`;

const MapWrapper = styled.div`
margin-left:30px;
width:100%;
@media(max-width:767px){
  margin-left:0px;
  width:100%;
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
  InfoHeader,
  //network hospital
  DivContainer,
  CardSlot,
  Page,
  MapWrapper,
  //filters
  InputBox,
  DivInput,
  ImageBox,
  ButtonBox,
  InputElement,
  Wrapper

};

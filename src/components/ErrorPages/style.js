import styled from "styled-components";

const NotFoundContainer = styled.div`
  position: relative;
  height: 100vh;
`;

const NotFound = styled.div`
 position: absolute;
 left: 50%;
 top: 35%;
 max-width: 520px;
 width: 100%;
 line-height: 1.4;
 text-align: center;
 -webkit-transform: translate(-50%, -50%);
     -ms-transform: translate(-50%, -50%);
         transform: translate(-50%, -50%);

`;

const NotFound404 = styled.div`
 position: relative;
 height: 300px;
 margin: 0px auto 8px;
 z-index: -1;
 @media only screen and (max-width: 480px) {
     height: 148px;
     margin: 0px auto 10px;
   }
`;

const H1Tag = styled.h1`
 font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(236px + ${fontSize - 92}%)` : '236px'};
 margin: 0px;
 color: ${({ theme }) => theme?.Tab?.color};
 text-transform: uppercase;
 position: absolute;
 left: 50%;
 top: 50%;
 -webkit-transform: translate(-50%, -50%);
     -ms-transform: translate(-50%, -50%);
         transform: translate(-50%, -50%);
         @media only screen and (max-width: 767px) {
          font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(148px + ${fontSize - 92}%)` : '148px'};   
           }
         @media only screen and (max-width: 480px) {
          font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(86px + ${fontSize - 92}%)` : '86px'};   
           }
`;

const H2Tag = styled.h2`
 font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(28px + ${fontSize - 92}%)` : '28px'};
 text-transform: uppercase;
 color: #211b19;
 padding: 10px 5px;
 margin: auto;
 display: inline-block;
 position: absolute;
 bottom: 0px;
 left: 0;
 right: 0;
 @media only screen and (max-width: 480px) {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'}; 
   }
`;

const AnchorTag = styled.a`
 display: inline-block;
 text-decoration: none;
 color: #fff;
 text-transform: uppercase;
 padding: 13px 23px;
 background:  ${({ theme }) => theme?.Tab?.color};
 font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
 -webkit-transition: 0.2s all;
 transition: 0.2s all;
 &:hover {
  color:  ${({ theme }) => theme?.Tab?.color};
  background: #211b19;
  }
@media only screen and (max-width: 480px) {
  padding: 7px 15px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
}
`;

export { NotFoundContainer, NotFound, NotFound404, H1Tag, H2Tag, AnchorTag }

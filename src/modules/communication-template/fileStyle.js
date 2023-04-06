import styled from 'styled-components';

const Wrapper = styled.div`
  border-radius: 5px;
  width: 58%;
  margin: auto;
  &&.error {
    border: 1px solid #FF0000;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  line-height: 20px;
  flex-wrap: no-wrap;
  /* max-width: 40px; */
`

const AttachFileDiv = styled.div`
  max-width: 60px;
  flex-grow: 1;
  height: 35px;
  background-color: #d0ff37;
//   border-radius: 50%;
  /* display: inline; */
  float: right;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

 input{
  width: 100%;
  height: 100%;
  cursor: pointer;
}

  i {
  cursor: pointer;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(28px + ${fontSize - 92}%)` : '28px'};
  position: absolute;
//   margin: 8px;
//   transform: rotate(27deg);
}
`

const AttachDesc = styled.div`
  flex-grow: 1;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};

 p {
  margin-bottom: -5px;
  margin-top: 0px;
  
  }

 b {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(9px + ${fontSize - 92}%)` : '9px'};
  letter-spacing: 1px;
  color: red;
  }
`

const AttachDoc = styled.div`

  border: 1px dashed #deff;
  border-radius: 5px;
  background: #fff;
  background: url(/assets/images/bg-3.png) no-repeat right;
  word-break: break-word;

  margin-top: 7px;
  display: flex;
  padding: 5px 5px;


 b {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
  letter-spacing: 1px;
 }
 span {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
  letter-spacing: 1px;
  
  color: grey;
 }
`
const Img = styled.img`
  height: 8px;
`

export {
  Wrapper,
  FlexContainer,
  AttachFileDiv,
  AttachDesc,
  AttachDoc,
  Img
}

import styled from 'styled-components';

const Wrapper = styled.div`
  border-radius: 5px;
  &&.error {
    border: 1px solid #FF0000;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  cursor: pointer;
  /* max-width: 40px; */
`

const AttachFileDiv = styled.div`
  max-width: 40px;
  flex-grow: 1;
  height: 40px;
  background-color: #d0ff37;
  border-radius: 50%;
  /* display: inline; */
  float: right;
  margin-right: 30px;

 input{
  width: 100%;
  height: 100%;
  cursor: pointer;
}

  i {
  cursor: pointer;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(24px + ${fontSize - 92}%)` : '24px'};
  position: absolute;
  margin: 8px;
  transform: rotate(27deg);
}
`

const AttachDesc = styled.div`
  flex-grow: 1;

 p {
  margin-bottom: -5px;
  margin-top: 0px;
  font-weight: 600;
  }

 b {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(9px + ${fontSize - 92}%)` : '9px'};
  letter-spacing: 1px;
  color: red;
  }
`

const AttachDoc = styled.div`

  padding: 21px 10px;
  border: 1px dashed #deff;
  border-radius: 8px;
  background: #fff;
  background: url(/assets/images/bg-3.png) no-repeat right;
  margin-top: 20px;
  word-break: break-word;


 b {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  letter-spacing: 1px;
 }
 span {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
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

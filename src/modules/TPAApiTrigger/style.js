import styled from 'styled-components';

const PageContainer = styled.div`
height:100%;
width:100%;
/* background: #f1f1f1; */
`

const CardContainer = styled.div`
display:flex;
flex-wrap:wrap;
@media(max-width:600px){
width:100%;
}
`

const DivContainer = styled.div`
display:flex;
flex-direction:row;
flex-wrap:wrap;
padding-bottom:45px;
border-bottom: 1px dotted #d0ff37;
align-items:center;
`
const DivButton = styled.div`
display:flex;
justify-content:flex-end;
padding-top:15px;
`

const DivInput = styled.div`
margin:10px;
padding:0;
`
const DivSelect = styled.div`
margin:10px;
padding:0;
`
export {CardContainer,DivContainer,DivButton,PageContainer,DivInput,DivSelect}

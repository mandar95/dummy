import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction:column;
  width:'100%';
`;

const TableContainer = styled.div `
display:flex;
width:'100%';
`
;

//filters
const TopContainer = styled.div `
display:flex;
max-width:1300px;
flex-wrap:wrap;
@media (max-width:767px) {
  justify-content:center;
}
`
;

const FilterContainer = styled.div`
  display: flex;
`;

const ContentBox = styled.div `
display: flex;
margin-left:20px;
margin-right:10px;
margin-top:-20px;
@media (max-width:767px) {

}
`
;
const DivSelect = styled.div `

`
const ButtonContainer = styled.div `
display:flex;
justify-content:flex-end;
flex-wrap:wrap;
@media (max-width:600px) {
  justify-content:flex-end;
  flex-wrap:nowrap;
}
`
;
export { Container,TableContainer,TopContainer, FilterContainer, ContentBox,DivSelect,ButtonContainer };

import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import { RFQButton } from '../../../components';
import { mergeRelation } from '../../RFQ/plan-configuration/helper';

// styling

export const Wrapper = styled.div`
${RFQButton}{
  background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'} !important;
}
.benefit {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 25px;
  .table-responsive{
    margin: 0;
    border-radius: 20px;
  }
}
.accordian-btn-icon{
  color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  margin-left: -12px;
  padding: 2px 4px;
  border: 1px solid ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  border-radius: 4px;
}
.accordian-collapse{
  width: 100%;
  padding-top: 15px;
  background: white;
  border-top: 1px solid ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.image_final{
  img{
      height: 38vh;
      max-width: 90vw;
    }
}
`

export const HeaderDiv = styled.div`
  display:flex;
  justify-content: space-between;
  margin-top: -12px;
  margin-bottom: 15px;
  .icon {
    background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
    border-radius: 50%;
    height: 36px;
    width: 36px;
    margin: -1px 10px 0 -30px;
    i{
      color: white;
      padding: 9px 11px;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
    }
    .ti{
      display: inline-block;
      padding: 9px 10px;
    }
  }
  .title {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
    margin: 0;
    
  }
  .secondary-title {
    margin: 0;
    color: #5b5b5b;
  }
`


export const TitleDiv = styled.div`
  display:flex;
  justify-content: space-between;
  margin-top: -12px;
  margin-bottom: -15px;
  .icon {
    background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
    border-radius: 50%;
    height: 30px;
    width: 30px;
    margin: -5px 10px 1px -5px;
    i{
      color: white;
      padding: 8px 10px;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    }
    .ti{
      display: inline-block;
      padding: 8px;
    }
  }
  .title {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
    color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
    margin: 0;
    
  }
  .secondary-title {
    margin: 0;
    color: #5b5b5b;
  }
`

export const StyledTable = styled(Table)`
margin-bottom: 0;
thead {
  height: 50px;
  border-radius: 20px;
  tr {
    border-radius: 20px;
    color: #ffffff;
    background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  }
  th {
    vertical-align: middle;
    border: 0;
    &:first-child{ border-radius: 20px 0 0 20px;}
    &:last-child{ border-radius: 0 20px 20px 0;}
    min-width: 158px;
  }
  .add_button {
    min-width: auto;
  }
}
td{
  border-top: 0;
}
td:nth-child(1),th:nth-child(1){
  border-right: solid 1px #ccc;
}

td:first-child{
  width: 300px;
}
.icon{
    margin-top: 0.5rem;
    i{
      cursor: pointer;
      background: #F0F4F7;
      padding: 10px;
      border-radius: 50%;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
      margin: auto 0.3rem;
    }
  }
${({ noAction }) => !noAction ? `
td:nth-child(2),th:nth-child(4){
  border-right: solid 1px #ccc;
}
`: ''}
${({ headBorder }) => headBorder ? `
td, th {
  border-right: solid 1px #ccc !important;
}
td:last-child,th:last-child{
  border-right: 0 !important;
}
`: ''}
`

export const sortRelation = (relations) => {
  let storeRelation = []
  for (let relation of relations) {
    if ([4, 6, 8].includes(relation)) {

    } else if ([3, 5, 7].includes(relation)) {
      storeRelation.push({ id: relation, label: mergeRelation[relation], value: relation })
    } else {
      storeRelation.push({ id: relation, label: mergeRelation[relation], value: relation })
    }
  }
  return storeRelation
}

export const refillRelations = (ages) => {
  let storeRelation = []
  for (let age of ages) {
    if ([4, 6, 8].includes(Number(age?.id))) {

    } else if ([3, 5, 7].includes(Number(age?.id))) {
      storeRelation.push(age?.id)
      storeRelation.push(Number(age?.id) + 1)
    } else {
      storeRelation.push(age?.id)
    }
  }
  return storeRelation
}

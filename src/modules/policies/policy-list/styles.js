import styled, { createGlobalStyle } from "styled-components";
import { Card } from "../../../components";

export const PolicyListWrapper = styled.div`
    margin: 40px;
`;

export const FilterWrapper = styled.div`
    padding: 20px;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const StyledCard = styled(Card)`
    margin: 30px;
    @media (max-width: 767px) {
        margin: 20px 10px;
    }
    
`;

export const TableWrapper = styled.div`
    width: 100%;
`;

export const GlobalStyle = createGlobalStyle`
.swal-modal{
    width: 490px;
}
`

import styled from "styled-components";

export const AccordionWrapper = styled.div`
    .card {
        border: none;
        box-shadow: 0 1rem 3rem rgba(0,0,0,.175);
        ${({ theme }) => theme.dark ? 'background: #363537' : ''}
    }

    .card-header,
    .card-body {
        padding: 10px;
    }

    .form-group-input {
        min-width: auto;
    }

    .row {
        padding: 0 4px;
    }

    .col {
        padding: 0;
    }

    .span-label {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'} !important;
        background: #fff;
        padding: 2px 4px;
        
        letter-spacing: 1px;
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
        color: #606060;
    }

    p {
        padding-left: 5px;
        padding-top: 2px;
        margin-top: 4px;
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
        letter-spacing: 0.3px;
        color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
        
    }

    .form-group {
        width: 100%;
        min-width: auto;
    }
    .form-group-input {
        margin-right: 12px;
        margin-left: 14px;
        margin-top: 10px;
    }
`;

export const Heading = styled.p`
    padding: 0;
    margin: 0;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
    padding-left: 5px;
    letter-spacing: 0.3px;
    margin-top: 4px;
    color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
`;

export const MarginWrapper = styled.div`
    width: 100%;
    display: flex;
`;

export const AnchorTag = styled.a`
display:flex;
padding-top:5px;
justify-content:flex-end;
`;

export const Div = styled.div`
display: grid;
width: 89%;
margin-left: 40px;

@media (max-width: 720px) {
  width: 88.5%;
}

@media (max-width: 676px) {
  width: 83%;
}

@media (max-width: 480px) {
  width: 80%;
}

@media (max-width: 480px) {
  width: 80%;
}

@media (max-width: 450px) {
  width: 80%;
}
@media (max-width: 430px) {
  width: 70%;
}
`
export const TableDiv = styled.div`
.table-responsive{
  margin: 0; 
}
.table td, .table th{
  vertical-align: middle;
}
`

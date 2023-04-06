import styled from "styled-components";

export const Wrapper = styled.div`
`;

export const SmallInput = styled.div`
.form-group{min-width: 150px}`

export const Title = styled.div`
    margin-bottom: 3rem;
    h4 {
        color: ${({ theme }) => theme.dark ? '#ffffff' : '#000000'};
        text-align: center;
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(19px + ${fontSize - 92}%)` : '19px'};
        
        letter-spacing: 1px;
        z-index: 1;
        span {
            height: 15px;
            width: 15px;
            background-color: #f2c9fb;
            border-radius: 50%;
            display: inline-block;
            margin-bottom: 5px;
            margin-right: -9px;
            opacity: 0.7;
        }
    }
`;

export const FormWrapper = styled.div``;

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
        margin: 8px 20px 8px 8px;
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
`;

export const InputWrapper = styled.div`
    padding-bottom: 10px;
    .custom-control-label {
        &:before {
            border-radius: 100%;
            height: 20px;
            width: 20px;
            background-color: rgb(228,228,228);
        }
    }
    .custom-control-input:checked~.custom-control-label::before {
        border-color: #F349CE;
        background-color: #F349CE;
        height: 20px;
        width: 20px;
    }

    .custom-control-input:checked~.custom-control-label::after {
        height: 20px;
        width: 20px;
    }

    .custom-control-label {
        padding-left: 5px;
        padding-top: 2px;
        margin-top: 4px;
    }

    .heading {
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
        letter-spacing: 0.3px;
        color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
        
    }
`;

export const ChildWrapper = styled.div`
    border-top: 2px dashed #F349CE;
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

export const AgeWrapper = styled.div`
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

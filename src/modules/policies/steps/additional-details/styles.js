import styled from "styled-components";

export const Wrapper = styled.div`
    margin-left: 20px;
    margin-right: 20px;
`;

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

export const FormWrapper = styled.div`
    align-items: center;
    width: 100%;
`;

export const AdditionalCoverWrapper = styled.div`
    min-height: 100px;
`;

export const AdditionalInformationWrapper = styled.div`
    margin-top: 20px;
    min-height: 100px;
`;

export const Header = styled.div`
    border-bottom: 1px solid #ECEFF1;
    h6 {
        
    }
`;

export const AddBenefits = styled.div``;

export const InputWrapper = styled.div`
    padding-left: 40px;
    margin-bottom: 12px;
    margin-top: 0;

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
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
        padding-left: 5px;
        padding-top: 2px;
        letter-spacing: 0.3px;
        margin-top: 4px;
        color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
        

        padding-left: 8px;
        padding-top: 3px;
        
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    }
`;

export const BenefitList = styled.div`
    margin: 10px 24px 10px 0;
    border: 1px dashed #deff;
    padding: 11px;
    background: #efefef;
    border-radius: 5px;
    width: 100%;
`;

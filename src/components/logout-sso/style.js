import styled from "styled-components";

const Container = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
align-items: center;
height: 80vh;
& h1{
    letter-spacing: 1px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(50px + ${fontSize - 92}%)` : '50px'};
    font-family: sans-serif;
    margin-top: -5px;
}
& i:nth-of-type(1){
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(50px + ${fontSize - 92}%)` : '50px'};
    color: ${({ theme }) => (theme.Tab?.color || "#13ff01")};
    margin-top: -27px;
}
& i:nth-of-type(2){
    margin-top: -40px;
    color: white;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(30px + ${fontSize - 92}%)` : '30px'};
}
& span{
    margin-top: 35px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(21px + ${fontSize - 92}%)` : '21px'};
    font-family: sans-serif;
    text-align: center;
}

@media (max-width: 767px) {
    & h1{
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(30px + ${fontSize - 92}%)` : '30px'};
    }
    & i:nth-of-type(1){
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(35px + ${fontSize - 92}%)` : '35px'};
        margin-top: -15px;
    }
    & i:nth-of-type(2){
        margin-top: -28px;
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    }
    & span {
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
    }
  }
`

export { Container }

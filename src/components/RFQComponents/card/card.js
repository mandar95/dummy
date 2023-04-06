import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    background: #005aff12;
    width: auto;
    max-width: 300px;
    border-radius: 30px;
    padding: 45px 20px;
    /* border: 3px solid white; */
    height: fit-content;
    text-align: center;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const TitleDiv = styled.div`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.4rem + ${fontSize - 92}%)` : '1.4rem'};
`;

const ContentDiv = styled.div`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13.5px + ${fontSize - 92}%)` : '13.5px'};
    color: #2a3675b3;
    padding-top: 5px;
    line-height: 19px;
`
const Img = styled.img`
    height: 70px;
    margin: 0px 0px 31px
`


const RFQcard = ({ imgSrc, title, content, cardStyle }) => {
    return (
        <Container style={{ cardStyle }}>
            <Img src={imgSrc}></Img>
            <TitleDiv><label>{title}</label></TitleDiv>
            <ContentDiv><p>{content}</p></ContentDiv>
        </Container>
    )
}

export default RFQcard;

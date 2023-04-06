import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
position: relative;
display: flex;
flex-direction: ${({ flexDirection }) => flexDirection || 'column'};
align-items: center;
padding: 10px;
width: ${({ width }) => width || '180px'};
height: auto;
text-align: center;
margin: ${({ margin }) => margin || '10px'};
border-radius: 15px;
background-color: #ffffff;
transition: all 0.3s ease 0s;
box-shadow: 1px 5px 14px 0px rgb(0 0 0 / 10%);
@media (max-width: 768px) {
    margin: 0 auto 4rem;
}
`;

const Container2 = styled(Container)`
@media (max-width: 768px) {
    margin: 0 auto 1rem;
    width: 100%;
}
`
const ImgDiv = styled.div`
    height: ${({ size }) => size || '85px'};
    width: ${({ size }) => size || '85px'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: ${({ top }) => top || '-47px'};
    margin-bottom: ${({ marginBottom }) => marginBottom || '-25px'};
`

const Img = styled.img`
    height: ${({ size }) => size || '85px'};
    width: ${({ size }) => size || '85px'};
    margin: -4px 0px 0px 0px;
`
const MemberCountDiv = styled.div`
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '1.8rem'} + ${theme.fontSize - 92}%)` : (fontSize || '1.8rem')};
text-align: start;
`
const MemberTypeDiv = styled.div`
margin-top: 4px;
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '1.5rem'} + ${theme.fontSize - 92}%)` : (fontSize || '1.5rem')};
text-align: start;
`

const RFQFamilyCard = ({ imgSrc, memberCount, memeberType, margin }) => {
    return (
        <Container margin={margin}>
            <ImgDiv>
                <Img src={imgSrc}></Img>
            </ImgDiv>
            <MemberCountDiv>{memberCount || 0}</MemberCountDiv>
            <MemberTypeDiv>{memeberType || 'member type'}</MemberTypeDiv>
        </Container >
    )
}

export default RFQFamilyCard;

export const RFQRelationCard = ({ imgSrc, memberCount, memeberType, margin }) => {
    return (
        <Container2 width='250px' flexDirection={'row'} margin={margin}>
            <ImgDiv size="40px" top='0' marginBottom='0'>
                <Img size="40px" src={imgSrc}></Img>
            </ImgDiv>
            <div className='ml-4'>
                <MemberTypeDiv fontSize='1rem'>{memeberType || 'member type'}</MemberTypeDiv>
                <MemberCountDiv fontSize='1rem'>{memberCount || 0}</MemberCountDiv>
            </div>
        </Container2 >
    )
}

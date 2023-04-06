import React from "react";
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap'

const danger = "#bf1650";
const colorsecondary = "#287692";

const Container = styled.div`
padding: 15px 20px;
text-align: left;
margin-bottom:10px;
border: 1px solid whitesmoke;
border-radius: 20px;
background-color: rgb(255, 255, 255);
transition: all 0.3s ease 0s;
box-shadow: rgb(0 0 0 / 10%) 0px 10px 15px 6px, rgb(0 0 0 / 5%) 0px 4px 6px -2px;
// &:focus {
//     outline: none;
//     outline: none;
//     border: 1px solid #00ff1b !important;
//     border-radius: 12px;
// }
`;

const Label = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
margin-bottom:5px !important;
`

const Input = styled.input`
border: 1px solid rgb(210,211,212);
padding: 6px;
height: 45px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};
text-align: center;
border-radius:10px;
border: ${(props) => {
        if (props.lg && props.error) return "2px";
        else return "1px"
    }}
    solid
    ${(props) => {
        if (props.error) return danger;
        else return "rgb(210, 211, 212)"
    }};
    &:focus {
        outline: none;
        border: 1px solid
          ${(props) => (props.error ? danger : colorsecondary)};
    }
    &:focus ${Container} {
        border: 1px solid #00ff3e !important;
    }
`
const ImgDiv = styled.div`
    // background: #a0d0cd45;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Img = styled.img`
    height: 50px;
    width: 50px;
    margin: -4px 0px 0px 0px;
`

const RFQfamilyMemeberCard = ({
    name,
    value,
    type,
    placeholder,
    inputRef,
    inputLabel,
    autoComplete,
    imgSrc,
    isRequired,
    maxLength,
    ...otherProps }) => {
    return (
        <Container>
            <Label>{inputLabel || "Your label"}
                {isRequired
                    ? <sup> <img style={{ height: '10px' }} alt="important" src='/assets/images/inputs/important.png' /> </sup>
                    : null}
            </Label>
            <Row>
                <Col md={6} lg={6} xl={6} sm={6}>
                    <ImgDiv>
                        <Img src={imgSrc}></Img>
                    </ImgDiv>
                </Col>
                <Col md={6} lg={6} xl={6} sm={6}>
                    <Input
                        name={name}
                        id={name}
                        type={type}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        onInput
                        ref={inputRef}
                        {...otherProps}
                    ></Input>
                </Col>
            </Row>
        </Container>
    )
}

export default RFQfamilyMemeberCard;

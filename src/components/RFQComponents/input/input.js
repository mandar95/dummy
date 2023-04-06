import React from "react";
import styled from 'styled-components';
//import { Row } from 'react-bootstrap'

const danger = "#bf1650";
const colorsecondary = "#287692";

const Container = styled.div`
padding: 15px;
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
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
margin-bottom:5px !important;
`

const Input = styled.input`
text-align: left;
padding: 5px;
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
    // &:focus ${Container} {
    //     border: 1px solid #00ff3e !important;
    // }
`

const RFQinput = ({ name, value, type, placeholder, inputRef, inputLabel, autoComplete, ...otherProps }) => {
    return (
        <Container>
            <Label>{inputLabel || "Your label"}</Label>
            <Input
                name={name}
                id={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                ref={inputRef}
                {...otherProps}
            ></Input>
        </Container>
    )
}

export default RFQinput;

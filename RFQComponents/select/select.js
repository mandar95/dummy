import React from "react";
import styled from 'styled-components';
//import { Row } from 'react-bootstrap'

import CustomDropDown from '../dropdown/CustomDropDown'


const Container = styled.div`
padding: 15px;
text-align: left;
margin-bottom:10px;
width:100%;
border: 1px solid whitesmoke;
border-radius: 12px;
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
`

const RFQselect = (props) => {

    return (
        <Container>
            <Label>{props.inputLabel || "Your label"}</Label>
            <CustomDropDown
                {...props}
            />
        </Container>
    )
}

export default RFQselect;

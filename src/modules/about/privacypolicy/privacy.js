/*
 * @desc: Privacy Policy
 * @server: Palm
 */

import React from "react";
import {
    Navbar,
    Row
} from "react-bootstrap";
import { Link, } from "react-router-dom";
import styled from 'styled-components';
import { Footer } from "../../../components";
import { CommonPrivacyPolicy } from "./common-privacy-policy";

const Container = styled.div`
padding: 10px 230px;
`
const TitleDiv = styled.h1`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(35px + ${fontSize - 92}%)` : '35px'};

color: #464646;
letter-spacing: 1px;
`

export const BoldDiv = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
letter-spacing: 1px;
margin-bottom: 15px;
`
export const ContentDiv = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
`

const Content = [
    { title: 'Security', content: `Your Information is private and confidential and shall be held only with ${process.env.REACT_APP_BROKER_NAME} and its group companies/affiliates.` },
    { title: 'Privacy', content: `Your inputs/queries as a registered user are required to serve you better and shall not be shared with anyone without your consent. However, we may from time to time need to disclose your personal data to Insurance Companies, TPA’s, Vendors etc of ${process.env.REACT_APP_BROKER_NAME} and its group companies /affiliates to enable processing of transactions or communications with you. However it shall be on the basis that the all these Insurance Companies, TPA’s, Vendors etc are required to keep the information confidential and will not use the information for any other purpose other than to carry out the services they are performing for ${process.env.REACT_APP_BROKER_NAME} and its group companies /affiliates.` },
    { title: 'Exceptions', content: `While we will not voluntarily disclose your information with us, however we may do so if we are required by a Court Order, by Government Authorities, by Law Enforcement Authorities or by other legal processes or wherever it becomes necessary, in order to protect the rights or property of ${process.env.REACT_APP_BROKER_NAME} and its group companies /affiliates.` },
    { title: 'Changes to this Privacy Policy', content: `${process.env.REACT_APP_BROKER_NAME} reserves the right to change or update this Privacy Policy or any other of our Policies/Practices at any time. The same shall be notified to the users of this website by posting such changes or updated Private Policy on the page. Any changes or updates will be effective immediately upon posting to this web site. We may, if considered necessary, elect to notify you of changes or updates to our Policy by additional means such as posting a notice on the front page of our web site or sending you an e-mail.` },
]

const BROKER_NAME = process.env.REACT_APP_BROKER_NAME

const PrivacyPolicy = () => {
    return (<div style={{ width: '100%' }}>
        <Navbar className="shadow pt-3 pb-3" bg='white' expand="md" variant="light" sticky="top">
            <Link to={'/broker'}>
                <Navbar.Brand href="#">
                    <img className="mr-1" src={'/assets/images/logo.png'} alt='logo' height="60px" />
                </Navbar.Brand>
            </Link>
        </Navbar>
        <Container>
            <Row className="justify-content-center">
                <TitleDiv>Privacy Policy</TitleDiv>
            </Row>
            {BROKER_NAME === 'Palm Insurance Brokers Pvt. Ltd.' && Content.map((item, i) => {
                return (
                    <Row key={"asdasd" + i} style={{ display: 'block', marginBottom: '25px' }}>
                        <BoldDiv>{item.title}</BoldDiv>
                        <ContentDiv>{item.content}</ContentDiv>
                    </Row>
                )
            })}
            {BROKER_NAME === 'K.M. Dastur Reinsurance Brokers Pvt. Ltd.' && <CommonPrivacyPolicy BROKER_NAME={BROKER_NAME} />}
            {BROKER_NAME === 'Ace Insurance Brokers (P) Limited.' && <CommonPrivacyPolicy BROKER_NAME={BROKER_NAME} />}


        </Container>
        <Footer />
    </div>)
}

export default PrivacyPolicy;

import React, { useEffect } from "react";
import { Container } from "./style";
import SecureLS from "secure-ls";
import { useLocation } from "react-router";

const Icons = ["fa-circle", "fa-check"]
const CreateIcone = (icon, index) => {
    return (
        <i key={index + 'icon'} className={`fa fa-solid ${icon}`}></i>
    )
}

const ls = new SecureLS();

const LogoutSSO = () => {

    const location = useLocation();

    useEffect(() => {
        ls.remove("isSSO");
    }, [])

    return (
        <Container>
            <img src='/assets/images/sammy-remote-work.png'
                height='initial'
                style={{ maxWidth: '360px',width:'-webkit-fill-available' }}
                alt='Thank You' />
            <h1>THANK YOU !</h1>
            {Icons.map((item, index) => CreateIcone(item, index))}
            {location.pathname === 'logout' ? <span>You have been successfully Logged Out.</span> : <span>You have been redirected to Mobile Application.</span>}

            <span className="mt-0">To login once again use SSO Link Only. You are requested to close this page for security reasons.</span>
        </Container>
    );
};

export default LogoutSSO;

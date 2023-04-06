import React, { useState } from "react";
import {
  Navbar,
  Nav,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { useMediaPredicate } from "react-media-hook";
import { Logo, Vline } from "../../header/header";
// import AnchorLink from 'react-anchor-link-smooth-scroll';
// import GetDemo from '../get-demo/get-demo';


export const NavBar = ({ noLink = false, logo = '/assets/images/logo.png', second_logo }) => {

  const history = useHistory();
  const biggerThan668 = useMediaPredicate("(min-width: 668px)");
  const [focus, setFocus] = useState((history.location.pathname === '/employer') ? false : true)
  return (
    <div style={{ width: '100%' }}>
      <Navbar className="shadow pt-3 pb-3" bg='white' expand="md" variant="light" sticky="top">
        {second_logo ? <Link to={'/home'} style={{ width: '0' }} className='my-auto'>
          <div className='d-flex align-items-center'>
            <Logo alt='logo'
              src={'/assets/images/logo.png'} />
            {!!(second_logo) && <>
              <Vline />
              <Logo brand={second_logo}
                src={(second_logo) || '/assets/images/logo.png'}
                alt='logo' />
            </>}
          </div>
        </Link> :
          <>
            <Link to={'/broker'}>
              <Navbar.Brand>
                {(noLink && biggerThan668) ?
                  !!logo && <img className="mr-1" src={logo} alt='logo' height="50px" />
                  :
                  <img className="mr-1" src={'/assets/images/logo.png'} alt='logo' height="50px" />}
              </Navbar.Brand>
            </Link>
            {!noLink && <>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                <Nav className="d-flex justify-content-end align-items-center text-decoration-none">
                  <Linked active={focus ? true : false}
                    onClick={() => { setFocus(true); history.push('/broker') }}>
                    {/* abhi changes Insurer */}
                    Broker
                  </Linked>
                  <Linked active={!focus ? true : false}
                    onClick={() => { setFocus(false); history.push('/employer') }}>Employer</Linked>
                  {/* <Linked as={AnchorLink} href="#plans_carousel">Pricing</Linked> */}
                  {/* <GetDemo /> */}
                </Nav>
              </Navbar.Collapse>
            </>}
          </>}
      </Navbar>
    </div>
  );
}

const Linked = styled.span`
align-self: center;
padding: 5px 0;
margin: 5px 20px;
color: #a552cf;
text-decoration: none !important;
cursor: pointer;
border-bottom:${({ active }) => (active ? "2px double #ffda01" : "")};
&:hover{
  border-bottom: 1px double;
  color: #a552cf !important;
}
&:active{
  border-bottom: 1px double;
}`

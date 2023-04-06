import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from 'react-router-dom';

import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import Profile from "./profile/profile";
import { DrawerContext } from '../../context/sidebar.context.api'
import { useSelector } from "react-redux";
import { useMediaPredicate } from "react-media-hook";


const Wrapper = styled.div`
    padding: 15px 30px;
    background: ${({ theme }) => theme.dark ? '#2e2e2e' : '#fff'};
    border-bottom: 1px solid ${({ theme }) => (theme.PrimaryColors?.color1 || '#d1a3d6')};
    @media (max-width: 404px) {
        padding: 15px;
    }
`;

const NavButton = styled.div`
    margin-right: 15px;
    padding-top: 10px;
    cursor: pointer;
    float: left;
    width: auto;
    & > span {
        display: block;
        height: 3px;
        margin: 4px 0;
        border-radius: 15px;
    }
    ${({ another, theme }) => another ? `
    position: fixed;
    top: 0;
    border-radius: 1px 4px 100px 12px;
    background-color: ${(theme.dark ? '#f7a9ff' : theme.PrimaryColors?.color1 || '#0581FC')};
    padding: 5px 15px 14px 8px;
    z-index: 99999;
    left: 0;`: ''}
`;

const ShortSpan = styled.span`
    background: ${({ theme, invert }) => invert ? '#ffffff' : (theme.dark ? '#f7a9ff' : theme.PrimaryColors?.color1 || '#0581FC')};
    width: 20px;
`;

export const Vline = styled.div`
    /* border-left: 1px solid ${({ theme, invert }) => invert ? '#ffffff' : (theme.dark ? '#f7a9ff' : theme.PrimaryColors?.color1 || '#0581FC')};
    height: 40px;
    margin: 5px; */
    padding: 1px;
    height: 46px;
    margin: 0 5px;
    background-color: ${({ theme, invert }) => invert ? '#ffffff' : (theme.dark ? '#f7a9ff' : theme.PrimaryColors?.color1 || '#0581FC')};
`;

const LongSpan = styled.span`
    background: ${({ theme, invert }) => invert ? '#ffffff' : (theme.dark ? '#f7a9ff' : theme.PrimaryColors?.color1 || '#0581FC')};
    width: 30px;
    transform: ${({ value }) => {
    switch (value) {
      case 'top': return 'rotate(37deg)'
      case 'bottom': return 'rotate(-38deg)'
      default: return 'rotate(0deg)'
    }
  }};
    transition: all 0.5s ease;
`;




export const Logo = styled.img`
  height: ${({ brand }) => brand ? '46px' : '32px'};
  margin-top: ${({ brand }) => brand ? '0' : '5px'};
  max-width: ${({ brand }) => brand ? 'auto' : '151px'};
  @media (max-width: 500px) {
    /* zoom: 0.8;
    -moz-transform: scale(0.8); */
    transform: scale(0.8);
    transform-origin: left;
  }
  @media (max-width: 404px) {
    /* zoom: 0.7;
    -moz-transform: scale(0.7); */
    transform: scale(0.7);
    transform-origin: left;
  }
  @media (max-width: 355px) {
    /* zoom: 0.5;
    -moz-transform: scale(0.5); */
    transform: scale(0.5);
    transform-origin: left;
  }`

const Header = ({ atTop, isMain }) => {
  const { currentUser, userType } = useSelector(state => state.login);
  const { status, openStatus } = useContext(DrawerContext);
  const biggerThan668 = useMediaPredicate("(min-width: 668px)");
  const history = useHistory();

  const _renderHeader = () => {
    return (
      <Wrapper>
        <Row className="justify-content-between align-items-center flex-nowrap">
          <Col xl={5} lg={5} md={6} sm={6} className="clearfix w-auto d-flex">
            {!status && <NavButton onClick={() => openStatus()}>
              <LongSpan value={status ? 'top' : ''} />
              {!status && <ShortSpan />}
              <LongSpan value={status ? 'bottom' : ''} />
            </NavButton>}
            <Link to={'/home'} style={{ width: '0' }} className='my-auto'>
              <div className='d-flex align-items-center'>
                {(['Employer', 'Employee'].includes(userType)) ? <>
                  <Logo alt='logo'
                    src={'/assets/images/logo.png'} />
                  {!!(biggerThan668 && currentUser?.branding) && <>
                    <Vline />
                    <Logo brand={biggerThan668 && currentUser?.branding}
                      src={(biggerThan668 && currentUser?.branding) || '/assets/images/logo.png'}
                      alt='logo' />
                  </>}</> : <Logo brand={biggerThan668 && currentUser?.branding}
                    src={(biggerThan668 && currentUser?.branding) || '/assets/images/logo.png'}
                    alt='logo' />}
              </div>
            </Link>

            {!!(atTop && !status) && <NavButton another onClick={() => openStatus()}>
              <LongSpan invert />
              <ShortSpan invert />
              <LongSpan invert />
            </NavButton>}

            <BackButton status={status} atTop={atTop}>
              <button onClick={() => history.goBack()}>
                <i className="fa fa-arrow-left" />

              </button>
            </BackButton>
          </Col>
          <Col xl={7} lg={7} md={6} sm={6} className="clearfix w-auto">
            <Profile isMain={isMain} />
          </Col>
        </Row>
      </Wrapper>
    );
  };

  return _renderHeader();
};


Header.propTypes = {
  openDrawer: PropTypes.func.isRequired
};

export default Header;

export const BackButton = styled.li`

  @media (min-width: 1901px){
    display: none;
  }

  position: fixed;
  transition: all 50ms linear;
  top: ${({ atTop, status }) => (atTop ? (status ? '15px' : '55px') : '95px')};
  border-radius: 0 150px 150px 0;
  background-color: ${({ theme }) => (theme.dark ? '#f7a9ff' : theme?.Tab?.color || '#0581FC')};
  padding: 0;
  z-index: ${({ status }) => (status ? '1' : '99999')};
  left: ${({ status }) => (status ? '240px' : '0')};
  display: inline-block;
  margin-right: -4px;
  margin-left: -38px;
  clip-path: polygon(63% 0, 100% 0, 100% 100%, 63% 100%);
  i {
      display: none;
    }
  &:hover{
    clip-path: none;
    margin-left: 0;
    i {
      display: inline-block;
    }
  }


button {
  display: block;
	cursor: pointer;
  text-decoration: none;
  background-color: #f7f7f7;
  background-image: -webkit-gradient(linear, left top, left bottom, from(#f7f7f7), to(#e7e7e7));
  background-image: -webkit-linear-gradient(top, #f7f7f7, #e7e7e7); 
  background-image: -moz-linear-gradient(top, #f7f7f7, #e7e7e7); 
  background-image: -ms-linear-gradient(top, #f7f7f7, #e7e7e7); 
  background-image: -o-linear-gradient(top, #f7f7f7, #e7e7e7); 
  color: #a7a7a7;
  margin: 10px;
  width: 40px;
  height: 40px;
  position: relative;
  text-align: center;
  line-height: 144px;
  border-radius: 50%;
  box-shadow: 0px 3px 8px #aaa, inset 0px 2px 3px #fff;
  border: solid 1px transparent;
}

button:before {
  content: "";
  display: block;
  background: #fff;
  border-top: 2px solid #ddd;
  position: absolute;
  top: -8px;
  left: -8px;
  bottom: -8px;
  right: -8px;
  z-index: -1;
  border-radius: 50%;
  box-shadow: inset 0px 8px 48px #ddd;
}

button:active {
  box-shadow: 0px 3px 4px #aaa inset, 0px 2px 3px #fff;
}

button:hover {
  text-decoration: none;
  color: #555;
  background: #f5f5f5;
}


i{
  top: 10px;
  position: absolute;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.4rem + ${fontSize - 92}%)` : '1.4rem'};
  left: 10px;
}
`

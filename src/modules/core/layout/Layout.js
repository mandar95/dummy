import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Sidebar, Header, Footer } from "../../../components";
import styled, { createGlobalStyle } from "styled-components";
import { Container } from "react-bootstrap";
import { DrawerControl } from '../../../context/sidebar.context.api';
import Prototype from "modules/announcements/prototype.js";
import { useMediaPredicate } from "react-media-hook";
import { useHistory } from "react-router";

import { ChatBot } from "./chat";
import ModalA from "components/header/profile/ModalA";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import { allFont } from "../../../components/header/profile/FontModal";


const NoPaddingContainer = styled(Container)`
  padding: 0;
  height: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const RightContainer = styled.div`
  flex: 1;
  overflow: auto;
  background-color: ${({ theme }) => theme.dark ? '#383838' : '#F3F8FB'};
`;

const MainContainer = styled.div`
  min-height: calc(100vh - 153px);
`;

const GlobalStyle = createGlobalStyle`

body{
  font-family: ${({ fontFamily }) => allFont[fontFamily - 1]?.title || 'Titillium Web'}, sans-serif;
  font-size: ${({ fontSize }) => fontSize || '92'}%;
}
.metismenu{
font-family: ${({ fontFamily }) => fontFamily !== 1 ? allFont[fontFamily - 1]?.title : 'Open Sans'},sans-serif;
}

:root {
  --tabColor: #fafcff !important;
  --tabBgColor: ${({ theme }) => theme?.Tab?.color || '#706af9'} !important;
  --tabBorderColor: #ffffff #dee2e6 #fff !important;
}

.btn-primary, .btn-primary.disabled, .btn-primary:disabled
{
  background-color: ${({ theme }) => theme?.Tab?.color || '#007bff'};
  border-color: ${({ theme }) => theme?.Tab?.color || '#007bff'};
}
.btn-primary:hover,.btn-primary.focus, .btn-primary:focus,
.btn-primary:not(:disabled):not(.disabled).active, .btn-primary:not(:disabled):not(.disabled):active, .show>.btn-primary.dropdown-toggle{
  background-color: ${({ theme }) => (theme?.Tab?.color || '#0069d9') + 'c9'};
  border-color: ${({ theme }) => theme?.Tab?.color || '#0062cc'};
}

${({ theme }) => theme.dark ? `
body {
  background: #363537;
  color: #FAFAFA;
  transition: all 0.50s linear;
}
.table{
  color: #FAFAFA;
}
.metismenu-link{
  color: #FAFAFA;
}
.modal-content{
  background-color: #2a2a2a;
}
.metismenu-link:hover, .metismenu-link.active {
  background: linear-gradient(to right,#ffffff 0,#ffb3fa 100%);
}
.span-label {
  background: #2a2a2a ;
  color: #ffffff ;
}
.container-check {
  color: rgb(255 255 255) !important;
}
.card-body {
  background: #2a2a2a;
}
.arrow {
  color: #FAFAFA
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active,
select:-webkit-autofill,
select:-webkit-autofill:hover, 
select:-webkit-autofill:focus, 
select:-webkit-autofill:active  {
  box-shadow: 0 0 0 30px #2a2a2a inset;  
  -webkit-box-shadow: 0 0 0 30px #2a2a2a inset !important;
  -webkit-text-fill-color: #FAFAFA;
}
.fa-bell{
  color: #dddddd
}
`: `.fa-bell{
  color: #484848
}`}
`

const Layout = props => {
  const { children, isMain } = props;
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(false);
  const [globalSearch, showGlobalSearch] = useState(false);
  const history = useHistory();
  const biggerThan768 = useMediaPredicate("(min-width: 768px)");
  useHotkeys('ctrl+m', () => showGlobalSearch(count => !count));
  const { fontFamily, fontSize } = useSelector(state => state.theme);

  useEffect(() => {

    window.onscroll = function () {
      if (window.pageYOffset < 77) {
        // alert('I AM AT THE TOP');
        setAtTop(false)
      } else {
        setAtTop(true)
      }
    };
    return () => {
      window.onscroll = null;
    }
  }, [])

  const toggleDrawer = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const openDrawer = () => {
    setOpen(true);
  };


  return (
    <>
      <GlobalStyle fontFamily={fontFamily} fontSize={fontSize} />
      <NoPaddingContainer fluid>
        <Wrapper>
          <DrawerControl>
            <Sidebar
              biggerThan768={biggerThan768}
              atTop={atTop} show={open} openDrawer={openDrawer} closeDrawer={closeDrawer}
              globalSearch={globalSearch} showGlobalSearch={showGlobalSearch} />
            <RightContainer>
              <Header isMain={isMain} atTop={atTop} openDrawer={toggleDrawer}
                globalSearch={globalSearch} showGlobalSearch={showGlobalSearch} />
              <MainContainer>
                {/* <BackBtn onClick={() => history.goBack()}>
                  <img
                    src="/assets/images/icon/backBtn.png"
                    alt="bck"
                    height="45"
                    width="45"
                  />
                </BackBtn> */}
                <Prototype
                  position='Top'
                  url={history.location.pathname.split("/")}
                />
                {children}
                <Prototype
                  position='Bottom'
                  url={history.location.pathname.split("/")}
                />
              </MainContainer>
              <ChatBot />
              <Footer />
            </RightContainer>
            {globalSearch &&
              <ModalA show={globalSearch} onHide={() => showGlobalSearch(false)}
                biggerThan768={biggerThan768} />}
          </DrawerControl>
        </Wrapper>
      </NoPaddingContainer>
    </>
  )
};

Layout.propTypes = {
  children: PropTypes.any
};

export default Layout;

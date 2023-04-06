import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import { useMediaPredicate } from "react-media-hook";
import styled from "styled-components";
import MetisMenu from 'react-metismenu';

import Scrollbars from "react-custom-scrollbars";
import { useSelector, useDispatch } from "react-redux";

import './style.css';
import { Menu } from "./menu.model";
import { loadModules, loadCurrentUser } from "../../modules/core/form/login.slice";
// import { NavLink, Link } from "react-router-dom";
import RouterLink from "./router-link";
// import RouterLink from 'react-metismenu-router-link';
import { DrawerContext } from '../../context/sidebar.context.api';
import SecureLS from "secure-ls";
import { DateFormate } from "../../utils";

const ls = new SecureLS();

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 32px rgba(0, 0, 0, 0.05);
    transition: width 50ms ease-in-out, visibility 0s, opacity 0.8s ease-in-out;
    width: ${({ status, mobileView }) => (status ? mobileView ? '240px' : '100%' : 0)};
    min-width: ${({ status, mobileView }) => (status ? mobileView ? '240px' : '100%' : 0)};
    ${({ status }) => (status ? `visibility: visible;
    opacity: 1;`: `visibility: hidden;
    opacity: 0;`)}
    position: sticky;
    top: 0;
    max-height: 100vh;
    z-index: 2;
    `;
// transform: ${({ status }) => (status ? 'translateX(0)' : 'translateX(-220px)')};

const Header = styled.div`
    background: ${({ theme }) => theme.dark ? '#2e2e2e' : '#fff'};
    border-bottom: 1px solid #ddd;
    display: flex;
`;

const UserInfoWrapper = styled.div`
display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 19px 32px 20px;
    text-align: center;
    flex: 1;
    display: flex;
    justify-content: center;
    padding-top: 20px;
`;

const UserImage = styled.div`
    max-width: 120px;
    /* max-height: 120px; */
    text-align: center;
`;

const UserInfo = styled.p`
    color: ${({ theme }) => (theme.PrimaryColors?.color3 || '#c09206')};
    text-transform: uppercase;
    letter-spacing: .07rem;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    margin-top: 12px;
    margin-bottom: 0;
`;

const MenuWrapper = styled.div`
    flex: 1;
    overflow: auto;
    -webkit-transition: all 0.3s ease 0s;
    margin-bottom: 10px;
    transition: width 200ms ease-in;

/* Metis Menu */
.metismenu {
background: transparent;
}

.metismenu::after {
	box-shadow: none;
}

.metismenu-link {
	color: ${({ theme }) => (theme.PrimaryColors?.color2 || '#2b1d55')};
	/* font-size: 11.7px; */
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12.5px + ${fontSize - 92}%)` : '12.5px'};
	text-transform: capitalize;
    letter-spacing: .07rem;
    font-weight: 700;
	border-bottom: 1px solid #ddd;
	height: 52px;
	display: flex;
	align-items: center;
	text-decoration: none;
	text-shadow: none;
    /* background: url(/assets/images/icon/new.png);
    background-size: 42px;
    background-repeat: no-repeat;
    background-position: -9px -15px; */
}

.metismenu-container>.metismenu-item>.metismenu-link {
	border: 0;
}

.metismenu-container.visible {
	padding: 0;
	box-shadow: none;
}

.metismenu-container.visible>.metismenu-item>.metismenu-link {
	display: flex;
	align-items: center;
	height: 52px;
	border-bottom: 1px solid #ddd;
}


.metismenu-container>.metismenu-item>.metismenu-link >.metismenu-icon{
	color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#0581FC')};
}

.metismenu-link:hover,
.metismenu-link.active {
    text-shadow: 0px 0px 20px ${({ theme }) => (theme.PrimaryColors?.color1 || '#0581FC')};
    color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#0581FC')};
    /* background: ${({ theme }) => `-webkit-linear-gradient(left,${(theme.PrimaryColors?.color1 || '#d2f7f2')} -140%,#fff 100%)`}; */
    background: ${({ theme }) => `linear-gradient(to right,${(theme.PrimaryColors?.color1 || '#d2dcf7')} -390%,#fff 100%)`};
    letter-spacing: .07rem;
    text-transform: capitalize;
    font-weight: 700;
	border-bottom: 1px solid #ddd;
	text-decoration: none;
}

.metismenu-state-icon {
    margin-left: auto;
}

.metismenu-container.visible>.metismenu-state-icon.fa-caret-left:before{
	content: '\f106';
    font-family: fontawesome;
    right: 15px;
    top: 12px;
    /* color: #8d97ad; */
    color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#0581FC')};
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
}

.metismenu-state-icon.fa-caret-left:before {
    content: '\f107';
    font-family: fontawesome;
    right: 15px;
    top: 12px;
    /* color: #8d97ad; */
    color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#0581FC')};
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
}

    `;
// width: ${({ status, mobileView }) => (status ? mobileView ? '220px' : '100%' : 0)};
// transition: all 0.3s ease 0s;
// min-width: 220px;

const CloseButton = styled.div`
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    i {
        cursor: pointer;
    }
`;

const SearchButton = styled.div`
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    i {
        cursor: pointer;
    }
`;

const Logo = styled.img`
  height: 44px;
  max-width: 100%;
`

const Sidebar = ({ atTop, showGlobalSearch, biggerThan768 }) => {

    const dispatch = useDispatch();
    const { status, openStatus } = useContext(DrawerContext)
    const { globalTheme } = useSelector(state => state.theme)
    // const smallerThan700 = useMediaPredicate("(max-width: 700px)");
    const [menu, setMenu] = useState({});
    const [activeId, setActiveId] = useState(1);

    const loginState = useSelector(state => state.login);
    const { modules, currentUser, userType } = loginState;
    const lessThan668 = useMediaPredicate("(max-width: 667px)");

    let _modules = [];

    // show health care for WSP on Palm Prod 
    if (['PALM_PRODUCTION'].includes(process.env.REACT_APP_SERVER) && (![17].includes(currentUser?.employer_id) && userType === 'Employee')) {
        _modules = modules?.filter((item) => item.id !== 118)
    }
    else {
        _modules = modules
    }




    const isAuthenticated = (!!ls.get("token") && !!ls.get("loggedInUser")) || false;

    useEffect(() => {
        if (!modules && isAuthenticated) {
            dispatch(loadModules());
            dispatch(loadCurrentUser());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modules, isAuthenticated]);

    useEffect(() => {
        if (window.location.pathname && modules?.length) {
            setActiveId(modules.find(({ url }) => window.location.pathname === url)?.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modules, window.location.pathname])

    useEffect(() => {
        if (modules?.length) {
            setMenu(new Menu(_modules));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modules])


    const _renderMenus = () => {
        if (modules && modules.length > 0) {
            // const menu = new Menu(modules);
            return (
                <MetisMenu
                    content={menu.items}
                    iconNamePrefix="fa-lg fa fa-"
                    // onSelected={(e) => { onMobile() }}
                    LinkComponent={RouterLink}
                    // activeLinkTo={window.location.pathname}
                    activeLinkId={activeId}
                />
            )
        }
    }
    return (
        // status ? (
        <Wrapper status={status} mobileView={biggerThan768} className="sidebar-wrapper">
            <Header>
                <UserInfoWrapper>
                    {['Employer', 'Employee'].includes(userType)
                        && lessThan668 && !!currentUser?.branding &&
                        <Logo brand={lessThan668 && currentUser?.branding} src={(lessThan668 && currentUser?.branding) || '/assets/images/logo.png'} alt='logo' />}
                    <UserImage>
                        <img
                            alt="logo"
                            src="/assets/images/user-alt-512.png"
                            width="50"
                        />
                        <UserInfo>{currentUser ? currentUser.name : ''}
                        </UserInfo>
                    </UserImage>

                    {['IC', 'Broker'].includes(userType) &&
                        <span style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', color: '#c09206' }}>
                            {currentUser?.broker_role || currentUser?.insurer_role}
                        </span>
                    }

                    {['Employer'].includes(userType) &&
                        <span style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', color: '#c09206' }}>
                            {currentUser?.employer_name} {currentUser?.employer_role && `- ${currentUser?.employer_role}`}
                        </span>
                    }

                    {['Employee'].includes(userType) &&
                        <span style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', color: '#c09206' }}>
                            {currentUser?.company_name} - Employee
                        </span>
                    }

                    {!!currentUser.last_login_at &&
                        <span style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', color: '#000000' }}>
                            Last Login <span> {DateFormate(currentUser.last_login_at, { type: 'withTime' }) || '01-05-2022 14:34:54'}</span>
                        </span>
                    }
                </UserInfoWrapper>
                <CloseButton className={(/*!atTop && biggerThan768*/ false) ? "d-lg-none d-md-none" : ''} onClick={openStatus}>
                    <i className="fa fa-close fa-lg" alt="Close"></i>
                </CloseButton>
                <SearchButton className={(/*!atTop && biggerThan768*/ false) ? "d-lg-none d-md-none" : ''} onClick={() => showGlobalSearch(true)}>
                    <abbr title="Search Ctrl+m"><i className="fa fa-search fa-lg" alt="Close"></i></abbr>
                </SearchButton>
            </Header>
            <MenuWrapper status={status} mobileView={biggerThan768} className="menu-wrapper">
                <Scrollbars renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} className="track-horizontal" />}>
                    {_renderMenus()}
                </Scrollbars>
            </MenuWrapper>
        </Wrapper>
        // ) : null
    );
};

Sidebar.defaultTypes = {
    show: false
};

Sidebar.propTypes = {
    show: PropTypes.bool.isRequired
};

export default Sidebar;

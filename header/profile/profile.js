import React, { useEffect, useState, useRef } from "react";
import { Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin, handleLogout } from "../../../modules/core/form/login.slice";
import { useHistory } from "react-router";
import { /*BroadCastTab,*/ DateFormate, downloadFile, IdleTimer } from '../../../utils'
// import { loadThemes } from "../../../modules/theme/theme.slice";
import {
  updateUserNotification,
  getUserNotification,
  deleteUserNotification
} from "../../../modules/announcements/announcement.slice"
import { Loader } from "components";
import { slice } from 'lodash';
import { format } from 'date-fns';
import "./profile.css";
import SecureLS from "secure-ls";
import swal from "sweetalert";
import service from '../../../modules/core/form/login.service';
import {
  Wrapper, NotificationIcon, NotificationDiv, NotificationContentDiv, NotificationReadIcon,
  ExternalLink, NotificationOuterDiv, NotificationContent, NotificationContentInner, DateTime, NotificationTypeIcon,
  NotificationAlertContainer, NotificationAlertContent, SeeAllNotification, DropDownWrapper, UserImage,
  Toggler, Menu, MenuItem, ItemText
} from "./style"
// import { Popup } from "../../../modules/core/form/login/CustomModal";
import { MasterUserId, MasterUserName, calculateMasters, wrap, unwrap, appendUser } from "./helper";
import { ModuleControl } from "../../../config/module-control";
import ModalFont from "./FontModal";

const ls = new SecureLS();

const Profile = ({ isMain }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [fontModal, setFontModal] = useState(false);
  const [isOpenNotification, OpenNotification] = useState(false);
  const [notificationCount, setnotificationCount] = useState(0);
  const iconRef = useRef(null);
  const notifictionDivRef = useRef(null)
  // const ref = useRef(null);
  const [viewAll, setViewAll] = useState(false);
  const [_loader, setLoader] = useState(false);
  // const [sessionAlert, setSessionAlert] = useState(false);
  // const [modalTranslate, setModalTranslate] = useState(true);

  const [isTimeout, setIsTimeout] = useState(false);

  // const [shouldAsk, setShouldAsk] = useState(false);

  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 15 * 60, //expire after 15 minute
      onTimeout: () => {
        setIsTimeout(true);
      },
      onExpired: () => {
        //do something if expired on load
        setIsTimeout(true);
      }
    });

    return () => {
      timer.cleanUp();
    };
  }, []);


  const userTypeLS = ls.get('userType');
  const isAuthenticated = (!!ls.get("token") && !!ls.get("loggedInUser")) || false;
  const currentUserLS = ls.get("loggedInUser");
  const SessionTime = ls.get("session");
  const isSSO = ls.get('isSSO')

  const checkTab = localStorage.getItem("checkTab");
  const isMultiWindow = checkTab ? JSON.parse(checkTab) : [];
  const { notificationData, is_saas, loading, globalTheme,
    user_type, loadingLogout, currentUser, userType } = useSelector(state => {
      return {
        loading: state.themes?.loading,
        loadingLogout: state.login.loading,
        userType: state.login.userType,
        is_saas: state.login.currentUser?.has_saas,
        user_type: state.login?.userType,
        // theme_id: state.login.currentUser?.theme_id,
        // isAuthenticated: state.login.isAuthenticated,
        notificationData: state.announcement.userNotificationDetails,
        currentUser: state.login.currentUser,
        globalTheme: state.theme.globalTheme
      }
    });

  useEffect(() => {
    if (!loadingLogout &&
      ((userTypeLS && userType && userTypeLS !== userType) ||
        (currentUser.id && currentUserLS.id && currentUser.id !== currentUserLS.id))) {
      swal('Session Closed/Changed', 'Another session is opened in another Tabs or session expired/changed', 'info').then(() => {
        downloadFile('/home');
      })
    }

  }, [userTypeLS, userType, loadingLogout, currentUserLS, currentUser])

  useEffect(() => {
    if (!SessionTime && !loadingLogout) {
      console.warn('%c Profile Session Not Found! ', 'background: #222; color: #bada55');
      swal('Session Closed', 'Logout from current account', 'info').then(() => {
        dispatch(handleLogout());
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SessionTime])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => {
  //   if (SessionTime && !loadingLogout && !sessionAlert && isAuthenticated) {
  //     const now = new Date().getTime();

  //     const diff = now - SessionTime;
  //     const seconds = Math.floor(diff / 1000);
  //     if (seconds > (10)/* 15 minutes */) {
  //       setSessionAlert(true);
  // swal('Your Session Expired', '', 'info').then(() => {
  //   dispatch(handleLogout());
  // })
  //     }
  //   }
  // })
  // const Language = document.cookie.replace(/(?:(?:^|.*;\s*)googtrans\s*\=\s*([^;]*).*$)|^.*$/, "$1")

  useEffect(() => {
    if (isTimeout && !ModuleControl.isDevelopment /* Session TimeOut */) {
      console.warn('%c Profile Session TimeOut! ', 'background: #222; color: #bada55');
      swal('Your Session Expired', '', 'info').then(() => {
        dispatch(handleLogout());
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeout])

  useEffect(() => {
    if ((user_type === "Super Admin" || user_type === "Admin") && iconRef?.current?.style) {
      iconRef.current.style.display = 'none'
    }
    else if (user_type) {
      dispatch(getUserNotification(user_type))
      let count = 0;
      const intervalId = setInterval(() => {
        if (count > 4) {
          clearInterval(intervalId)
        }
        ++count;
        dispatch(getUserNotification(user_type))
      }, 120000);
      return () => { clearInterval(intervalId); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_type]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (loadingLogout || isTimeout) {
        downloadFile(isSSO ? '/logout' : '/')
      }
      else {
        console.warn('%c Loging Out! ', 'background: #222; color: #bada55');
        swal('Session Closed', 'Logout from current account', 'info').then(() => {
          downloadFile('/');
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loadingLogout]);

  useEffect(() => {
    const notificationCount = notificationData.filter((item) => item.is_read !== 1);
    setnotificationCount(notificationCount.length)
  }, [notificationData])

  function googleTranslateElementInit() {
    new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
  };
  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, [])
  // eslint-disable-next-line no-useless-escape
  const Language = document.cookie.replace(/(?:(?:^|.*;\s*)googtrans\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  useEffect(() => {
    if (Language) {
      service.setLanguage({ language: Language })
    }
  }, [Language])

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  });

  // useEffect(() => {
  //   if (shouldAsk) {
  //     history.replace('/home')
  //   }
  // }, [shouldAsk])

  // useEffect(() => {
  //   if (isMultiWindow.length > 1 /*&& !shouldAsk*/) {
  //     swal({
  //       title: "Are you sure?",
  //       text: "Your Previous session is active across Tabs or another Window. All session will be expired",
  //       icon: "info",
  //       buttons: {
  //         cancel: "Cancel",
  //         catch: {
  //           text: "Continue",
  //           value: "continue",
  //         }
  //       },
  //       dangerMode: true,
  //     }).then(async (caseValue) => {
  //       switch (caseValue) {
  //         case "continue":
  //           // setShouldAsk(true)
  //           break;
  //         default:
  //           downloadFile('/');
  //       }
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isMultiWindow])

  const handleClick = (event) => {
    // eslint-disable-next-line eqeqeq
    if (event.target.className == "fa fa-bell fa-2x") {
      !isOpenNotification && dispatch(getUserNotification(user_type))
      OpenNotification(!isOpenNotification)
    }
    else {
      if (!notifictionDivRef?.current?.contains(event.target)) {
        if (isOpenNotification) {
          !isOpenNotification && dispatch(getUserNotification(user_type))
          OpenNotification(!isOpenNotification)
        }
      }
    }
  }

  const logoutHandler = () => {
    dispatch(handleLogout());
  };

  const viewProfileHandler = () => {
    history.push('/profile');
  }

  const passwordHandler = () => {
    history.push('/user-change-password');
  }

  // const billingConsole = () => {
  //   history.push('/billing-console');
  // }

  const themeSetting = () => {
    history.push('/themes')
  }

  const changeProfile = async (id) => {
    if (isMultiWindow.length > 1 && !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
      swal({
        title: "Are you sure?",
        text: "Your Previous session is active across Tabs or another Window. All session will be expired",
        icon: "info",
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Continue",
            value: "continue",
          }
        },
        dangerMode: true,
      }).then(async (caseValue) => {
        switch (caseValue) {
          case "continue":
            const shouldUpdate = await dispatch(handleLogin({
              user_id: currentUser.id,
              switch: 1,
              master_user_type_id: id
            }, true, isSSO));
            if (shouldUpdate) {
              history.replace('/home')
            }
            break;
          default:
        }
      })
    } else {
      const shouldUpdate = await dispatch(handleLogin({
        user_id: currentUser.id,
        switch: 1,
        master_user_type_id: id
      }, true, isSSO));
      if (shouldUpdate) {
        history.replace('/home')
      }
    }
  }

  const masterIds = calculateMasters(currentUser?.profile_master)

  //Notification----------------------------

  function notificationUpdateAction(id) {
    const notification = notificationData.filter((item) => item.id === id);
    if (!notification[0].is_read) {
      const formdata = new FormData();
      formdata.append("notification_id", notification[0].notification_id);
      formdata.append("is_read", 1);
      formdata.append("id", id);
      appendUser(user_type, formdata, currentUser);
      formdata.append("_method", "PATCH");
      dispatch(updateUserNotification(formdata, userType))
    }
  }

  const deleteNotification = (id, i) => {
    var x = document.getElementsByClassName("removeAction");
    var d = x[i];
    d.classList.add("removeNotifiction");
    setTimeout(() => {
      const notification = notificationData.filter((item) => item.id === id);
      const formdata = new FormData();
      formdata.append("notification_id", notification[0].notification_id);
      formdata.append("id", id);
      appendUser(user_type, formdata, currentUser);
      dispatch(deleteUserNotification(formdata, userType))
    }, 0)
  }

  const RedirectHandler = (id, url, actionId) => {
    notificationUpdateAction(id)
    if (url !== "undefined" && url !== null) {
      if (actionId !== 15) {
        window.open(`/${userType.toLowerCase()}/${url}`, "_blank");
      }
      else {
        // change Password
        window.open(`/${url}`, "_blank");
      }
    }


  }

  const ViewAll = () => {
    setLoader(true);
    setTimeout(() => {
      setViewAll(true)
    }, 1000)
  }

  const _notificationData = (notificationData.length > 5 && !viewAll) ? slice(notificationData, 0, 5) : notificationData;

  // const Translate = () => {
  //   setModalTranslate(prev => !prev)
  // }


  return (
    <>
      {/* <BroadCastTab flagReset={isAuthenticated} shouldTrigger={shouldAsk} isMain={isMain} /> */}
      <Wrapper className="pull-right">
        {/* <NotificationIcon>
                    <div className="themeswitcher">
                        <label id="switch" className="switch">
                            <input type="checkbox" onchange="toggleTheme()" id="slider" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </NotificationIcon> */}
        <div id="google_translate_element" className='pr-3' >
          {/* <i className='fas fa-backspace google_translate_element_delete' onClick={() => document.cookie = `googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`} /> */}
        </div>
        {user_type !== 'Super Admin' &&
          <NotificationIcon ref={iconRef}>
            <i className="fa fa-bell fa-2x" aria-hidden="true"></i>
            <span>{!!notificationCount && notificationCount}</span>
          </NotificationIcon>
        }
        {isOpenNotification &&
          <NotificationDiv
            ref={notifictionDivRef}
            style={{
              top: `${iconRef.current.offsetTop + iconRef.current.offsetHeight}px`,
              left: window.matchMedia("(max-width: 500px)").matches ? 'unset' : `${(iconRef.current.offsetLeft - 280)}px`
            }}>
            <Row className="header"><h6>Notifications</h6></Row>
            <Row className="content"
              style={notificationData.length > 5 ? !viewAll ? { height: '297px' } : { height: '330px' } : { height: 'auto' }}>
              {_notificationData.length > 0 ?
                _notificationData.map((item, i) => {
                  return <NotificationContentDiv className="removeAction" key={i + 'notification'} id={i} title={item?.content} IsRead={!item?.is_read}>
                    <div style={{ height: '20px' }}>
                      <NotificationReadIcon IsRead={item?.is_read} className={item?.is_read ? `fa fa-envelope-open` : `fa fa-envelope`}></NotificationReadIcon>
                      {(!item?.is_read && Boolean(item.link)) && <ExternalLink className="fa fa-external-link-alt"></ExternalLink>}
                    </div>
                    <NotificationOuterDiv>
                      <div style={{
                        fontWeight: '500',
                        fontSize: globalTheme.fontSize ? `calc('12px' + ${globalTheme.fontSize - 92}%)` : '12px',
                        letterSpacing: '0.1em'
                      }}>{item?.title}</div>
                      <NotificationContent contentColor={item?.color}
                        // onClick={wrapUwrap(this)}
                        onMouseOver={(e) => wrap(e)}
                        onMouseOut={(e) => unwrap(e)}
                      >
                        <NotificationContentInner
                          target="_blank"
                          //href={item?.link?.replace("/", "")}
                          //href={Boolean(item?.link) ? item?.link : item?.action_url !== "undefined" ? item?.action_url : null}
                          //rel="noopener noreferrer"
                          //onClick={() => notificationUpdateAction(item.notification_id)}

                          onClick={() => RedirectHandler(item.id, Boolean(item?.link) ? item?.link : item?.action_url !== "undefined" ? item?.action_url : null, item.action_type_id)}
                          contentColor={item?.color}
                        >
                          {/* {item?.content} */}
                          {Boolean(item.dynamic_content) ? item.dynamic_content : item?.content}
                        </NotificationContentInner>
                      </NotificationContent>
                      {/* DateFormate(item.updated_at, { type: 'withTime' }) */}
                      <DateTime>{format(new Date(item.updated_at), 'EEE do MMM,yyyy')} at {format(new Date(item.updated_at), 'h:mm a')} </DateTime>
                      {/* <DateTime>{format(new Date("2021-11-21 11:00:28"), 'EEE do MMM,yyyy')} at {format(new Date("2021-11-21 11:00:28"), 'h:mm a')} </DateTime>
                   */}
                    </NotificationOuterDiv>
                    <NotificationTypeIcon>
                      {/* <i className={`${item?.notificationType === "Alert" ? 'fa fa-exclamation-triangle' : ""}`}></i> */}
                      <i className="fad fa-trash-alt" onClick={() => deleteNotification(item.id, i)}></i>
                    </NotificationTypeIcon>
                  </NotificationContentDiv>
                })
                :
                <NotificationAlertContainer>
                  <i className="fa fa-bell" style={{ fontSize: globalTheme.fontSize ? `calc('70px' + ${globalTheme.fontSize - 92}%)` : '70px', color: '#ff7878' }}></i>
                  <i className="fa fa-exclamation" style={{ position: 'absolute', fontSize: globalTheme.fontSize ? `calc('25px' + ${globalTheme.fontSize - 92}%)` : '25px', color: 'white' }}></i>
                  <NotificationAlertContent>Nothing here !!!</NotificationAlertContent>
                </NotificationAlertContainer>
              }
            </Row>
            {(notificationData.length > 5 && !viewAll) && <SeeAllNotification onClick={() => ViewAll(true)}>{_loader ?
              <Spinner animation="border" size="sm" variant="primary" />
              : "See All Notification"}</SeeAllNotification>}
          </NotificationDiv>
        }

        <DropDownWrapper>
          <UserImage />
          {['IC', 'Broker'].includes(userType) && <span className='roletype'>{currentUser?.broker_role || currentUser?.insurer_role}</span>}
          {['Employer'].includes(userType) &&
            <span className='roletype'>
              {currentUser?.employer_name} {currentUser?.employer_role && `- ${currentUser?.employer_role}`}
            </span>
          }
          <Toggler split>
            <i className="fa fa-angle-down user-arrow" />
          </Toggler>
          <Menu className="dropdown-menu">
            <MenuItem eventKey="1" onClick={viewProfileHandler}>View Profile</MenuItem>
            {!!masterIds.length && masterIds.map((id, index) => !!id && [3, 4, 5, 6, 7].includes(id * 1) && MasterUserName[Number(id)] !== userType &&
              <MenuItem key={index + 'side_menu'} eventKey={index + 5} onClick={() => changeProfile(id)}>{MasterUserId[Number(id)]}</MenuItem>)}

            {(['Super Admin', 'Broker'].includes(user_type) && !is_saas) && <MenuItem eventKey="2" onClick={themeSetting}>Theme Setting</MenuItem>}
            {ModuleControl.inDevelopment /* CustomFont */ && <MenuItem eventKey="6" onClick={() => setFontModal(true)}>Change Font Style </MenuItem>}
            {/* {!!is_saas && <MenuItem eventKey="3" onClick={billingConsole}>Billing Console</MenuItem>} */}
            <MenuItem eventKey="4" onClick={passwordHandler}>Change Password</MenuItem>
            {/* <MenuItem eventKey="6" onClick={Translate}>Translate Language</MenuItem> */}
            <MenuItem eventKey="5" onClick={logoutHandler}>Log Out</MenuItem>
            {!!currentUser.last_login_at && <>
              <DropDownWrapper.Divider />
              <ItemText>Last Login <span> {DateFormate(currentUser.last_login_at, { type: 'withTime' }) || '01-05-2022 14:34:54'}</span></ItemText>
            </>}
          </Menu>
        </DropDownWrapper>
      </Wrapper >
      {((loading && user_type !== 'Super Admin') || loadingLogout) && <Loader />}
      <ModalFont
        show={fontModal}
        onHide={() => setFontModal(false)}
      />
      {/* <TranslateModal show={modalTranslate} onHide={Translate} />*/}
      {/* <Popup
        height={"auto"}
        width="640px"
        show={modalTranslate}
        onClose={Translate}
        position="top"
      /> */}
    </>
  );
};

export default Profile;





// const TranslateModal = ({ show, onHide }) => {

//   useEffect(() => {
//     if (window.google.translate.TranslateElement) {
//       new window.google.translate.TranslateElement(
//         { pageLanguage: 'en' },
//         'google_translate_element'
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [window.google.translate.TranslateElement])

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       dialogClassName="my-modal">
//       <Modal.Header>
//         <Modal.Title id="contained-modal-title-vcenter">
//           <Head>Translate Website</Head>
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
//         <div id="google_translate_element"></div>
//       </Modal.Body>
//     </Modal >
//   );
// }

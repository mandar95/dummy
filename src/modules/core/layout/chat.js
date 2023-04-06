import React, { useEffect, useReducer, useState, useRef, Fragment } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
// import { useForm } from 'react-hook-form';
import { downloadFile, randomString } from "../../../utils";
import { Spinner } from "react-bootstrap";

import "./chat.css";
import { Modules, GenerateRandomMsg } from './chat.helper'
import { initialState, getAllDetails, reducer } from './chat.action';
import {
    ChatDiv, TitleDiv, ChatImageDiv,
    ChatImage, ModuleDiv,
    WelcomeDiv, ECardDiv,
    ModuleDiv2, BotMsg,

    UserMessage, SystemMessage, TypingBox, DesignCard, YouAreOffline
} from './chat.style'
import Carousel from "./chat-component/carousel";
import { isArray } from "lodash";

export const ChatBot = () => {
    const [chatDiv, setChatDiv] = useState(false);
    const [typeId, setTypeId] = useState(null)
    const [subTypeId, setSubtypeId] = useState(null);
    const [MSG, setMSG] = useState([{ id: 0, isWelcomeMsg: true }]);
    const [load, setLoad] = useState(false)
    const [offline, setOffline] = useState(false)
    const InputBox = useRef(null)
    const InputBoxIcone = useRef(null)
    const { globalTheme } = useSelector(state => state.theme)


    const history = useHistory();
    const { currentUser, userType: currentUserType } = useSelector(state => state.login);
    const [{ details, loading }, dispatch] = useReducer(reducer, initialState);
    // const { watch } = useForm({
    //     mode: "onChange",
    //     reValidateMode: "onChange"
    // });

    window.addEventListener("offline", (event) => {
        setOffline(true)
    });

    window.addEventListener("online", (event) => {
        setOffline(false)
    });

    useEffect(() => {
        if (details) {
            setLoad(true)
            scrollDown(0)
            setTimeout(() => {
                setLoad(false)
                let Data = typeof (details?.url) === 'string' ? details?.url?.split("/") : undefined
                let _type = details?.type
                if (_type === 6) {
                    history.push(`/${Data[3]}`);
                    setChatDiv(false)
                }
                else {
                    if ([2, 3, 5].includes(_type)) {
                        if (Data) {
                            if (details?.claim_details?.length) {
                                insertChatData({
                                    id: 3, data: details?.claim_details, type: _type, subTypeId: subTypeId.subType, msg: subTypeId.subType === 91 ? `Select Claim ID for claim status` : subTypeId.subType === 32 ? `Select Policy` : `Select Claim ID for track claim`
                                })
                            } else {
                                history.push(`/${Data[3]}/${Data[4]}`);
                                setChatDiv(false)
                            }
                        }
                        else {
                            if (details?.sub_menu?.length) {
                                insertChatData({ id: 2, data: details.sub_menu, type: _type })
                            }
                            else {
                                if (_type === 3) {
                                    insertChatData({
                                        id: 4, data: details.url, type: _type, subTypeName: subTypeId.subTypeName, msg: `${GenerateRandomMsg.ECard()} - ${subTypeId.subTypeName}`
                                    })
                                }
                                if (_type === 5 && details.hospital_details) {
                                    if (details.hospital_details.length) {
                                        insertChatData([{ id: 6, msg: `hello ${currentUser.name}, here are the hospitals avaliable in your network` }, { id: 5, data: details.hospital_details, }])
                                    } else {
                                        insertChatData([{ id: 6, msg: ['No hospital network data found..Please enter another Pincode OR Hospital name', 'OR you can Select the topic mention below'] }, {
                                            id: 0
                                        }])
                                    }

                                }
                                if (_type === 2) {
                                    insertChatData({
                                        id: 3, data: details?.policy_name, type: _type, subTypeId: subTypeId.subType, msg: subTypeId.subType === 91 ? `Select Claim ID for claim status` : subTypeId.subType === 32 ? `Select Policy` : `Select Claim ID for track claim`
                                    })
                                }
                                else {
                                }
                            }

                        }
                    }
                    else {
                        history.push(`/${Data[3]}/${Data[4]}`);
                        setChatDiv(false);
                    }
                }
                scrollDown(0)
            }, 1000)
        }
        // return () => {
        //     setSubModules(null)
        //     setEcardURL(null)
        //     setClaimDetails(null)
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [details])

    useEffect(() => {
        if (loading) {
            scrollDown(0)
        }
    }, [loading])

    const resetTextBoxValue = () => {
        InputBox.current.value = "";
        InputBoxIcone.current.parentNode.style.background = "none"
        InputBoxIcone.current.style.color = '#b4b4b4'
    }
    const scrollDown = (time) => {
        setTimeout(() => {
            var x = document.getElementsByClassName("scrollDown");
            if (x.length !== 0) {
                x[0].scrollTop = 10000
            }
        }, time)
    }
    const getAllData = (id) => {
        setTypeId({ type: id })
        let d = Modules.filter((item) => item.id === id)
        insertChatData({
            id: 1,
            msg: d[0].name
        })
        getAllDetails(dispatch, { type: id })
    }
    const getAllData2 = (type, subType) => {
        if (type === 5 && subType.sub_type_id) {
            setSubtypeId({
                subType: subType.sub_type_id,
                subTypeName: subType.name
            })
            setLoad(true)
            setTimeout(() => {
                insertChatData({
                    id: 6,
                    msg: GenerateRandomMsg.NetworkHospital()
                })
                setLoad(false)
                scrollDown(0)
            }, 2000)
            scrollDown(0)
        } else {
            setSubtypeId({
                subType: subType.sub_type_id,
                subTypeName: subType.name
            })
            getAllDetails(dispatch, {
                type: type,
                sub_type: subType.sub_type_id,
            })
        }

    }
    const downloadEcard = (url) => {
        downloadFile(url, null, true);
        setChatDiv(false)
    }
    const getModuleName = (id) => {
        const data = Modules.filter((item) => item.id === id);
        return data[0].name
    }
    const insertChatData = (obj) => {
        if (isArray(obj)) {
            setMSG(prev => [...prev, ...obj]);
        } else {
            setMSG(prev => [...prev, obj]);
        }
    }
    const RedirectTo = (item, subTypeId) => {
        if (subTypeId === 91) {
            history.push(`/claim-details-view/${randomString()}/${(item.claim_id)}/${randomString()}`)

        }
        else if (subTypeId === 32) {
            history.push(`/${currentUserType.toLowerCase()}/overall-claim/${randomString()}/${Number(item.sub_type_id)}/${randomString()}`)

        }
        else {
            history.push(`/${currentUserType.toLowerCase()}/track-claim/${randomString()}/${(item.claim_id)}/${Number(item.member_id)}/${randomString()}/${(item.tpa_member_id)}`)
        }
        setChatDiv(false)
    }

    const sendMsg = (e) => {
        let Value = e?.currentTarget?.value || e?.current?.value
        if (Value) {
            InputBoxIcone.current.parentNode.style.cssText = `
            background: #0581fcd1; 
            padding: 2px 10px 2px 8px;
            border-radius:5px
            `;
            InputBoxIcone.current.style.cssText = `
            color:#fff   `
        }
        else {
            InputBoxIcone.current.parentNode.style.background = "none"
            InputBoxIcone.current.style.color = '#b4b4b4'
        }

        if (e.key === 'Enter' || e.current) {
            if (Value !== "" && Value && Number(typeId?.type) === 5 && subTypeId?.subType) {
                insertChatData({ id: 1, msg: Value })
                getAllDetails(dispatch, { type: typeId.type, sub_type: subTypeId.subType, other_search: Value })
                resetTextBoxValue()
            } else {
                if (Value !== "" && Value) {
                    insertChatData({ id: 1, msg: Value })
                    resetTextBoxValue()
                    setLoad(true)
                    setTimeout(() => {
                        insertChatData([{
                            id: 6,
                            msg: GenerateRandomMsg.BotResponse(Value, currentUser.name)
                        }, {
                            id: 0,
                            msg: false
                        }])
                        setLoad(false)
                        scrollDown(0)
                    }, 2000)
                    scrollDown(0)
                }
            }
        }
    }
    const displayUI = (item, parentIndex) => {
        switch (item.id) {
            case 1:
                return (<Fragment key={'parentIndex' + parentIndex}>{UserMessage(item.msg)} </Fragment>);
            case 2:
                return (
                    <Fragment key={'parentIndex' + parentIndex}>
                        {item.data &&
                            <>
                                {SystemMessage(`Select sub modules of ${getModuleName(item.type)}`)}
                                <div className="d-flex flex-wrap m-3" style={{
                                    height: item.data?.length > 3 ? '75px' : 'auto',
                                    overflowY: 'auto',
                                    background: '#d2d2dc',
                                    borderRadius: '10px'
                                }}>
                                    {item.data?.map((jitem, i) => {
                                        return (
                                            <ModuleDiv2 key={"asdasdqwe" + i} onClick={() => getAllData2(item.type, jitem)}>{jitem.name}</ModuleDiv2>
                                        )
                                    })}
                                </div>
                            </>
                        } </Fragment>

                );
            case 3:
                return (
                    <Fragment key={'parentIndex' + parentIndex}>
                        {item.data &&
                            <>
                                {SystemMessage(item.msg)}
                                <div className="d-flex flex-wrap m-3" style={{
                                    height: [91, 31].includes(item.subTypeId) ? '150px' : item.data?.length > 3 ? '75px' : 'auto',
                                    overflowY: 'auto',
                                    borderRadius: '10px'
                                }}>
                                    {item.data?.map((jitem, i) => {
                                        return ([91, 31].includes(item.subTypeId) ?
                                            <DesignCard key={"zxcasdwqefdsa" + i} element={jitem} Redirect={() => RedirectTo(jitem, item.subTypeId)} />
                                            :
                                            <ECardDiv key={"zxcasdwqefdsa" + i} onClick={() => RedirectTo(jitem, item.subTypeId)}>
                                                {item.subTypeId === 32 ? jitem.name : jitem.claim_id}
                                            </ECardDiv>
                                        )
                                    })}
                                </div>
                            </>
                        }
                    </Fragment>
                );
            case 4:
                return (
                    <Fragment key={'parentIndex' + parentIndex}>
                        {(item && item?.data.some((jitem) => jitem.ecard_url)) ?
                            <>
                                {SystemMessage(item.msg)}
                                <div className="d-flex flex-wrap m-3" style={{
                                    height: '42px',
                                    overflowY: 'auto',
                                    borderRadius: '10px'
                                }}>
                                    {item?.data?.map((el, i) => {
                                        return <React.Fragment key={"zxcasdwqefdsatrwdsad" + i}>
                                            {el.ecard_url ?
                                                <ECardDiv
                                                    onClick={() => downloadEcard(el.ecard_url)}
                                                >{el.first_name}<i className="fa fa-solid fa-id-card" style={{
                                                    fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
                                                    marginLeft: '5px'
                                                }}></i></ECardDiv>
                                                : ''
                                            }
                                        </React.Fragment>

                                    })}
                                </div>
                            </>
                            : item?.data.length ?
                                SystemMessage(`No E-card found for policy ${item.subTypeName}`)
                                : ''
                        }
                    </Fragment>
                )
            case 5:
                return (
                    <Fragment key={'parentIndex' + parentIndex}>
                        {!!item.data?.length &&
                            <Carousel Data={item.data} />
                        }
                    </Fragment>
                )
            case 6:
                return (<Fragment key={'parentIndex' + parentIndex}>  {SystemMessage(item.msg)}</Fragment>);
            default: return (
                <div key={'parentIndex' + parentIndex} className="flex-wrap  justify-content-center welDiv">
                    {item.isWelcomeMsg && <WelcomeDiv>Welcome, please select from the below mentioned Menu options to assist you.</WelcomeDiv>}
                    {Modules.map((item, i) => {
                        return (
                            <ModuleDiv key={"zxcasdwqefdsavcsdqwe" + i} onClick={() => getAllData(item.id)}>{item.name}</ModuleDiv>
                        )
                    })}
                </div>
            );
        }
    }
    // currentUser.has_chatbot_service
    return (
        <>
            {currentUserType === "Employee" && !!currentUser.has_chatbot_service &&
                <>
                    {!chatDiv && <ChatImageDiv onClick={() => setChatDiv(!chatDiv)}><ChatImage className="fa fa-solid fa-comment"></ChatImage></ChatImageDiv>}
                    {chatDiv &&
                        <ChatDiv style={{ display: 'block' }}>
                            <TitleDiv>Talk To Buddy <i className="fa fa-angle-down user-arrow" onClick={() => setChatDiv(!chatDiv)}></i></TitleDiv>
                            {offline && <YouAreOffline>Your device seems to be offline</YouAreOffline>}
                            <div className="scrollDown" style={{ height: '495px', overflowY: 'auto', padding: '0px 10px' }}>
                                {MSG.map((item, index) => {
                                    return displayUI(item, index)
                                })}
                                {load &&
                                    <div className="d-flex flex-column align-items-start" style={{ marginTop: '8px' }}>
                                        <BotMsg>
                                            {[1, 2, 3].map((_, index) => <Spinner key={index + 'spinner'} size="sm" animation="grow" variant="dark" />)}
                                        </BotMsg>
                                    </div>
                                }
                                {loading &&
                                    <div className="d-flex flex-column align-items-start" style={{ marginTop: '8px' }}>
                                        <span style={{ letterSpacing: '1px', marginLeft: '13px' }}>Sending...</span>
                                    </div>
                                }
                            </div>
                            <TypingBox>
                                <input
                                    ref={InputBox}
                                    onKeyUp={(e) => sendMsg(e)}
                                    // onKeyPress={(e) => sendMsg(e)}
                                    type="text" maxlength="256" placeholder="Type your message here" style={{
                                        color: 'rgb(150, 155, 166)'
                                    }} />
                                <div><i ref={InputBoxIcone} onClick={() => sendMsg(InputBox)} className="fa fa-solid fa-paper-plane"></i></div>
                            </TypingBox>
                        </ChatDiv>
                    }
                </>
            }
        </>
    )
}

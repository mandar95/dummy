import { isArray } from 'lodash';
import React from 'react'
import styled from "styled-components";

export const ChatDiv = styled.div`
margin-right: 15px;
cursor: pointer;
float: left;
width: 400px;
height: 600px;
text-align:center;
border-radius: 7px;
position: fixed;
background-color: white;
z-index: 99999;
right: 0;
bottom: 40px;
display: flex;
justify-content: center;
align-items: center;
box-shadow: 0px 0px 20px 3px #b3b3b3;
& .react-multi-carousel-item{
    width:368px !important;
}
@media (max-width: 767px) {
    width: 100%;
    float: none;
    margin: 0px 5px;
  }
`
export const TitleDiv = styled.div`
background: ${({ theme }) => theme?.Tab?.color || '#0581fc'};
padding: 10px 6px;
border-radius: 5px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
letter-spacing: 1px;
color: white;
text-align: center;
position: relative;
& i{
    position: absolute;
    right: 22px;
    top: 12px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(23px + ${fontSize - 92}%)` : '23px'};
}
`
export const ChatImageDiv = styled.div`
margin-right: 15px;
cursor: pointer;
float: left;
width: 42px;
height: 42px;
position: fixed;
border-radius: 50%;
background-color: ${({ theme }) => theme?.Tab?.color || '#0581fc'};
padding: 5px 15px 14px 8px;
z-index: 99999;
right: 5px;
bottom: 67px;
display: flex;
justify-content: center;
align-items: center;
`
export const ChatImage = styled.i`
color: white;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(19px + ${fontSize - 92}%)` : '19px'};
margin-left: 7px;
margin-top: 8px;
`
export const ModuleDiv = styled.span`
background: ${({ theme }) => theme?.Tab?.color || '#0581fc'};
color: white;
padding: 5px 10px;
border-radius: 21px;

margin: 5px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(11px + ${fontSize - 92}%)` : '11px'};
letter-spacing: 1px;
`
export const ModuleDiv2 = styled(ModuleDiv)`
background: white;
color: black;
`
export const SubMoudleTitle = styled.span`
background: #e2e2e2;
width: 88%;
margin: 15px auto;
padding: 3px 10px;
color: ${({ theme }) => theme?.Tab?.color || '#0581fc'};
border-radius: 4px;
letter-spacing: 1px;
`
export const WelcomeDiv = styled.div`
border-radius: 2px 10px 10px 10px;
background: ${({ theme }) => theme?.Tab?.color || '#0581fc'}d1;
color: white;
padding: 10px 10px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
letter-spacing: 1px;
margin-bottom: 8px;
`
export const ECardDiv = styled.span`
display: flex;
background: ${({ theme }) => theme?.Tab?.color || '#0581fc'};
color: #ffffff;
padding: 5px 10px;
justify-content: center;
align-items: center;
border-radius: 4px;

margin: 5px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(11px + ${fontSize - 92}%)` : '11px'};
`
export const NoEcard = styled.span`
background: #ff4a4a;
color: white;
letter-spacing: 1px;
padding: 4px 10px;
border-radius: 4px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
`
export const HospitalCard = styled.div`
height: 90%;
background: ${({ theme }) => theme?.Tab?.color || '#0581fc'}26;
padding: 10px 5px;
margin: 5px 5px;
box-shadow: 0px 3px 7px 1px #cfcfcf;
border-radius: 10px;
border: 1px solid #eae2ff;
`
export const HospName = styled.div`

letter-spacing: 1px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
line-height: 14px;
text-align: center;
margin-left: 10px;
letter-spacing: 1px;
`
export const HospAdd = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
line-height: 19px;
letter-spacing: 1px;
margin-top: 10px;
display:flex;
display: flex;
align-items: baseline;

`
export const TypingBox = styled.div`
height: 50px;
border-radius: 50px;
margin-top:10px;
    width: 100%;
    border-top: 1px solid;
    display: flex;
    align-items: center;
    padding-right: 20px;
  background: rgb(234, 238, 243);
    border-top-color: rgb(234, 234, 234);

    & input{
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
    line-height: 20px;
    height: 100%;
    flex: 1 0 0;
    padding: 0 20px;
    background: transparent;
    border: 0;
    text-align: start;
    }
    & i{
        transform: rotate(47deg);
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
        color: #b4b4b4;
    }
`
export const UserMsg = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    line-height: 20px;
    word-wrap: break-word;
    white-space: pre-wrap;
    max-width: 100%;
    padding: 10px 15px;
    border-radius: 20px 5px 20px 20px;
    letter-spacing: 1px;
    background: ${({ theme }) => theme?.Tab?.color || '#0581fc'};
    color: rgb(255,255,255);
`
export const BotMsg = styled(UserMsg)`
border-radius: 5px 20px 20px 20px;
background: rgb(232 232 232);
color: rgb(0, 0, 0);
`
export const YouAreOffline = styled.div`
white-space: nowrap;
    overflow: hidden!important;
    text-overflow: ellipsis;
    margin-top: -3px;

    // position: absolute;
    // top: 6%;
    // left: 0;
    // right: 0;
    height: 40px;
    background: #f5a623;
    color: #fff;
    width: 100%;
    display: flex;

    align-items: center;

    justify-content: center;
    padding: 0 20px;
`

const ParentBox = styled.div`
width: 100%;
margin: 5px;
background: white;
box-shadow: 1px 2px 5px 1px #d4d4d4;
line-height: 8px;
border: 1px solid #e4e4e4;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
`
const Box = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
padding: 10px 20px;
`
const Title = styled.div`

letter-spacing:1px;
`
const Status = styled.div`
padding: 5px;
    border: 1px solid #8eff90;
    border-radius: 2px;
`
const UserNameDiv = styled.div`
align-items: flex-end;
display: flex;
flex-direction: column;
margin-top:8px;
`
const MsgDiv = styled(UserNameDiv)``

const SystemNameDiv = styled.div`
align-items: center;
display: flex;
margin-top:8px;
`

export const DesignCard = ({ element, Redirect }) => {
    return (
        <ParentBox onClick={() => Redirect()}>
            <Box style={{
                padding: '18px 20px',
                borderBottom: '1px solid #dedede'
            }}>
                <Title>{element.claim_id}</Title>
                {/* <Status>{element.claim_status.claim_status === "" ? "Pending" : element.claim_status.claim_status}</Status> */}
                <Status>{element.claim_status.claim_status || "Pending"}</Status>
            </Box>
            <Box>
                <Title>{`Member Name`}</Title>
                <div>{element.claim_status.member_name || element.claim_status.employee_name}</div>
            </Box>
            <Box>
                <Title>{`Claim Approved date`}</Title>
                <div>{element.claim_status.claim_approval_date || "-"}</div>
            </Box>
            <Box>
                <Title>{`Claim Settled Date`}</Title>
                <div>{element.claim_status.claim_settled_date || "-"}</div>
            </Box>
        </ParentBox>
    )
}
export const UserMessage = (msg) => {
    return (
        <>
            <UserNameDiv>You</UserNameDiv>
            <MsgDiv>
                <UserMsg>{msg}</UserMsg>
            </MsgDiv>
        </>
    )
}
export const SystemMessage = (msg) => {
    if (isArray(msg)) {
        return (
            <>
                <SystemNameDiv><img src='/assets/images/chatbot.jpg' alt="bck" height="40" width="40" />Chat Bot</SystemNameDiv>
                {msg.map((item,i) =>
                    <MsgDiv key={"msg"+i} style={{ alignItems: 'flex-start' }}>
                        <BotMsg>
                            {item}
                        </BotMsg>
                    </MsgDiv>
                )}
            </>
        )
    } else {
        return (
            <>
                <SystemNameDiv><img src='/assets/images/chatbot.jpg' alt="bck" height="40" width="40" />Chat Bot</SystemNameDiv>
                <MsgDiv style={{ alignItems: 'flex-start' }}>
                    <BotMsg>
                        {msg}
                    </BotMsg>
                </MsgDiv>
            </>
        )
    }

}

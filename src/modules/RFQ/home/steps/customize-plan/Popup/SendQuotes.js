import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import styled from "styled-components";
import { sendRFQLeadQuote } from "../../../home.slice";

import Popup from "./Popup";

// import { useSelector, useDispatch } from "react-redux";
// import { useLocation } from 'react-router';
// import { sendQuotes } from '../../modules/home/home.slice'


export const SendQuotes = ({ show, onClose, mobile, email, type, callbackSuccess }) => {

  const dispatch = useDispatch();
  const [msg, setMsg] = useState(false);
  // const { group_details: { self_email, self_mobile_no } } = useSelector(state => state.home);
  // const { policy: { proposer_email, proposer_mobile_no } } = useSelector(state => state.form);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const enquiry_id = decodeURIComponent(query.get("enquiry_id"));
  const broker_id = query.get("broker_id");


  // if (type === 'call') {
  //   setTimeout(() => {
  //     // onClose(false);
  //     // setMsg(false);
  //   }, 2500);
  // }
  useEffect(() => {
    if (callbackSuccess) {
      setTimeout(() => {
        onClose(false);
        setMsg(false);
      }, 2500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackSuccess])

  const onSubmit = () => {
    // if (SendQuoteMailRFQ) {
    dispatch(sendRFQLeadQuote({ enquiry_id, broker_id }, { onClose, setMsg }));
    // } else {
    //   setMsg(true);
    //   setTimeout(() => {
    //     onClose(false);
    //     setMsg(false);
    //   }, 2500);
    // }
  }


  const content2 = (
    <MessageContainer>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#4fcc6e"
        width="48px"
        height="48px">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
      </svg>
      <FlexDiv>
        {/* <LaxmiWrapper> */}
        <Laxmi src="/assets/images/illustration-email-marketing-message-concept_249405-12.jpg" alt="Laxmi" />
        {/* </LaxmiWrapper> */}
        <Wrapper>
          <Text>
            Thank you! Your quotes has been sent via SMS on <strong>{mobile || 'your mobile number'}</strong> and also email on <strong>{email || 'on your mail ID'}</strong>
          </Text>
        </Wrapper>
      </FlexDiv>

    </MessageContainer>
  );

  const call = (
    <MessageContainer>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#4fcc6e"
        width="48px"
        height="48px">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
      </svg>
      <FlexDiv>
        {/* <LaxmiWrapper> */}
        <Laxmi width='140px' src="/assets/images/flat-customer-support-illustration_23-2148899114.jpg" alt="Call" />
        {/* </LaxmiWrapper> */}
        <Wrapper>
          <Text>
            Thank you! Our customer excutive will call you soon on   <strong>{mobile || 'your mobile number'}</strong>
          </Text>
        </Wrapper>
      </FlexDiv>

    </MessageContainer>
  )

  const content = (
    <MainWrapper>
      <Laxmi src="/assets/images/illustration-email-marketing-message-concept_249405-12.jpg" alt="Laxmi" />
      <Wrapper>
        <Text>
          We will send you this quote via SMS on <strong>{mobile || 'your mobile number'}</strong> and also email on <strong>{email || 'on your mail ID'}</strong>
        </Text>
      </Wrapper>
      <div>
        <ConfirmButton
          onClick={onSubmit}>
          Send</ConfirmButton>
      </div>
    </MainWrapper>
  );

  return (
    <div>
      <Popup
        height={msg ? "240px" : "auto"}
        width="640px"
        show={show}
        onClose={onClose}
        content={type === 'call' ? call : msg ? content2 : content}
        position="middle"
      ></Popup>
    </div>
  );
};

export default SendQuotes;

// const LaxmiWrapper = styled.div`
// /* float:left; */
// margin-right:28px;
// @media (max-width: 500px) {
//   margin-right:0;
// }
// `;

export const UTMContent = ({ utm_source }) => (<MainWrapper>
  <Laxmi width="auto" height="160px" src="/assets/images/RFQ/UTM.jpg" alt="Laxmi" />
  <Wrapper maxWidth='440px'>
    <Text fontSize='17px'>
      This solution is customized specific to <strong>{utm_source}</strong> registered companies only. Please provide your organization details registered with <strong>{utm_source}</strong>. If you are buying the policy first time you can get preagreed rates and terms. If this is renewal of your existing policy  we will provide best quote based on the  information provided by you for your exisitng policy.
    </Text>
  </Wrapper>
</MainWrapper>)

const Laxmi = styled.img`
height:${({ height }) => height || '130px'};
width: ${({ width }) => width || '170px'};
/* border-radius:50%; */
/* box-shadow: 0px 4px 13px rgba(41,41,41,0.35); */
/* border: 2.5px solid #004b83; */
`;

const MainWrapper = styled.div`
margin: 50px 0 65px;
padding:0px 20px;
display: flex;
flex-direction:column;
justify-content: center;
align-items: center;
flex-wrap: wrap;
@media (max-width: 500px) {
  margin: 50px 0;
  padding: 0 2px;
}
`;

const Wrapper = styled.div`
max-width: ${({ maxWidth }) => maxWidth || '400px'};
text-align: left;
align-self: center;
  &>div{
    text-align:center;
    margin-top:10px;
  }
  @media (max-width: 500px) {
  margin-top: 20px;
  }
`;

const Text = styled.p`
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || "14px"} + ${theme.fontSize - 92}%)` : (fontSize || "14px")};
line-height: 20px;
text-align: center;
color: #666666;
font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
& strong{
  color:#000000;
}
`;

const ConfirmButton = styled.button`
background-color:#1bf29e;
display:block;
/* margin:25px 30%; */
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
color: #fff;
padding:12px 40px;

border-radius: 5px;
border:none;
&:focus {
  outline: none;
}
@media (max-width: 500px) {
  margin: auto;
}
`;

const MessageContainer = styled.div`
  padding: 10px;
  & svg {
    margin: 0 auto;
    width: 100%;
  }
`;

const FlexDiv = styled.div`
  padding-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

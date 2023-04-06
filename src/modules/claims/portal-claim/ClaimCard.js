import React from "react";
import styled from 'styled-components';
import { InfoCard } from './DetailCard';
import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { set_track_claim } from '../claims.slice';
import { DateFormate } from "../../../utils";
import { Status, SubStatus } from "../../plan-hospitalization";
import { useMediaQuery } from 'react-responsive';
export const ClaimCard = ({ title, claimId, claimDate, claimType, claimReason,
  approvedAmt, calimAmt, userType, track_data, is_opd_claim, claim_request_id,
  claim_request_date, claim_status, claim_deficiency = [],
  recommendation_id, comment, claimRedirectHandler, trigger, policyNo, claim_hospitalization_type }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const dispatch = useDispatch();
  const history = useHistory();

  const saveTrack = () => {
    if (claimId) {
      dispatch(set_track_claim({ ...track_data, claimId }))
      history.push(`/${userType}/track-claim`)
    }
    if (claim_request_id) {
      history.push(`e-cashless-service?claim_request_id=${claim_request_id}`)
    }
  }
  return (
    <InfoCard >
      <Wrapper style={{
        position: "relative",
      }}>
        <Title>{title}</Title>
        <InfoWrapper>
          <div className="d-flex justify-content-between"> <span className="text-left">Claim Id:</span><span className="text-secondary">{claimId || '-'}</span></div>
          <div className="d-flex justify-content-between"> <span className="text-left">{!!claim_request_id && 'Planned'} Hospitalization Date{/*  {track_data === false && 'Intimation'} Date*/} :</span><span className="text-secondary">{DateFormate(claimDate) || '-'}</span></div>
          <div className="d-flex justify-content-between"> <span className="text-left">Claim Request Date :</span><span className="text-secondary">{DateFormate(claim_request_date) || '-'}</span></div>
          <div className="d-flex justify-content-between"> <span className="text-left">Claim Type:</span><span className="text-secondary">{(claimType?.charAt(0).toUpperCase() + claimType?.slice(1)) || '-'}{(is_opd_claim !== undefined && claimType) && (is_opd_claim ? '-OPD' : '-IPD')}</span></div>
          <div className="d-flex justify-content-between"> <span className="text-left">Claim Sub Type:</span><span className="text-secondary">{claim_hospitalization_type || 'Hospitalization'}</span></div>
          {claim_request_id && <>
            <div className="d-flex justify-content-between"> <span className="text-left">Status:</span><span className="text-secondary">{Status(claim_status, claim_deficiency) || '-'}</span></div>
            <div className="d-flex justify-content-between"> <span className="text-left">Sub Status:</span><span className="text-secondary">{SubStatus(claim_status, claim_deficiency, recommendation_id, comment) || '-'}</span></div>
          </>}

        </InfoWrapper>
        <>
          <div className="d-flex justify-content-between"> <span className="text-left">Ailment:</span></div>
          <ReasonBox>
            {claimReason || '-'}
          </ReasonBox>
        </>

        <Footer>
          <div className="d-flex justify-content-between"> <span className="text-left">Claim Settled/Approved Amount:</span><span className="text-secondary">{approvedAmt ? `${approvedAmt} /-` : '-'}</span></div>
          <div className="d-flex justify-content-between"> <span className="text-left">Claim Amount:</span><span className="text-secondary">{calimAmt ? `${calimAmt} /-` : '-'}</span></div>
        </Footer>
        {!!((claimId && track_data !== false) || claim_request_id) && claimType &&
          <Track onClick={saveTrack}>
            {/* <Link to={`/${userType}/track-claim`}> */}
            <span className="text-center">{claim_request_id ? `View ${!isMobile ? "Claim Detail" : ""}` : `Track ${!isMobile ? "Claim Here" : ""}`}</span>
            {/* </Link> */}
            {!isMobile && <i className="ti-location-pin pt-1" />}
          </Track>
        }
        {Boolean(trigger === 0 && Number(track_data?.policyNo) === 1) && <ViewClaim onClick={claimRedirectHandler} className="bg-primary text-light text-left">
          <span className="text-center">Details</span>
          {/* </Link> */}
          {!isMobile && <i className="far fa-eye"></i>}
        </ViewClaim>}
      </Wrapper>
    </InfoCard>
  );
};

const Wrapper = styled.div`
padding: 26px 30px 0px 30px;
margin-bottom: 40px;
`

const Title = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};

color: #2141c6;`

const InfoWrapper = styled.div`
padding-top: 1rem !important;
line-height: 25px;
display: flex;
flex-direction: column;
span{
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
}`

const ReasonBox = styled.div`
border: 1px dashed #d1d1d1;
padding: 9px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
text-align: left;
margin-top: 9px;`

const Footer = styled.div`
border: 1px solid #c9c9c9;
margin: 17px -30px 0px -30px;
border-radius: 35px;
padding: 15px 30px;
display: flex;
flex-direction: column;
span{
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'} !important;
}`

const Track = styled.div`
position: absolute;
border: 1px solid #c9c9c9;
left: 21px;
bottom: -23px;
border-radius: 0px 0px 13px 13px;
background-color: #d4d4d4;
width: 40%;
color: #2e46a4;
padding: 1px 22px;
display: flex;
justify-content: space-between;
cursor: pointer;
@media only screen and (min-width: 340px) {
  & {
    width: 40%;
  }
}
@media only screen and (min-width: 430px) {
  & {
    width: 40%;
  }
}
`
const ViewClaim = styled.div`
position: absolute;
right: 25px;
bottom: -22px;
border-radius: 0px 0px 13px 13px;
width: 40%;
color: #2e46a4;
padding: 1px 22px;
display: flex;
justify-content: space-between;
align-items: center;
cursor: pointer;
@media only screen and (min-width: 340px) {
  & {
    width: 40%;
  }
}
@media only screen and (min-width: 430px) {
  & {
    width: 40%;
  }
}
`

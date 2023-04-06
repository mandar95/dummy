import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import _ from 'lodash';

import { CardBlue, Loader } from "components";
import { Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { getClaimDetails, clear, claimDetailsData as setclaimDetailsData } from "../claims.slice";
import { _expenses, _charges } from "./helper";
import { isValidHttpUrl, randomString } from '../../../utils';
import { useHistory, useLocation, useParams } from 'react-router';
import { DocumentsModal } from './DocumentsModal';

const DownloadBtn = styled.span`
background: #ffc926;
color: white;
padding: 5px 10px;
border-radius: 5px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
margin-right: 10px;
`
const CardDiv = styled.div`
background-color:${({ bgColor }) => bgColor ? bgColor : '#ffffff'};
padding: 11px;
border-radius: 5px;
box-shadow: 0px 0px 9px 0px #d9d9d9;
&:first-child{
    margin-bottom:10px;
}
@media (max-width:992px) {
	margin-bottom:10px
   }
`
const Title = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};

color: #ff6666;
`
const UnderlineDiv = styled.div`
background-image: linear-gradient(to left, rgba(255,0,0,0), rgba(255,0,0,1));
height: 3px;
border-radius: 15px;
width: 50%;
margin-bottom: 15px;
`
const InputLabel = styled.div`
color: #6b6b6b;

font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
word-break: break-word;
.text-black{
  color: #000000;
}
@media (max-width:667px) {
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
   }
`
const OutputLabel = styled.div`

color: black;
word-break: break-word;
margin-bottom: 5px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
@media (max-width:667px) {
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
}
`
export const Span = styled.span`
background:${({ bgColor }) => bgColor ? bgColor : '#ffffff'};
padding: 0px 10px;
border-radius: 10px;
color: ${({ Color }) => Color ? Color : '#ffffff'};

border:${({ Border }) => Border ? Border : 'none'};
`
const ExpenseDetails = styled.div`
background: #fdffd3;
padding: 0px 15px;
border-radius: 15px;
@media (max-width:992px) {
	padding: 10px 15px;
   }
`
const ChargeDiv = styled.div`
background: ${({ bgColor }) => bgColor || '#f3fbff'};
padding: 10px 15px;
border-radius: 15px;
box-shadow: 0px 0px 9px 0px #d9d9d9;
`
const IMG = styled.img`
width: 100%;
height:auto;
@media (max-width:992px) {
	display:none
   }
`
const ClaimHeader = styled(Row)`
& div:nth-child(2){
    text-align:end
}
@media (max-width:992px) {
	display:block !important;
    & div:nth-child(2){
        text-align:start;
        margin-top:10px
    }
   }
`

export const ClaimDetailsView2 = () => {
  let { id: claimId, type: claimType } = useParams();
  claimId = decodeURIComponent(claimId);
  claimType = decodeURIComponent(claimType);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const development = decodeURIComponent(query.get("development") || "");
  const dispatch = useDispatch();
  const { claimDetailsData, loading, error } = useSelector((state) => state.claims);
  const { globalTheme } = useSelector(state => state.theme)

  useEffect(() => {
    if (claimId) {
      dispatch(getClaimDetails({ claim_id: claimId }, claimType, true))
    }

    return () => dispatch(setclaimDetailsData({}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId, claimType])

  useEffect(() => {
    if (error) {
      swal("Alert", error, "warning");
    }
    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  //card title----------------------------------------------
  const title = (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "4px" }}>
      <span>Claim View</span>
    </div>
  );

  return (
    (!_.isEmpty(claimDetailsData)) ? (
      <CardBlue title={title}>
        <Row>
          <Col xs={12} md={12} lg={12} xl={8} sm={12}>
            <ClaimHeader className="mb-2">
              <Col xs={12} md={12} lg={6} sm={12} style={{ fontWeight: '500' }}>
                Claim ID - <Span bgColor="#fffdc5" Color="black" Border="1px dashed">{claimDetailsData?.tpa_claim_id || (claimType === "GPA") ? claimId : "-"}</Span>
              </Col>
              <Col xs={12} md={12} lg={6} sm={12} style={{ fontWeight: '500', display: 'flex', flexDirection: 'column' }}>
                {/* Claim Status - <Span bgColor="#ffdede" Color="red">{(claimDetailsData?.documents?.length && claimDetailsData?.documents !== null) ? 'EB Portal' : 'Offline'}</Span> */}
                <span>Claim Status - <Span bgColor="#ffdede" Color="red">{(Boolean(claimDetailsData?.claim_status) ? claimDetailsData?.claim_status : "Pending")}</Span></span>
                <span style={{
                  marginTop: '5px'
                }}>Claim Sub Status - <Span bgColor="#dee1ffd9" Color="#006bff">{(Boolean(claimDetailsData?.claim_sub_status) ? claimDetailsData?.claim_sub_status : "-")}</Span></span>
              </Col>
            </ClaimHeader>
            <Row>
              <Col xs={12} md={12} lg={6} sm={12}>
                <div>
                  <PolicyDetailView claimDetailsData={claimDetailsData} />
                  <ClaimTrackerView claimDetailsData={claimDetailsData} claimId={claimId} claimType={claimType} development={development} />
                </div>
              </Col>
              <Col xs={12} md={12} lg={6} sm={12}>
                <ClaimDetailsView claimDetailsData={claimDetailsData} claimType={claimType} />
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={12} lg={12} xl={4} sm={12}>
            <ExpenseDetailsView globalTheme={globalTheme} claimDetailsData={claimDetailsData} />
            {_charges?.some((item, i) => claimDetailsData[item?.key] && Number(claimDetailsData[item?.key])) && <ChargesView globalTheme={globalTheme} claimDetailsData={claimDetailsData} />}
            {!!claimDetailsData.billed_amount && Array.isArray(claimDetailsData.billed_amount) && <BilledAmountView globalTheme={globalTheme} claimDetailsData={claimDetailsData} />}
            {!((_charges?.some((item, i) => claimDetailsData[item?.key] && Number(claimDetailsData[item?.key])) ||
              (!!claimDetailsData.billed_amount && Array.isArray(claimDetailsData.billed_amount)))
            ) && <div className='d-flex justify-content-center align-items-center pt-5 mt-5'>
                <img height={250} src='/assets/images/employee-home/connect-heal.jpg' alt='connect' />
              </div>}
          </Col>
        </Row>
      </CardBlue>
    ) :
      loading && <Loader />
  )
}

const checkLabel = (claimDetailsData, key) => {
  let value = claimDetailsData[key] || "-"
  if (key === 'member_mobile' && claimDetailsData[key] !== null) {
    value = claimDetailsData[key]?.length > 1 ? claimDetailsData[key] : "-"
  }
  if (key === 'member_email' && typeof claimDetailsData[key] === 'object' && claimDetailsData[key] !== null) {
    value = claimDetailsData[key]?.length !== 0 ? claimDetailsData[key].join(",") : "-"
  }
  if (key === 'documents' && claimDetailsData[key] !== null) {
    value = claimDetailsData[key]?.length !== 0 ? getDocumentCell(claimDetailsData[key]) : "-"
  }
  return value
}

const getDocumentCell = (values) => {
  return values?.map((item, i) =>
    <DownloadBtn
      key={"pdjfijfijiej" + i}
      role='button'
      onClick={() => exportPolicy(item.document_url)}>
      {item.document_name}
      <i className="ti ti-download"></i>
    </DownloadBtn>
  )
}

const exportPolicy = (URL) => {
  if (URL) {
    const link = document.createElement('a');
    link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(URL));
    link.href = URL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

const PolicyDetailView = ({ claimDetailsData }) =>
  <CardDiv bgColor="#f7efff">
    <Title>Policy Details</Title>
    <UnderlineDiv />
    <InputLabel>Policy Type</InputLabel>
    <OutputLabel>{claimDetailsData?.policy_type || "-"}</OutputLabel>
    <InputLabel>Policy Number</InputLabel>
    <OutputLabel>{claimDetailsData?.policy_number || "-"}</OutputLabel>
    <InputLabel>Insurance Company Name</InputLabel>
    <OutputLabel>{claimDetailsData?.insurance_company_name || "-"}</OutputLabel>
    <InputLabel>Corporate Name</InputLabel>
    <OutputLabel>{claimDetailsData?.company_name || "-"}</OutputLabel>
    <div className="d-flex justify-content-between">
      <div>
        <InputLabel>Policy Start Date</InputLabel>
        <OutputLabel>{claimDetailsData?.policy_start_date || "-"}</OutputLabel>
      </div>
      <div>
        <InputLabel>Policy End Date</InputLabel>
        <OutputLabel style={{ textAlign: 'end' }}>{claimDetailsData?.policy_end_date || "-"}</OutputLabel>
      </div>
    </div>
    <div className="d-flex justify-content-between">
      <div>
        <InputLabel>Employee Name</InputLabel>
        <OutputLabel>{claimDetailsData?.employee_name || "-"}</OutputLabel>
      </div>
      <div>
        <InputLabel>Employee Mobile Number</InputLabel>
        <OutputLabel style={{ textAlign: 'end' }}>{claimDetailsData?.employee_mobile_number || "-"}</OutputLabel>
      </div>
    </div>
    <InputLabel>Employee Email ID</InputLabel>
    <OutputLabel>{checkLabel(claimDetailsData, 'employee_mail')}</OutputLabel>

    {!!((claimDetailsData?.balance_suminsured && Number(claimDetailsData?.balance_suminsured)) || claimDetailsData?.balance_suminsured === 0) && <>
      <InputLabel>Balance SumInsured</InputLabel>
      <OutputLabel>
        {(String(claimDetailsData?.balance_suminsured).includes(".") ?
          Number(claimDetailsData?.balance_suminsured).toFixed(2) :
          ((Number(claimDetailsData?.balance_suminsured) || claimDetailsData?.balance_suminsured === 0) && String(claimDetailsData?.balance_suminsured)))
          || "-"}
      </OutputLabel>
    </>}

  </CardDiv>

const ClaimTrackerView = ({ claimDetailsData, claimId, claimType, development }) => {

  const history = useHistory();

  return (
    <CardDiv bgColor="#fff5ef">
      <Title>Claim Tracker</Title>
      <UnderlineDiv />
      <div className="d-flex justify-content-between">
        <div>
          <InputLabel>Claim Approved date</InputLabel>
          <OutputLabel>{claimDetailsData?.claim_approval_date || "-"}</OutputLabel>
        </div>
        <div>
          <InputLabel>Claim Settled Date</InputLabel>
          <OutputLabel style={{ textAlign: 'end' }}>{claimDetailsData?.claim_settled_date || "-"}</OutputLabel>
        </div>
      </div>
      <InputLabel>Deficiency Reason</InputLabel>
      <OutputLabel>{claimDetailsData?.deficiency_reason || "-"}</OutputLabel>
      <InputLabel>Reject Date</InputLabel>
      <OutputLabel>{claimDetailsData?.reject_date || "-"}</OutputLabel>
      <InputLabel>Reject Reason</InputLabel>
      <OutputLabel>{claimDetailsData?.reject_season || "-"}</OutputLabel>
      <div className="d-flex justify-content-between">
        <div>
          <InputLabel>Deficiency Raised Date</InputLabel>
          <OutputLabel>{claimDetailsData?.deficiency_raised_date || "-"}</OutputLabel>
        </div>
        {!!(claimDetailsData?.deficiency_upload || claimDetailsData?.deficiency_documents?.length || development) &&
          <div>
            <InputLabel>Resolve Deficiency</InputLabel>
            <OutputLabel style={{ textAlign: 'end' }}>
              <Button size='sm' onClick={() => history.push(`/deficiency-resolution/${randomString()}/${claimId}/${randomString()}/${claimType}`)}>
                {(!!(claimDetailsData?.deficiency_documents?.length) && claimDetailsData?.deficiency_upload === 0) ? 'View Uploaded' : 'Upload'} Documents
              </Button>
            </OutputLabel>
          </div>}
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <InputLabel>Deficiency Expected Closure Date</InputLabel>
          <OutputLabel>{claimDetailsData?.deficiency_expected_closure_date || "-"}</OutputLabel>
        </div>
        <div>
          <InputLabel>Deficiency Actual Closure Date</InputLabel>
          <OutputLabel style={{ textAlign: 'end' }}>{claimDetailsData?.deficiency_closure_date || "-"}</OutputLabel>
        </div>
      </div>
      <InputLabel>Deficiency First Reminder</InputLabel>
      <OutputLabel>{claimDetailsData?.deficiency_first_reminder || "-"}</OutputLabel>
      <InputLabel>Deficiency Second Reminder</InputLabel>
      <OutputLabel>{claimDetailsData?.deficiency_second_reminder || "-"}</OutputLabel>
      <InputLabel>Deduction Reason</InputLabel>
      <OutputLabel>{(Array.isArray(claimDetailsData?.deduction_reason) ? claimDetailsData?.deduction_reason?.reduce((total, { DeductionReason }) => !total ? DeductionReason : `${total}, ${DeductionReason}`, '') : claimDetailsData?.deduction_reason) || "-"}</OutputLabel>
    </CardDiv>
  )
}

const ClaimDetailsView = ({ claimDetailsData, claimType }) => {

  const [modal, setModal] = useState(false)

  return (
    <CardDiv bgColor="#f4f8ff">
      <Title>Claim Details</Title>
      <UnderlineDiv />
      <InputLabel>Patient Name</InputLabel>
      <OutputLabel>{claimDetailsData?.member_name || "-"}</OutputLabel>
      <InputLabel>Relationship With Employee</InputLabel>
      <OutputLabel>{claimDetailsData?.member_relation || "-"}</OutputLabel>
      <InputLabel>Ailment</InputLabel>
      <OutputLabel>{claimDetailsData?.ailment || "-"}</OutputLabel>
      {claimType !== "GPA" && <><InputLabel>TPA Name</InputLabel>
        <OutputLabel>{claimDetailsData?.tpa_name || "-"}</OutputLabel></>}
      <InputLabel>Claim Type (ipd/opd)</InputLabel>
      <OutputLabel>{claimDetailsData?.claim_type_ipd_opd || "-"}</OutputLabel>
      <div className="d-flex justify-content-between">
        <div>
          <InputLabel>Claim Type</InputLabel>
          <OutputLabel>{claimDetailsData?.claim_type || "-"}</OutputLabel></div>
        <div>
          <InputLabel>Source</InputLabel>
          <OutputLabel style={{ textAlign: 'end' }}>{(claimDetailsData?.documents?.length && claimDetailsData?.documents !== null) ? 'EB Portal' : 'Offline'}</OutputLabel>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <InputLabel>Claim Registered Date</InputLabel>
          <OutputLabel>{claimDetailsData?.claim_registered_tpa || "-"}</OutputLabel>
        </div>
        <div>
          <InputLabel>Claimed Amount</InputLabel>
          <OutputLabel style={{ textAlign: 'end' }}>{(String(claimDetailsData?.claimed_amount).includes(".") ? Number(claimDetailsData?.claimed_amount).toFixed(2) : claimDetailsData?.claimed_amount) || "-"}</OutputLabel>
        </div>
      </div>
      <InputLabel>Hospital Name</InputLabel>
      <OutputLabel>{claimDetailsData?.hospital_name || "-"}</OutputLabel>
      <InputLabel>hospital Address</InputLabel>
      <OutputLabel>{claimDetailsData?.hospital_add || "-"}</OutputLabel>
      <InputLabel>Hospital City</InputLabel>
      <OutputLabel>{claimDetailsData?.hospital_city || "-"}</OutputLabel>
      <InputLabel>Hospital State</InputLabel>
      <OutputLabel>{claimDetailsData?.hospital_state || "-"}</OutputLabel>
      <InputLabel>Hospital Pincode</InputLabel>
      <OutputLabel>{claimDetailsData?.hospital_pincode || "-"}</OutputLabel>
      <InputLabel>Hospitalization Date</InputLabel>
      <OutputLabel>{claimDetailsData?.hospitalization_date || "-"}</OutputLabel>
      <InputLabel>Discharge Date</InputLabel>
      <OutputLabel>{claimDetailsData?.discharge_date || "-"}</OutputLabel>
      {claimDetailsData?.room_category && <>
        <InputLabel>Room Category</InputLabel>
        <OutputLabel>{claimDetailsData?.room_category || "-"}</OutputLabel>
      </>}
      {!!claimDetailsData?.maternity && <><InputLabel>Maternity</InputLabel>
        <OutputLabel>{claimDetailsData?.maternity || "-"}</OutputLabel>
      </>}
      {!!claimDetailsData?.documents && <>
        <InputLabel>Document Uploaded</InputLabel>
        <OutputLabel style={{ marginTop: '10px' }}>{checkLabel(claimDetailsData, 'documents')}</OutputLabel>
      </>}
      {((isValidHttpUrl(claimDetailsData?.deduction_sheet) ? claimDetailsData?.deduction_sheet : (claimDetailsData?.deduction_sheet?.length > 6)) ||
        (isValidHttpUrl(claimDetailsData?.calculation_sheet) ? claimDetailsData?.calculation_sheet : (claimDetailsData?.calculation_sheet?.length > 6)) ||
        (isValidHttpUrl(claimDetailsData?.query_letter) ? claimDetailsData?.query_letter : (claimDetailsData?.query_letter?.length > 6)) ||
        (isValidHttpUrl(claimDetailsData?.denial_letter) ? claimDetailsData?.denial_letter : (claimDetailsData?.denial_letter?.length > 6)) ||
        (isValidHttpUrl(claimDetailsData?.final_settlement_letter) ? claimDetailsData?.final_settlement_letter : (claimDetailsData?.final_settlement_letter?.length > 6)) ||
        (isValidHttpUrl(claimDetailsData?.rejection_letter) ? claimDetailsData?.rejection_letter : (claimDetailsData?.rejection_letter?.length > 6)) ||
        !!claimDetailsData?.tpa_claim_documents?.length) &&
        <>
          <InputLabel>Document/Letters</InputLabel>
          <OutputLabel>
            <Button size='sm' onClick={() => setModal(true)}>
              View Documents
            </Button>
          </OutputLabel>
        </>}
      {claimType === "GPA" && <><InputLabel>Inception Code</InputLabel>
        <OutputLabel >{claimDetailsData?.inception_code || "-"}</OutputLabel>
      </>}
      {claimType === "GPA" && <><InputLabel>Inception Person</InputLabel>
        <OutputLabel >{claimDetailsData?.inception_person || "-"}</OutputLabel>
      </>}
      {modal && <DocumentsModal
        data={{
          deduction_sheet: (isValidHttpUrl(claimDetailsData?.deduction_sheet) ? claimDetailsData?.deduction_sheet : (claimDetailsData?.deduction_sheet?.length > 6) ? 'https://' + claimDetailsData?.deduction_sheet : '') || '',
          calculation_sheet: (isValidHttpUrl(claimDetailsData?.calculation_sheet) ? claimDetailsData?.calculation_sheet : (claimDetailsData?.calculation_sheet?.length > 6) ? 'https://' + claimDetailsData?.calculation_sheet : '') || '',
          query_letter: (isValidHttpUrl(claimDetailsData?.query_letter) ? claimDetailsData?.query_letter : (claimDetailsData?.query_letter?.length > 6) ? 'https://' + claimDetailsData?.query_letter : '') || '',
          denial_letter: (isValidHttpUrl(claimDetailsData?.denial_letter) ? claimDetailsData?.denial_letter : (claimDetailsData?.denial_letter?.length > 6) ? 'https://' + claimDetailsData?.denial_letter : '') || '',
          final_settlement_letter: (isValidHttpUrl(claimDetailsData?.final_settlement_letter) ? claimDetailsData?.final_settlement_letter : (claimDetailsData?.final_settlement_letter?.length > 6) ? 'https://' + claimDetailsData?.final_settlement_letter : '') || '',
          rejection_letter: (isValidHttpUrl(claimDetailsData?.rejection_letter) ? claimDetailsData?.rejection_letter : (claimDetailsData?.rejection_letter?.length > 6) ? 'https://' + claimDetailsData?.rejection_letter : '') || '',
          tpa_claim_documents: claimDetailsData?.tpa_claim_documents || []
        }}
        onHide={() => setModal(false)} show={modal} />}
    </CardDiv>
  )
}

const ExpenseDetailsView = ({ claimDetailsData, globalTheme }) =>
  <>
    <div style={{
      fontWeight: '500',
      fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px',
      borderBottom: '2px dashed #c2c2c2'
    }}>
      Expense Details
    </div>
    <ExpenseDetails style={{ marginTop: '10px' }}>
      <Row className="align-items-start">
        <Col xs={12} md={12} lg={9} sm={12} className='py-3'>
          {_expenses.map((item, i) => (!!Number(claimDetailsData[item?.key])) && (
            <div className="d-flex justify-content-between" key={"asdasdasdqwecdf" + i}>
              <InputLabel>
                {item.label} &nbsp;-
              </InputLabel>
              <OutputLabel>{(Number(claimDetailsData[item?.key]) && (String(claimDetailsData[item?.key]).includes('.') ? Number(claimDetailsData[item?.key]).toFixed(2) : claimDetailsData[item?.key])) || '0'}</OutputLabel>
            </div>
          ))}
        </Col>
        <Col xs={12} md={12} lg={3} sm={12} style={{ padding: '0px' }}>
          <IMG
            src="/assets/images/Taking notes-pana.png"
            alt="bck"
          />
        </Col>
      </Row>
    </ExpenseDetails>
  </>

const ChargesView = ({ claimDetailsData, globalTheme }) =>
  <ChargeDiv style={{ marginTop: '10px' }}>
    <div style={{
      fontWeight: '500',
      fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
      borderBottom: '2px dashed #c2c2c2',
      background: '#cef2ff',
      padding: '2px 5px',
      borderRadius: '5px'
    }}>
      Charges
    </div>
    <div style={{ marginTop: '10px', lineHeight: '22px' }}>
      {_charges?.map((item, i) => (!!(claimDetailsData[item?.key] && Number(claimDetailsData[item?.key]))) && Number(claimDetailsData[item?.key]) !== 0 && (
        <div className="d-flex justify-content-between" key={"kjhfojidehbdhk" + i}>
          <InputLabel>
            {item?.label}
          </InputLabel>
          <OutputLabel>{(String(claimDetailsData[item?.key]).includes('.') ? Number(claimDetailsData[item?.key]).toFixed(2) : claimDetailsData[item?.key]) || '0'}</OutputLabel>
        </div>
      ))}
    </div>
  </ChargeDiv>

const BilledAmountView = ({ claimDetailsData, globalTheme }) =>
  <ChargeDiv bgColor='#fff4f4' style={{ marginTop: '10px', padding: '10px 0' }}>
    <div style={{
      fontWeight: '500',
      fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
      borderBottom: '2px dashed #c2c2c2',
      background: '#ffd5d5',
      padding: '2px 5px',
      margin: '0 15px',
      borderRadius: '5px'
    }}>
      Non Payable
    </div>
    <div style={{ marginTop: '10px', lineHeight: '22px' }}>
      {claimDetailsData?.billed_amount?.map(({ BillCategory, BillAmount, NonPayableAmount, PayableAmount, NonPayableReason }, i) => (!!(NonPayableAmount && Number(NonPayableAmount))) && Number(NonPayableAmount) !== 0 && (
        <div className='border px-3 mx-2 border-danger rounded mb-1 pt-1'>
          <div className="d-flex justify-content-between" key={"first-billed" + i}>
            <InputLabel style={{ color: '#ae0000' }}>
              {BillCategory}
            </InputLabel>
            <InputLabel>
              Bill Amount: <span className='text-black'>{(String(BillAmount).includes('.') ? Number(BillAmount).toFixed(2) : BillAmount) || '0'}</span>
            </InputLabel>
          </div>
          <div className="d-flex justify-content-between" key={"second-billed" + i}>
            <InputLabel>
              Non Payable Amount:  <span className='text-black'>{(String(NonPayableAmount).includes('.') ? Number(NonPayableAmount).toFixed(2) : NonPayableAmount) || '0'}</span>
            </InputLabel>
            <InputLabel>
              Payable Amount:  <span className='text-black'>{(String(PayableAmount).includes('.') ? Number(PayableAmount).toFixed(2) : PayableAmount) || '0'}</span>
            </InputLabel>
          </div>
          <div className="d-flex justify-content-between" key={"third-billed" + i}>
            <InputLabel>
              Non Payable Reason: <span className='text-black'>{NonPayableReason}</span>
            </InputLabel>
          </div>
        </div>
      ))}
    </div>
  </ChargeDiv>

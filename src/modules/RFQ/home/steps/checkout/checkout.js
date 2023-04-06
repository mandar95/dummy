import React, { useEffect } from 'react';
import { Row, Col } from "react-bootstrap";
// import { OptionInput } from "../../style";
import styled from 'styled-components';
import { RFQButton } from "../../../../../components";
// import { Input, Select } from "../../../components";
// import { numOnly, noSpecial } from 'utils'

import { BackBtn } from '../button'
// import * as yup from "yup";
// import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
// import { loadCompanyData } from '../../home.slice';
import { loadRfq } from '../../../rfq.slice';
import { doesHasIdParam, giveProperId } from '../../home';
import { NumberInd } from '../../../../../utils';

const Label = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.4rem + ${fontSize - 92}%)` : '1.4rem'};

border-radius: 5px;
margin-bottom: 0;
`

const BorderDiv = styled.div`
height: 6px;
width: 55px;
background: #ffcd37;
border-radius: 15px;
`

const SideCard = styled.div`
padding: 10px 35px;
background: white;
border-radius: 15px;
box-shadow: 0px 1px 6px 1px gainsboro;
height: 100%;
/* width: 360px; */
// height: 415px;

@media (max-width:992px) {
	margin-top:20px;
   }
`

const Cardinputlabel = styled.div`

color: #727272;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
line-height: 2.2;
`

const CardOutputLabel = styled.div`

font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
color:#51516f;
line-height: 2.2;
`

const TitleLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};

color: #8d8a8a;
`
const OutputLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.15rem + ${fontSize - 92}%)` : '1.15rem'};

color:#51516f;
`
const TitleDiv = styled.div`
padding: 10px 30px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
background: #005aff12;
color:#3b6482;

@media (max-width:992px) {
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.8rem + ${fontSize - 92}%)` : '0.8rem'};

   }
`
const Rows = styled(Row)`
@media (max-width:992px) {
	margin:0px 10px;
   }
`
const CardRows = styled(Row)`
padding: 0px 145px;
@media (max-width:992px) {
	margin:0px 10px
   }
   @media (max-width:1291px) {
    padding: 0px 0px
   }
`

const IMG = styled.img`
@media (max-width:767px) {
height:165px;
   }
`
const CheckoutLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.8rem + ${fontSize - 92}%)` : '1.8rem'};
@media (max-width:767px) {
   font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.6rem + ${fontSize - 92}%)` : '1.6rem'};

   margin-top:20px
       }
`
const PaymentRow = styled(Row)`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
@media (max-width:767px) {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};

    & span{
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'} !important;
        line-height:20px !important
    }
}

`

export const Checkout = ({ utm_source }) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = decodeURIComponent(query.get("enquiry_id"));
    const { globalTheme } = useSelector(state => state.theme)
    const { company_data, organizationName } = useSelector(state => state.RFQHome);
    const { rfqData } = useSelector(state => state.rfq);
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");


    useEffect(() => {
        if (company_data.selected_plan?.ic_plan_id)
            dispatch(loadRfq({ ic_plan_id: company_data.selected_plan?.ic_plan_id, ...giveProperId({ brokerId, insurerId }) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data]);

    const payment_not_allowed_renewal = company_data.is_fresh_policy === 0 ? !rfqData.allow_payment_for_renewal : false;


    return (
        <>
            <Row>
                <Col sm="12" md="12" lg="12" xl="12" className="d-flex">
                    <BackBtn url={`/declaration?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`} style={{ outline: "none", border: "none", background: "none" }}>
                        <img
                            src="/assets/images/icon/Group-7347.png"
                            alt="bck"
                            height="45"
                            width="45"
                        />
                    </BackBtn>
                    <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Go Back</h1>
                </Col>
            </Row>
            <Rows className="justify-content-center" style={{ marginBottom: '5px', marginTop: '-15px' }}>
                <CheckoutLabel>Checkout</CheckoutLabel>
            </Rows>
            <Rows className="justify-content-center" style={{ marginBottom: '25px' }}>
                <TitleDiv>Thank you
                    for choosing {organizationName} for your Group Health Insurance requirements</TitleDiv>
            </Rows>
            <CardRows>
                <Col xl={4} lg={4} md={12} sm={12} className="d-flex justify-content-center align-items-center">
                    <IMG
                        src={rfqData.logo || "/assets/images/Group 7932@2x.png"} height="auto" width='250px'
                    />
                </Col>
                <Col xl={4} lg={4} md={12} sm={12}>
                    <SideCard className="">
                        <Row className="flex-column">
                            <Label>Personal Details</Label>
                            <BorderDiv />
                        </Row>
                        <Row className="flex-column mt-2">
                            <TitleLabel>Company Name</TitleLabel>
                            <OutputLabel>{company_data.company_name}</OutputLabel>
                        </Row>
                        <Row className="flex-column mt-3">
                            <TitleLabel>Mobile Number</TitleLabel>
                            <OutputLabel>{company_data.contact_no}</OutputLabel>
                        </Row>
                        <Row className="flex-column mt-3">
                            <TitleLabel>Email ID</TitleLabel>
                            <OutputLabel>{company_data.work_email}</OutputLabel>
                        </Row>
                    </SideCard>
                </Col>
                <Col xl={4} lg={4} md={12} sm={12}>
                    <SideCard>
                        <Row className="flex-column">
                            <Label>Plan Details</Label>
                            <BorderDiv />
                        </Row>
                        <Row style={{ flexDirection: 'column', padding: '0px 20px', lineHeight: '50px' }}>
                            <Row className="justify-content-between">
                                <Cardinputlabel>Plan Name</Cardinputlabel>
                                <CardOutputLabel>{rfqData.name}</CardOutputLabel>
                            </Row>
                            <Row className="justify-content-between">
                                <Cardinputlabel>Sum Insured</Cardinputlabel>
                                <CardOutputLabel>{`₹ ${NumberInd(company_data?.member_details?.reduce((n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)), 0))} `}</CardOutputLabel>
                            </Row>

                        </Row>
                        <hr></hr>
                        <PaymentRow className="justify-content-center" style={{ fontSize: globalTheme.fontSize ? `calc(1rem + ${globalTheme.fontSize - 92}%)` : '1rem', fontWeight: '500', color: '#22415d' }}>
                            Premium&nbsp;&nbsp; <span style={{ fontSize: globalTheme.fontSize ? `calc(1.2rem + ${globalTheme.fontSize - 92}%)` : '1.2rem', lineHeight: '27px', marginLeft: '22px' }}>₹ {NumberInd(company_data.selected_plan?.final_premium)}</span>&nbsp;(GST included)
                        </PaymentRow>
                        <Row>
                            <RFQButton width="100%" height="60px" style={{ marginTop: '20px' }} onClick={() => history.push(payment_not_allowed_renewal ? '/rfq-callback-done' : `payment-gateway?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)}>
                                {payment_not_allowed_renewal ? 'Procceed' : 'Proceed to Payment'}
                            </RFQButton>
                        </Row>
                    </SideCard>
                </Col>
            </CardRows>
        </>
    )
}

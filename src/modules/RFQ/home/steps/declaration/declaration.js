import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import { OptionInput } from "../../style";
import styled from 'styled-components';
import swal from "sweetalert";
import { RFQButton } from "../../../../../components";
// import { Input, Select } from "../../../components";
// import { numOnly, noSpecial } from 'utils'

import { BackBtn } from '../button'
// import * as yup from "yup";
// import _ from 'lodash';
// import swal from "sweetalert";

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';


import { getAllDeclration } from "modules/documents/documents.slice";
// import { loadCompanyData } from '../../home.slice';
import { loadRfq } from '../../../rfq.slice';
import { doesHasIdParam, giveProperId } from '../../home';
import { onChangeHandler } from './helper';
import { EmployeeShow } from '../customize-plan/InputForm';
import { ModuleControl } from '../../../../../config/module-control';
import { NumberInd } from '../../../../../utils';

const Label = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};

padding: 0px 5px;
border-left: 8px solid #ffcd37;
border-radius: 5px;
`
const CardRow = styled(Row)`
@media (max-width:1145px) {
  flex-direction:column;
   }
`

const TopCard = styled.div`
flex-direction: column;
display: flex;
justify-content: center;
line-height: 20px;
background: white;
color: black;
padding: 20px 20px 10px;
height: 85px;
border-radius: 5px;
box-shadow: 0px 1px 6px 1px gainsboro;
max-width: 330px;
margin-right: 35px;

@media (max-width:1145px) {
    margin: 15px 0px;
    max-width: 100%;
   }

`
const TitleLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};

color: #8d8a8a;
`
const OutputLabel = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};

color:#114a7d;
`


const SideCard = styled.div`
padding: 10px 35px;
background: white;
border-radius: 5px;
box-shadow: 0px 1px 6px 1px gainsboro;
max-width: 355px;
height: max-content;
`

const Cardinputlabel = styled.div`

color: #727272;
`

const CardOutputLabel = styled.div`

color:#114a7d;
`

const PaymentRow = styled(Row)`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
color: #22415d;
`

export const Declaration = ({ utm_source }) => {
    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = decodeURIComponent(query.get("enquiry_id"));
    // const utm_source = query.get("utm_source");
    const { allDeclrationData } = useSelector((state) => state.documents);
    const { company_data } = useSelector(state => state.RFQHome);
    const { rfqData } = useSelector(state => state.rfq);
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");

    const [mandatory, setMandatory] = useState([])

    const { handleSubmit, register, watch } = useForm({
    });

    const TotalLives = String(company_data.family_construct?.reduce((total, { no_of_relations }) => total + no_of_relations, 0)
        || 0
    );

    useEffect(() => {
        dispatch(getAllDeclration(giveProperId({ brokerId, insurerId })));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (company_data.selected_plan?.ic_plan_id)
            dispatch(loadRfq({ ic_plan_id: company_data.selected_plan?.ic_plan_id, ...giveProperId({ brokerId, insurerId }) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data]);


    const onSubmit = (data) => {
        if (mandatory.length === 0) {
            ModuleControl.isHero ?
                history.push(`/rfq-callback-done?enquiry_id=${encodeURIComponent(id)}&payment=done${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
                :
                history.push(`/checkout?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
        }
        else {
            swal("Please agree terms and condition to proceed", "", "warning")
        }
    }
    return (
        <>
            <Row >
                <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                    <BackBtn url={`/company-detail/5?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`} style={{ outline: "none", border: "none", background: "none" }}>
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
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ padding: '0px 40px' }}>
                    <Col xl={8} lg={8} md={8} sm={12}>
                        <CardRow xs={1} sm={2} md={2} lg={2} xl={2}>
                            <TopCard>
                                <TitleLabel>Compant Name</TitleLabel>
                                <OutputLabel>{company_data.company_name}</OutputLabel>
                            </TopCard>
                            <TopCard>
                                <TitleLabel>Email ID</TitleLabel>
                                <OutputLabel>{company_data.work_email}</OutputLabel>
                            </TopCard>
                        </CardRow>
                        <Row style={{ marginTop: '30px', marginBottom: '25px' }}><Label style={{ fontSize: globalTheme.fontSize ? `calc(1.7rem + ${globalTheme.fontSize - 92}%)` : '1.7rem' }}>Declarations</Label></Row>
                        <Row style={{ flexDirection: 'column' }}>
                            {/* <Col xl={12} lg={12} md={12} sm={12}>
                                <OptionInput className="d-flex">
                                    <input
                                        name={`select_all`}
                                        type={"checkbox"}
                                        ref={register}
                                        defaultChecked={true}
                                        onChange={setSelectAll}
                                    />
                                    <span></span>
                                    <p>
                                        Select All
                                </p>
                                </OptionInput>
                            </Col> */}
                            {allDeclrationData.map(({ id, declaration, is_mandatory }, index) => (
                                <Col xl={12} lg={12} md={12} sm={12} key={index + 'declartion-86'}>
                                    <OptionInput small width={'auto'} className="d-flex" style={{ marginTop: '15px' }}>
                                        <input
                                            name={`parent[${id}].id`}
                                            type={"checkbox"}
                                            ref={register}
                                            onChange={(e) => onChangeHandler(e, { watch, allDeclrationData, mandatory, setMandatory })}
                                            id={id}
                                            defaultChecked={is_mandatory ? true : false}
                                        />
                                        <span></span>
                                        <p style={{ whiteSpace: 'normal', fontSize: globalTheme.fontSize ? `calc(0.7rem + ${globalTheme.fontSize - 92}%)` : '0.7rem', marginTop: '0', margiBottom: '8px' }}>
                                            {declaration}
                                        </p>

                                    </OptionInput>
                                </Col>

                            ))}
                            {/* <Col xl={12} lg={12} md={12} sm={12}>
                                <OptionInput width={'auto'} className="d-flex" style={{ marginTop: '15px' }}>
                                    <input type="checkbox"
                                        name="terms_condition"
                                        ref={register}
                                        defaultChecked={false}
                                    />
                                    <span></span>
                                    <p style={{ whiteSpace: 'normal' }}>
                                        I agree to the terms and conditions
                                    </p>
                                </OptionInput>
                            </Col> */}
                        </Row>
                    </Col>
                    <Col xl={4} lg={4} md={12} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <SideCard>
                            <Row className="justify-content-center">
                                <img alt="logo" src={rfqData.logo} width='65%' className="__web-inspector-hide-shortcut__ pt-3 pb-3" />
                            </Row>
                            <Row style={{ flexDirection: 'column', padding: '0px 20px', lineHeight: '30px' }}>
                                <div>
                                    <Row className="justify-content-between">
                                        <Cardinputlabel>Recommended plan for</Cardinputlabel>
                                        <CardOutputLabel>{company_data.company_name}</CardOutputLabel>
                                    </Row>
                                </div>
                                <div>
                                    <Row className="justify-content-between">
                                        <Cardinputlabel>Plan Name</Cardinputlabel>
                                        <CardOutputLabel>{rfqData.name}</CardOutputLabel>
                                    </Row>
                                </div>
                                <div>
                                    <Row className="justify-content-between">
                                        <Cardinputlabel>Sum Insured</Cardinputlabel>
                                        <CardOutputLabel>{`₹ ${NumberInd(company_data?.member_details?.reduce((n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)), 0))} `}</CardOutputLabel>
                                    </Row>
                                </div>
                                {EmployeeShow(company_data, company_data.family_construct?.length) && <div>
                                    <Row className="justify-content-between">
                                        <Cardinputlabel>No. of Employees</Cardinputlabel>
                                        <CardOutputLabel>{company_data.no_of_employees}</CardOutputLabel>
                                    </Row>
                                </div>}
                                <div>
                                    <Row className="justify-content-between">
                                        <Cardinputlabel>Total Lives coverd</Cardinputlabel>
                                        <CardOutputLabel>{TotalLives}</CardOutputLabel>
                                    </Row>
                                </div>

                            </Row>
                            <hr></hr>
                            <PaymentRow className="justify-content-center">
                                You'll Pay&nbsp;&nbsp; <span style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', lineHeight: '22px', marginLeft: '22px' }}>₹ {NumberInd(company_data.selected_plan?.final_premium)}</span>&nbsp;(GST included)
                            </PaymentRow>
                            <Row>
                                <RFQButton width="100%" height="60px" style={{ marginTop: '20px' }}>
                                    Proceed
                                </RFQButton>
                            </Row>
                        </SideCard>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

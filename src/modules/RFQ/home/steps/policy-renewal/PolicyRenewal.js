import React, { useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import styled from 'styled-components';
import { ToggleCard, RFQButton, RFQcard, Loader } from "components";
import { BackBtn } from '../button';

// import swal from "sweetalert";

import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { clear, set_company_data, saveCompanyData } from '../../home.slice';
import { doesHasIdParam } from "../../home";


const Cols = styled(Col)`
& div:first-child{
    justify-content:end;
}
@media (max-width: 991px) {
    & div:first-child{
        justify-content:center !important;
    }
}
`

export const PolicyRenewal = ({ utm_source }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = decodeURIComponent(query.get("enquiry_id"));
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");
    const { success, loading, company_data, enquiry_id } = useSelector(state => state.RFQHome);
    const { globalTheme } = useSelector(state => state.theme)
    const { handleSubmit, register, setValue, watch } = useForm({
        defaultValues: {
            is_fresh_policy: (parseInt(company_data?.is_fresh_policy) === 0 ? 1 : 0) || 0
        },
    });

    useEffect(() => {
        if (company_data?.is_fresh_policy) {
            setValue("is_fresh_policy", parseInt(company_data?.is_fresh_policy) === 0 ? 1 : 0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data])

    // redirect if !id
    useEffect(() => {
        if (!id) {
            history.replace(`/company-details`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // redirect
    useEffect(() => {
        if (success && (enquiry_id || id)) {
            // history.push(`${parseInt(company_data?.is_fresh_policy) === 0 ?
            //     '/previous-policy-detail' : '/family-construct'}?enquiry_id=$(encodeURIComponent{enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
            history.push(`${parseInt(company_data?.is_fresh_policy) === 0 ?
                '/previous-policy-detail' : '/upload-data-demography'}?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, enquiry_id])

    const onSubmit = (data) => {
        dispatch(saveCompanyData({
            is_fresh_policy: parseInt(data.is_fresh_policy) === 0 ? 1 : 0,
            step: 3,
            enquiry_id: id
        }));
        dispatch(set_company_data({
            is_fresh_policy: parseInt(data.is_fresh_policy) === 0 ? 1 : 0,
        }));
    }
    return (
        <>
            <Row>
                <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                    <BackBtn
                        url={`/company-details?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`}
                        style={{ outline: "none", border: "none", background: "none" }}>
                        <img
                            src="/assets/images/icon/Group-7347.png"
                            alt="bck"
                            height="45"
                            width="45"
                        />
                    </BackBtn>
                    <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Is this the first time your company would<br /> have a health insurance plan?</h1>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ padding: '0px 15px' }}>
                    <Cols md={12} lg={7} xl={7} sm={12}>
                        <ToggleCard
                            data={[
                                {
                                    imgSrc: "/assets/images/RFQ/first-time.png",
                                    content: "we're buying for the first time",
                                    title: "Yes",
                                    id: 0,
                                    titleColor: { color: '#0056ff' }
                                },
                                {
                                    imgSrc: "/assets/images/RFQ/renew.png",
                                    content: "we're renewing the policy",
                                    title: "No",
                                    id: 1,
                                    titleColor: { color: '#f95656' }
                                },
                            ]}
                            contentStyle={{
                                fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                                fontWeight: "600",
                                color: "black",
                                marginTop: "-5px",
                            }}
                            titleDivStyle={{
                                margin: '21px 0 11px',
                            }}
                            inputName="is_fresh_policy"
                            inputRef={register}
                            setVal={setValue}
                            watch={watch}
                            padding='10px'
                            height='auto'
                        ></ToggleCard>
                        <Col
                            sm="12"
                            md="12"
                            lg="12"
                            xl="12"
                            className="mt-4 pt-4 pb-5"
                        >
                            <RFQButton>
                                Next
                                <i className="fa fa-long-arrow-right" aria-hidden="true" />
                            </RFQButton>
                        </Col>
                    </Cols>
                    <Col md={12} lg={5} xl={5} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <RFQcard
                            title="Already have health insurance?"
                            content="give us a try! Guaranteed best rates and a top notch support"
                            imgSrc="/assets/images/RFQ/lightbulb@2x.png"
                        />
                    </Col>
                </Row>
            </Form>
            {(loading || success) && <Loader />}
        </>
    );
};

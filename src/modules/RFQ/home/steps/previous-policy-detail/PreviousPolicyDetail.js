import React, { useEffect } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import { Error, RFQButton, RFQcard, Loader } from "../../../../../components";
import { Input } from "../../../components";
import { numOnly, noSpecial } from 'utils';
import * as yup from "yup";

import { BackBtn } from '../button'

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import { clear, set_company_data, saveCompanyData } from '../../home.slice';
import { doesHasIdParam } from '../../home';

const FormStructure = [
  { label: 'Insurance Company', name: 'previous_ic_name', type: 'text', maxLength: '50' },
  { label: 'TPA', name: 'pervious_policy_tpa_name', type: 'text', maxLength: '50' },
  { label: 'Lives at Inception', name: 'lives_at_inception', type: 'tel', maxLength: '8' },
  { label: 'Active Lives', name: 'previous_active_lives', type: 'tel', maxLength: '8' },
  { label: 'Total Cover', name: 'previous_total_cover', type: 'tel', maxLength: '9' },
  { label: 'Claim Amount', name: 'previous_claim_amount', type: 'tel', maxLength: '9' },
  { label: 'Claim Ratio %', name: 'previous_claim_ratio', type: 'tel', maxLength: '3' },
  { label: 'Claim Paid Count', name: 'pervious_paid_claim_count', type: 'tel', maxLength: '9' },
  { label: 'Claim Outstanding Count', name: 'pervious_outstanding_claim_count', type: 'tel', maxLength: '9' },
  { label: 'Policy No', name: 'pervious_policy_number', type: 'text', maxLength: '50' },
  { label: 'Policy Start Date', name: 'previous_policy_start_date', type: 'date' },
  { label: 'Policy Expiry Date', name: 'previous_policy_expiry_date', type: 'date' },
]
const validationSchema = yup.object().shape(
  FormStructure.reduce((prev, { label, name }) =>
    ({ ...prev, [name]: yup.string().required().label(label) }), {}));

export const PreviousPolicyDetail = ({ utm_source }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { success, loading, company_data } = useSelector(state => state.RFQHome);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const brokerId = query.get("broker_id");
  const insurerId = query.get("insurer_id");
  const enquiry_id = decodeURIComponent(query.get("enquiry_id"));
  const { globalTheme } = useSelector(state => state.theme)

  const { handleSubmit, register, errors, reset, watch, setValue } = useForm({
    defaultValues: {
      previous_ic_name: company_data?.previous_ic_name,
      lives_at_inception: company_data?.lives_at_inception,
      previous_active_lives: company_data?.previous_active_lives,
      previous_total_cover: company_data?.previous_total_cover,
      previous_claim_ratio: company_data?.previous_claim_ratio,
      previous_claim_amount: company_data?.previous_claim_amount,
      previous_policy_expiry_date: company_data?.previous_policy_expiry_date,
      pervious_policy_tpa_name: company_data?.pervious_policy_tpa_name,
      pervious_paid_claim_count: company_data?.pervious_paid_claim_count,
      pervious_outstanding_claim_count: company_data?.pervious_outstanding_claim_count,
      pervious_policy_number: company_data?.pervious_policy_number,
      previous_policy_start_date: company_data?.previous_policy_start_date,
    },
    validationSchema,
    mode: "onBlur",
    reValidateMode: "onBlur"
  });

  let _claimAmount = watch('previous_claim_amount')
  let _totalCover = watch('previous_total_cover')

  useEffect(() => {
    if (_claimAmount?.length && _totalCover?.length) {
      let _ratio = Math.round((_claimAmount * 100 / _totalCover) * 100)
      setValue('previous_claim_ratio', _ratio)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_claimAmount, _totalCover])

  useEffect(() => {
    if (company_data?.previous_ic_name) {
      reset({
        previous_ic_name: company_data?.previous_ic_name,
        lives_at_inception: company_data?.lives_at_inception,
        previous_active_lives: company_data?.previous_active_lives,
        previous_total_cover: company_data?.previous_total_cover,
        previous_claim_ratio: company_data?.previous_claim_ratio,
        previous_claim_amount: company_data?.previous_claim_amount,
        previous_policy_expiry_date: company_data?.previous_policy_expiry_date,
        pervious_policy_tpa_name: company_data?.pervious_policy_tpa_name,
        pervious_paid_claim_count: company_data?.pervious_paid_claim_count,
        pervious_outstanding_claim_count: company_data?.pervious_outstanding_claim_count,
        pervious_policy_number: company_data?.pervious_policy_number,
        previous_policy_start_date: company_data?.previous_policy_start_date,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company_data])


  // redirect
  useEffect(() => {
    if (success && (enquiry_id)) {
      history.push(`/upload-data-demography?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`)
    }
    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, enquiry_id])


  const onSubmit = (data) => {
    dispatch(saveCompanyData({
      ...data,
      // ...giveProperId({ brokerId, insurerId }),
      step: 18,
      enquiry_id
    }));
    dispatch(set_company_data({ ...data }));
    //setOTPModal(true)
  }
  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
          <BackBtn url={`/policy-renewal?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`} style={{ outline: "none", border: "none", background: "none" }}>
            <img
              src="/assets/images/icon/Group-7347.png"
              alt="bck"
              height="45"
              width="45"
            />
          </BackBtn>
          <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Tell us about your previous year policy detail</h1>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row style={{ padding: '0px 15px' }}>
          <Col md={12} lg={7} xl={7} sm={12}>
            <Row>
              {FormStructure.map(({ name, type, label, maxLength },i) => (
                <Col md={12} lg={6} xl={6} sm={12} className='mb-3' key={name+i}>
                  <Input
                    label={label}
                    name={name}
                    id={name}
                    maxLength={maxLength}
                    placeholder={"Enter " + label}
                    autoComplete="none"
                    type={type}
                    inputRef={register}
                    {...(type === 'tel' ? { onKeyDown: numOnly, onKeyPress: noSpecial } : {})}
                    defaultValue={""}
                    isRequired={true}
                    required={false}
                    error={errors[name]}
                    disabled={name === "previous_claim_ratio" ? true : false}
                    style={{ background: name === "previous_claim_ratio" && '#e0e0e0' }}
                  />
                  {!!errors[name] && <Error className="mt-0">{errors[name]?.message}</Error>}
                </Col>
              ))}

              <Col
                sm="12"
                md="12"
                lg="12"
                xl="12"
                className="mt-4 mb-5"
              >
                <RFQButton>
                  Next
                  <i className="fa fa-long-arrow-right" aria-hidden="true" />
                </RFQButton>
              </Col>
            </Row>
          </Col>
          <Col md={12} lg={5} xl={5} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <RFQcard title="Get tailored pricing"
              content="We use this info to find a plan that is tailored for your company. having your email id let us send you a detailed quotes"
              imgSrc="/assets/images/RFQ/lightbulb@2x.png"
              cardStyle={{ height: '282px' }} />
          </Col>
        </Row>
      </Form>

      {(loading || success) && <Loader />}
    </>
  )
}

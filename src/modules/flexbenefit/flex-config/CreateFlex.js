import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import swal from 'sweetalert';
import * as yup from "yup";

import { Accordion, AccordionContext, Col, Row, useAccordionToggle } from 'react-bootstrap';
import { Button, Error, IconlessCard, Input, Loader, Marker, RFQButton, SelectComponent, Typography } from '../../../components';
import { StyledButton } from '../../RFQ/data-upload/style';
import { TextInput } from '../../RFQ/plan-configuration/style';
import { BenefitModal } from './BenefitModal';useForm
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";

import { loadPolicies, loadPolicyData, loadPolicyTypes, submitFlex } from './flex-config.action';
import { HeaderDiv, refillRelations, sortRelation, StyledTable, TitleDiv, Wrapper } from './helper';
import { Controller,  } from 'react-hook-form';
import { Switch } from '../../user-management/AssignRole/switch/switch';
import { useHistory } from 'react-router';
import { Prefill } from '../../../custom-hooks/prefill';
import { CustomCheck } from '../../policies/approve-policy/style';
import { MemberFeatureModal } from './MemberFeatureModal';
import { CoverType, PremiumType } from '../../policies/steps/additional-details/additional-cover';
import { useSelector } from 'react-redux';

export const ContextAwareToggle = ({ eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );
  const isCurrentEventKey = currentEventKey === eventKey;
  return (
    <StyledButton
      color='#60c385;'
      variant="link"
      className="open-button"
      onClick={decoratedOnClick}
      relative={'relative'}>
      {isCurrentEventKey ? (<i className="fal accordian-btn-icon fa-minus"></i>) :
        (<i className="fal accordian-btn-icon fa-plus"></i>
        )}
    </StyledButton>
  );
};

const validationSchema = (policy_data) => yup.object().shape({
  employer_id: yup.object().shape({
    id: yup.string().required('Corporate Required')
  }),
  policy_type_id: yup.object().shape({
    id: yup.string().required('Policy Type Required'),
  }),
  policy_id: yup.object().shape({
    id: yup.string().required('Policy Name Required'),
  }),
  ...policy_data?.grades?.length && {
    grade: yup.array().of(yup.object().shape({
      id: yup.string().required('Grade Required'),
    })).required('Grade Required')
  },
  ...policy_data?.designations?.length && {
    designation: yup.array().of(yup.object().shape({
      id: yup.string().required('Designation Required'),
    })).required('Designation Required')
  },
  ...policy_data?.ageBands?.length && {
    age_band: yup.array().of(yup.object().shape({
      id: yup.string().required('Age Band Required'),
    })).required('Age Band Required')
  },
  ...policy_data?.states?.length && {
    state: yup.array().of(yup.object().shape({
      id: yup.string().required('States Required'),
    })).required('States Required')
  },
  ...policy_data?.suminsureds?.length && {
    sum_insureds: yup.array().of(yup.object().shape({
      id: yup.string().required('Sum Insured Required'),
    })).required('Sum Insured Required')
  },
  plan_name: yup.string()
    .matches(/^[a-zA-Z0-9-/\s]+$/, {
      message: 'Alphanumeric characters, hyphen(-) & frontslash(/) only',
      excludeEmptyString: true,
    })
    .required('Plan Name Required'),
});

export function CreateFlex({
  flex_id, flex_detail, benefit_master,
  loading, setPage, employers,
  dispatch, currentUser, userTypeName,
  policies, policy_types, policy_data }) {

  const { globalTheme } = useSelector(state => state.theme)

  const history = useHistory();

  const { control, errors, handleSubmit, watch, setValue, reset } = useForm({
    validationSchema: validationSchema(policy_data)
  })
  const planDescription = watch('plan_description') || '';
  const is_relation_wise_calculation_applicable = watch('is_relation_wise_calculation_applicable');
  const will_initial_premium_be_paid_by_employer = watch('will_initial_premium_be_paid_by_employer');
  const [benefitModal, setBenefitModal] = useState(false);
  const [memberFeatureModal, setMemberFeatureModal] = useState(false);
  const [benefits_covered, set_benefits_covered] = useState([])
  const [deleted_benefit_ids, set_deleted_benefit_ids] = useState([])
  const [deleted_feature_ids, set_deleted_feature_ids] = useState([])
  const [deleted_relation_wise_calculation_ids, set_deleted_relation_wise_calculation_ids] = useState([])
  const [benefits_not_covered, set_benefits_not_covered] = useState([])
  const [member_feature, set_member_feature] = useState([])

  const filteredRelation = sortRelation(policy_data?.policy_relations?.filter(id => +id !== 1) || []);

  const employer_id = watch('employer_id')?.value;
  const policy_type_id = watch('policy_type_id')?.value;
  const policy_id = watch('policy_id')?.value;

  // covered 
  const benefit_name_temp = watch('benefit_name_temp');
  const benefit_description_temp = watch('benefit_description_temp');

  // not-covered 
  const benefit_name_temp_not_covered = watch('benefit_name_temp_not_covered');
  const benefit_description_temp_not_covered = watch('benefit_description_temp_not_covered');

  // member feature
  const member_feature_description = watch('member_feature_description');

  // api for policy subtype --------
  useEffect(() => {
    if (employer_id) {
      const data = { employer_id: employer_id };
      setValue([{ policy_type_id: undefined }, { policy_id: undefined }])
      loadPolicyTypes(dispatch, data);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer_id]);

  // api for policy subtype --------
  useEffect(() => {
    if (employer_id && policy_type_id) {
      setValue([{ policy_id: undefined }])
      const data = {
        ...(currentUser?.broker_id && { broker_id: currentUser?.broker_id }),
        employer_id: employer_id || currentUser?.employer_id,
        policy_sub_type_id: policy_type_id,
        user_type_name: userTypeName
      };
      loadPolicies(dispatch, data);
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          policy_data: {},
          loading: false
        }
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_type_id, currentUser]);

  useEffect(() => {
    if (policy_id) {
      loadPolicyData(dispatch, { policy_id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_id])


  useEffect(() => {
    if (flex_detail.id) {
      const data1 = { employer_id: flex_detail.employer_id };
      loadPolicyTypes(dispatch, data1);

      const data2 = {
        ...(currentUser?.broker_id && { broker_id: currentUser?.broker_id }),
        employer_id: flex_detail.employer_id,
        policy_sub_type_id: flex_detail.product_id,
        user_type_name: userTypeName
      };
      loadPolicies(dispatch, data2);

      loadPolicyData(dispatch, { policy_id: flex_detail.policy_id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flex_detail])

  useEffect(() => {
    if (flex_detail.id && policy_data.id && policy_data.id === flex_detail.policy_id) {
      reset({
        employer_id: { id: flex_detail.employer_id, value: flex_detail.employer_id, label: flex_detail.employer_name },
        policy_type_id: { id: flex_detail.product_id, value: flex_detail.product_id, label: flex_detail.product_type },
        policy_id: { id: flex_detail.policy_id, value: flex_detail.policy_id, label: flex_detail.policy_name + ' : ' + flex_detail.policy_number },
        plan_name: flex_detail.plan_name,
        ...flex_detail.plan_description && { plan_description: flex_detail.plan_description },
        ...flex_detail.flex_grades.length && { grade: flex_detail.flex_grades.map(({ grade }) => ({ id: grade, value: grade, label: grade })) },
        ...flex_detail.flex_designation.length && { designation: flex_detail.flex_designation.map(({ designation }) => ({ id: designation, value: designation, label: designation })) },
        ...flex_detail.flex_state.length && { state: flex_detail.flex_state.map(({ state }) => ({ id: state, value: state, label: state })) },
        ...flex_detail.flex_age_bands.length && { age_band: flex_detail.flex_age_bands.map(({ age_band }) => ({ id: age_band, value: age_band, label: age_band })) },
        ...flex_detail.flex_suminsured.length && { sum_insureds: flex_detail.flex_suminsured.map(({ sum_insured }) => ({ id: sum_insured, value: sum_insured, label: sum_insured })) },
        is_rollback_allowed: flex_detail.is_rollback_allowed,
        is_differnce_premium: flex_detail.is_differnce_premium,
        is_relation_wise_calculation_applicable: String(flex_detail.is_relation_wise_calculation_applicable || 0),
        will_initial_premium_be_paid_by_employer: String(flex_detail.will_initial_premium_be_paid_by_employer || 0)
      })
      set_benefits_covered(flex_detail.plan_benefits
        .map(({ benefit_description, benefit_feature_details, ...elem }) =>
        ({
          ...elem,
          features: benefit_feature_details,
          benefit_name: { label: elem.benefit_name, id: elem.product_feature_id, value: elem.product_feature_id },
          ...benefit_description && { benefit_description }
        })) || [])
      set_benefits_not_covered(flex_detail.uncovered_benefits
        .map(({ benefit_description, ...elem }) =>
        ({
          ...elem,
          benefit_name: { label: elem.benefit_name, id: elem.product_feature_id, value: elem.product_feature_id },
          ...benefit_description && { benefit_description }

        })) || [])
      set_member_feature(flex_detail.relation_wise_calculation
        .map(({ description, ...elem }) =>
        ({
          ...elem,
          relation: sortRelation(elem.relation_ids.map(Number) || []),
          ...description && { description }

        })) || [])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flex_detail, policy_data])

  // Prefill 
  Prefill(employers, setValue, 'employer_id')
  Prefill(policy_types, setValue, 'policy_type_id')
  Prefill(policies, setValue, 'policy_id', 'number')

  const onAddCountCovered = () => {
    if (benefits_covered?.length === 30) {
      return swal('Validation', 'Limit reached', 'info')
    }
    if (!benefit_name_temp) return swal('Validation', 'Benefit Name Required', 'info')


    setBenefitModal({
      benefit_name: { label: benefit_name_temp.label, id: benefit_name_temp.id, value: benefit_name_temp.id },
      product_feature_id: benefit_name_temp.id,
      benefit_description: benefit_description_temp
    })
  }

  const onSubCountCovered = (id) => {
    let BillCopy = _.cloneDeep(benefits_covered);
    const [removedBenefit] = BillCopy.splice(id, 1);
    if (removedBenefit.id) {
      set_deleted_benefit_ids(prev => [...prev, removedBenefit.id])
      removedBenefit.features.map(({ id }) => id && set_deleted_feature_ids(prev => [...prev, id]))
    }
    set_benefits_covered(BillCopy)
  }


  const onAddCountNotCovered = () => {
    if (benefits_not_covered?.length === 30) {
      return swal('Validation', 'Limit reached', 'info')
    }
    if (!benefit_name_temp_not_covered) return swal('Validation', 'Benefit Name Required', 'info')


    set_benefits_not_covered(prev => [...prev, {
      benefit_name: { label: benefit_name_temp_not_covered.label, id: benefit_name_temp_not_covered.id, value: benefit_name_temp_not_covered.id },
      benefit_description: benefit_description_temp_not_covered,
      product_feature_id: benefit_name_temp_not_covered.id,
    }])
    setValue([{ benefit_name_temp_not_covered: '' }, { benefit_description_temp_not_covered: '' }])
  }

  const onSubCountNotCovered = (id) => {
    let BillCopy = _.cloneDeep(benefits_not_covered);
    BillCopy.splice(id, 1);
    set_benefits_not_covered(BillCopy)
  }

  const onAddCountMemberFeature = () => {
    if (member_feature?.length === 30) {
      return swal('Validation', 'Limit reached', 'info')
    }
    if (!member_feature_description) return swal('Validation', 'Description Required', 'info')
    setMemberFeatureModal({
      description: member_feature_description
    })
  }

  const onSubCountMemberFeature = (id) => {
    let BillCopy = _.cloneDeep(member_feature);
    const [removedBenefit] = BillCopy.splice(id, 1);
    set_member_feature(BillCopy)
    if (removedBenefit.id) {
      set_deleted_relation_wise_calculation_ids(prev => [...prev, removedBenefit.id])
    }
  }


  const onSubmit = (data) => {
    submitFlex(dispatch, {
      ...flex_id && { flex_plan_id: flex_id },
      policy_id: data.policy_id.value,
      plan_name: data.plan_name,
      ...data.plan_description && { plan_description: data.plan_description },
      ...data.grade && { grades: data.grade.map(({ label }) => label) },
      ...data.designation && { designation: data.designation.map(({ label }) => label) },
      ...data.state && { state: data.state.map(({ label }) => label) },
      ...data.age_band && { age_band: data.age_band.map(({ label }) => label) },
      ...data.sum_insureds && { sum_insureds: data.sum_insureds.map(({ label }) => label) },
      is_rollback_allowed: data.is_rollback_allowed,
      is_differnce_premium: data.is_differnce_premium,
      ...benefits_covered.length && {
        benefits_covered: benefits_covered
          .map(({ mandatory_if_not_selected_benefit_ids, ...elem }) => ({
            ...elem,
            benefit_name: elem.benefit_name.label,
            ...mandatory_if_not_selected_benefit_ids?.length && { mandatory_if_not_selected_benefit_ids: mandatory_if_not_selected_benefit_ids.map(({ id }) => id) },
            features: elem.features
              .map(({ benefit_description, ...elem1 }) => ({ ...elem1, feature_id: elem1.id, ...benefit_description && { benefit_description } })),
            ...elem.id && { benefit_id: elem.id }
          }))
      },
      is_relation_wise_calculation_applicable: data.is_relation_wise_calculation_applicable || 0,
      ...member_feature.length && { relation_wise_calculation: member_feature.map(elem => ({ ...elem, relation: refillRelations(elem.relation) })) },
      ...benefits_not_covered.length && { benefits_not_covered: benefits_not_covered.map(elem => ({ ...elem, benefit_name: elem.benefit_name.label })) },
      ...deleted_benefit_ids.length && { deleted_benefit_ids },
      ...deleted_feature_ids.length && { deleted_feature_ids },
      ...deleted_relation_wise_calculation_ids.length && { deleted_relation_wise_calculation_ids },
      will_initial_premium_be_paid_by_employer: data.will_initial_premium_be_paid_by_employer || 0
    }, { setPage, history })
  }

  return (
    <>
      <IconlessCard isHeder={false} marginTop={'0'}>
        <HeaderDiv>
          <div className='d-flex'>
            <div className='icon'>
              <i className='ti ti-pencil-alt' />
            </div>
            <div>
              <p className='title'>{!!flex_id && 'Update'} Flex Configurator</p>
            </div>
          </div>
        </HeaderDiv>
        <hr style={{
          borderTop: '2px dashed rgba(0,0,0,.1)',
          margin: '-6px -38px 15px'
        }} />
        <Wrapper>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Plan Details */}
            <Accordion defaultActiveKey={1} style={{
              borderRadius: '15px',
              width: '100%',
              marginBottom: '15px',
              border: '0',
              outline: 'none'
            }}>
              <Accordion.Toggle
                eventKey={1} style={{
                  width: '100%',
                  border: 'none',
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  background: 'white',
                  padding: '10px',
                  outline: 'none'

                }} className='d-flex justify-content-between align-items-center'>
                <div className='text-left mr-3' style={{
                  fontWeight: '500',
                  fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
                  letterSpacing: '1px',
                  color: 'black'
                }}>
                  <TitleDiv>
                    <div className='icon'>
                      <i className='ti ti-clipboard' />
                    </div>
                    <div>
                      <p className='title'>Plan Details</p>
                    </div>
                  </TitleDiv>
                </div>
                <ContextAwareToggle eventKey={1} />
              </Accordion.Toggle>

              <Accordion.Collapse className='accordian-collapse' eventKey={1} >
                <>
                  <Row>
                    <Col xl={8} lg={8} md={12} sm={12}>

                      <Row>

                        <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="Corporate"
                                placeholder="Select Corporate"
                                required
                                options={employers.map(item => (
                                  {
                                    id: item.id,
                                    label: item.name,
                                    value: item.id
                                  }
                                ))}
                                error={errors && errors.employer_id}
                              />
                            }
                            control={control}
                            name="employer_id"
                          />
                          {!!errors.employer_id?.id && <Error>
                            {errors.employer_id?.id.message}
                          </Error>}
                        </Col>

                        <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="Policy Type"
                                placeholder="Select Policy Type"
                                required
                                options={policy_types.map(item => (
                                  {
                                    id: item.id,
                                    label: item.name,
                                    value: item.id
                                  }
                                ))}
                                error={errors && errors.policy_type_id}
                              />
                            }
                            control={control}
                            name="policy_type_id"
                          />
                          {!!errors.policy_type_id && <Error>
                            {errors.policy_type_id?.id.message}
                          </Error>}
                        </Col>


                        <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="Policy Name"
                                placeholder="Select Policy Name"
                                required
                                options={policies.map(item => (
                                  {
                                    id: item.id,
                                    label: item.number,
                                    value: item.id
                                  }
                                ))}
                                error={errors && errors.policy_id}
                              />
                            }
                            control={control}
                            name="policy_id"
                          />
                          {!!errors.policy_id && <Error>
                            {errors.policy_id?.id.message}
                          </Error>}
                        </Col>

                        {/* GRADE */}

                        {!!policy_data?.grades?.length && <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="Grade"
                                placeholder="Select Grade"
                                required
                                options={policy_data?.grades?.map(item => (
                                  {
                                    id: item,
                                    label: item,
                                    value: item
                                  }
                                ))}
                                error={errors && errors.grade}
                                isRequired={true}
                                multi={true}
                                closeMenuOnSelect={false}
                                closeMenuOnScroll={false}
                                hideSelectedOptions={true}
                                isClearable={false}
                              />
                            }
                            name="grade"
                            control={control}
                            error={errors && errors.grade}
                          />
                          {!!errors.grade && <Error>
                            {errors.grade.message}
                          </Error>}
                        </Col>}

                        {/* DESIGNATION */}
                        {!!policy_data?.designations?.length && <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="Designation"
                                placeholder="Select Designation"
                                required
                                options={policy_data?.designations?.map(item => (
                                  {
                                    id: item,
                                    label: item,
                                    value: item
                                  }
                                ))}
                                isRequired={true}
                                multi={true}
                                closeMenuOnSelect={false}
                                closeMenuOnScroll={false}
                                hideSelectedOptions={true}
                                isClearable={false}
                              />
                            }
                            name="designation"
                            control={control}
                            error={errors && errors.designation}
                          />
                          {!!errors.designation && <Error>
                            {errors.designation.message}
                          </Error>}
                        </Col>}

                        {/* AGEBAND */}
                        {!!policy_data?.ageBands?.length && <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="Age Band"
                                placeholder="Select Age Band"
                                required
                                options={policy_data?.ageBands?.map(item => (
                                  {
                                    id: item,
                                    label: item,
                                    value: item
                                  }
                                ))}
                                isRequired={true}
                                multi={true}
                                closeMenuOnSelect={false}
                                closeMenuOnScroll={false}
                                hideSelectedOptions={true}
                                isClearable={false}
                              />
                            }
                            name="age_band"
                            control={control}
                            error={errors && errors.age_band}
                          />
                          {!!errors.age_band && <Error>
                            {errors.age_band.message}
                          </Error>}
                        </Col>}

                        {/* STATES */}
                        {!!policy_data?.states?.length && <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="State"
                                placeholder="Select State"
                                required
                                options={policy_data?.states?.map(item => (
                                  {
                                    id: item,
                                    label: item,
                                    value: item
                                  }
                                ))}
                                isRequired={true}
                                multi={true}
                                closeMenuOnSelect={false}
                                closeMenuOnScroll={false}
                                hideSelectedOptions={true}
                                isClearable={false}
                              />
                            }
                            name="state"
                            control={control}
                            error={errors && errors.state}
                          />
                          {!!errors.state && <Error>
                            {errors.state.message}
                          </Error>}
                        </Col>}

                        {/* SUMINSURED */}
                        {!!policy_data?.suminsureds?.length && <Col xl={12} lg={12} md={12} sm={12}>
                          <Controller
                            as={
                              <SelectComponent
                                label="Sum Insured"
                                placeholder="Select Sum Insured"
                                required
                                options={policy_data?.suminsureds?.map(item => (
                                  {
                                    id: item,
                                    label: item,
                                    value: item
                                  }
                                ))}
                                isRequired={true}
                                multi={true}
                                closeMenuOnSelect={false}
                                closeMenuOnScroll={false}
                                hideSelectedOptions={true}
                                isClearable={false}
                              />
                            }
                            name="sum_insureds"
                            control={control}
                            error={errors && errors.sum_insureds}
                          />
                          {!!errors.sum_insureds && <Error>
                            {errors.sum_insureds.message}
                          </Error>}
                        </Col>}
                      </Row>
                      <Row>
                        <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={
                              <Input
                                label="Plan Name"
                                placeholder="Enter Plan Name"
                                isRequired
                                maxLength={40}
                                error={errors && errors.plan_name}
                              />
                            }
                            control={control}
                            name="plan_name"
                          />
                          {!!errors.plan_name && <Error>
                            {errors.plan_name.message}
                          </Error>}
                        </Col>
                        <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={<Switch />}
                            label="Roll Back Allowed"
                            name="is_rollback_allowed"
                            control={control}
                            defaultValue={0}
                            required
                          />
                        </Col>
                        <Col xl={4} lg={5} md={6} sm={12}>
                          <Controller
                            as={<Switch />}
                            label="Show Difference Premium"
                            name="is_differnce_premium"
                            control={control}
                            defaultValue={0}
                            required
                          />
                        </Col>
                      </Row>
                      <Row className='mt-3 mb-3'>
                        <Col md={12} lg={10} xl={12} sm={12}>
                          <div style={
                            {
                              position: 'absolute',
                              right: '15px',
                              top: '-20px',
                              background: '#e2e2e2',
                              padding: '0px 5px',
                              borderRadius: '3px'
                            }
                          }>
                            {`${planDescription.length} / 2000`}
                          </div>
                          <Controller
                            as={<TextInput
                              maxLength={2000}
                              className='form-control'
                              placeholder='Enter Content Here...'
                            />}
                            name='plan_description'
                            control={control}
                            error={errors && errors.plan_description}
                          />
                          <label className='form-label'>
                            <span className='span-label'>Plan Description</span>
                          </label>
                          {!!errors.plan_description && <Error top='0'>
                            {errors.plan_description.message}
                          </Error>}
                        </Col>
                      </Row>

                    </Col>
                    <Col
                      md={12}
                      lg={4}
                      xl={4}
                      sm={12}
                      className="d-flex flex-wrap justify-content-center align-items-center image_final"
                    >
                      <img src="/assets/images/idea.jpg" alt="Done" />
                    </Col>
                  </Row>
                </>
              </Accordion.Collapse>

            </Accordion>

            {/* Add On's */}
            <Accordion defaultActiveKey={1} style={{
              borderRadius: '15px',
              width: '100%',
              marginBottom: '15px',
              border: '0',
              outline: 'none'
            }}>
              <Accordion.Toggle
                eventKey={1} style={{
                  width: '100%',
                  border: 'none',
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  background: 'white',
                  padding: '10px',
                  outline: 'none'

                }} className='d-flex justify-content-between align-items-center'>
                <div className='text-left mr-3' style={{
                  fontWeight: '500',
                  fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
                  letterSpacing: '1px',
                  color: 'black'
                }}>
                  <TitleDiv>
                    <div className='icon'>
                      <i className='ti ti-layout-grid2' />
                    </div>
                    <div>
                      <p className='title'>Add On's</p>
                    </div>
                  </TitleDiv>
                  {/* {'Plan Details'} */}
                </div>
                <ContextAwareToggle eventKey={1} />
              </Accordion.Toggle>
              <Accordion.Collapse className='accordian-collapse' eventKey={1} >
                <>
                  <Row className='mb-3'>

                    <Col xl={4} lg={4} md={12} sm={12}>
                      <Controller
                        as={
                          <SelectComponent
                            label="Benefit Name"
                            placeholder="Select Benefit Name"
                            required
                            options={benefit_master.filter(({ id }) => [...benefits_covered, ...benefits_not_covered].every(({ product_feature_id }) => Number(product_feature_id) !== id)).map(item => (
                              {
                                id: item.id,
                                label: item.name,
                                value: item.id
                              }
                            ))}
                            error={errors && errors.benefit_name_temp}
                          />
                        }
                        control={control}
                        name="benefit_name_temp"
                      />
                      {!!errors.benefit_name_temp && <Error>
                        {errors.benefit_name_temp.message}
                      </Error>}
                    </Col>
                    <Col xl={6} lg={6} md={12} sm={12}>
                      <Controller
                        as={
                          <Input
                            label="Benefit Description"
                            placeholder="Enter Benefit Description"
                            maxLength={300}
                            error={errors && errors.benefit_description_temp}
                          />
                        }
                        control={control}
                        name="benefit_description_temp"
                      />
                      {!!errors.benefit_description_temp && <Error>
                        {errors.benefit_description_temp.message}
                      </Error>}
                    </Col>
                    <Col xl={2} lg={2} md={12} sm={12} className='m-auto p-0 text-center'>
                      <RFQButton onClick={onAddCountCovered} type='button' fontSize='13.5px' width='150px' height='48px' >
                        Benefit Details +
                      </RFQButton></Col>
                  </Row>

                  {!!benefits_covered?.length && <Row className="align-items-center">
                    <Col
                      className='benefit'
                      md={12}
                      lg={12}
                      xl={12}
                      sm={12}
                    >
                      <StyledTable bordered={false} className="text-center rounded text-nowrap" responsive>
                        <thead>
                          <tr>
                            <th>Benefit Name</th>
                            <th></th>
                            <th>Benefit Description</th>
                            <th></th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {benefits_covered?.map(({ benefit_name, benefit_description }, index) =>
                            <tr key={index + 'feature'} className='parent_feature'>
                              <td >{benefit_name.label || ''}</td>
                              <td colSpan={3}>{benefit_description || ''}</td>
                              <td><div className='icon'>
                                <i className="ti-pencil text-primary" onClick={() => setBenefitModal({ ...benefits_covered[index], i: index })}></i>
                                <i className="ti-trash text-danger" onClick={() => onSubCountCovered(index)}></i>
                              </div></td>
                            </tr>
                          )}
                        </tbody>
                      </StyledTable>

                    </Col>
                  </Row>}
                </>
              </Accordion.Collapse>
            </Accordion>

            {/* What's not covered */}
            <Accordion defaultActiveKey={1} style={{
              borderRadius: '15px',
              width: '100%',
              marginBottom: '15px',
              border: '0',
              outline: 'none'
            }}>
              <Accordion.Toggle
                eventKey={1} style={{
                  width: '100%',
                  border: 'none',
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  background: 'white',
                  padding: '10px',
                  outline: 'none'

                }} className='d-flex justify-content-between align-items-center'>
                <div className='text-left mr-3' style={{
                  fontWeight: '500',
                  fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
                  letterSpacing: '1px',
                  color: 'black'
                }}>
                  <TitleDiv>
                    <div className='icon'>
                      <i className='ti ti-agenda' />
                    </div>
                    <div>
                      <p className='title'>What's not covered</p>
                    </div>
                  </TitleDiv>
                </div>
                <ContextAwareToggle eventKey={1} />
              </Accordion.Toggle>
              <Accordion.Collapse className='accordian-collapse' eventKey={1} >
                <>
                  <Row className='mb-3'>
                    <Col xl={4} lg={4} md={12} sm={12}>
                      <Controller
                        as={
                          <SelectComponent
                            label="Benefit Name"
                            placeholder="Select Benefit Name"
                            required
                            options={benefit_master.filter(({ id }) => [...benefits_covered, ...benefits_not_covered].every(({ product_feature_id }) => Number(product_feature_id) !== id)).map(item => (
                              {
                                id: item.id,
                                label: item.name,
                                value: item.id
                              }
                            ))}
                            error={errors && errors.benefit_name_temp_not_covered}
                          />
                        }
                        control={control}
                        name="benefit_name_temp_not_covered"
                      />
                      {!!errors.benefit_name_temp_not_covered && <Error>
                        {errors.benefit_name_temp_not_covered.message}
                      </Error>}
                    </Col>
                    <Col xl={6} lg={6} md={12} sm={12}>
                      <Controller
                        as={
                          <Input
                            label="Benefit Description"
                            placeholder="Enter Benefit Description"
                            required={false}
                            maxLength={300}
                            error={errors && errors.benefit_description_temp_not_covered}
                          />
                        }
                        control={control}
                        name="benefit_description_temp_not_covered"
                      />
                      {!!errors.benefit_description_temp_not_covered && <Error>
                        {errors.benefit_description_temp_not_covered.message}
                      </Error>}
                    </Col>
                    <Col xl={2} lg={2} md={12} sm={12} className='m-auto p-0 text-center'>
                      <RFQButton onClick={onAddCountNotCovered} type='button' fontSize='13.5px' width='150px' height='48px' >
                        Add +
                      </RFQButton></Col>
                  </Row>

                  {!!benefits_not_covered?.length && <Row className="align-items-center">
                    <Col
                      className='benefit'
                      md={12}
                      lg={12}
                      xl={12}
                      sm={12}
                    >
                      <StyledTable bordered={false} className="text-center rounded text-nowrap" responsive>
                        <thead>
                          <tr>
                            <th>Benefit Name</th>
                            <th></th>
                            <th>Benefit Description</th>
                            <th></th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {benefits_not_covered?.map(({ benefit_name, benefit_description }, index) =>
                            <tr key={index + 'feature'} className='parent_feature'>
                              <td>{benefit_name.label || ''}</td>
                              <td colSpan={3}>{benefit_description || ''}</td>
                              <td><div className='icon'>
                                <i className="ti-pencil text-primary" onClick={() => setBenefitModal({ ...benefits_not_covered[index], i: index, is_not_covered: true })}></i>
                                <i className="ti-trash text-danger" onClick={() => onSubCountNotCovered(index)}></i>
                              </div></td>
                            </tr>
                          )}
                        </tbody>
                      </StyledTable>

                    </Col>
                  </Row>}
                </>
              </Accordion.Collapse>
            </Accordion>

            {/* Additional Features */}
            <Accordion defaultActiveKey={1} style={{
              borderRadius: '15px',
              width: '100%',
              marginBottom: '15px',
              border: '0',
              outline: 'none'
            }}>
              <Accordion.Toggle
                eventKey={1} style={{
                  width: '100%',
                  border: 'none',
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  background: 'white',
                  padding: '10px',
                  outline: 'none'

                }} className='d-flex justify-content-between align-items-center'>
                <div className='text-left mr-3' style={{
                  fontWeight: '500',
                  fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
                  letterSpacing: '1px',
                  color: 'black'
                }}>
                  <TitleDiv>
                    <div className='icon'>
                      <i className='ti ti-blackboard' />
                    </div>
                    <div>
                      <p className='title'>Additional Features</p>
                    </div>
                  </TitleDiv>
                </div>
                <ContextAwareToggle eventKey={1} />
              </Accordion.Toggle>
              <Accordion.Collapse className='accordian-collapse' eventKey={1} >
                <>
                  <Row className='mb-3'>
                    <Col xl={12} lg={12} md={12} sm={12}>
                      <TextCard minWidth={'initial'} className="pl-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">

                        <Marker />
                        <Typography>
                          {"\u00A0"} Premium Credit/Debit based on Member Addition/Deletion
                        </Typography>
                        <br />

                        <CustomCheck className="custom-control-checkbox">
                          <label className="custom-control-label-check  container-check">
                            <span >{'Will there be any premium credit/debit based on member addition/deletion?'}</span>
                            <Controller
                              as={
                                <input
                                  name={'is_relation_wise_calculation_applicable'}
                                  type="checkbox"
                                  checked={!!Number(is_relation_wise_calculation_applicable)}
                                // defaultChecked={!!(flex_detail.is_relation_wise_calculation_applicable || 0)}
                                />
                              }
                              name={'is_relation_wise_calculation_applicable'}
                              onChange={([e]) => e.target.checked ? 1 : 0}
                              control={control}
                            />
                            <span className="checkmark-check"></span>
                          </label>
                        </CustomCheck>
                        {!!Number(is_relation_wise_calculation_applicable) && <Row>


                          <Col xl={10} lg={10} md={12} sm={12}>
                            <Controller
                              as={
                                <Input
                                  label="Feature Description"
                                  placeholder="Enter Feature Description"
                                  maxLength={300}
                                  labelProps={{ background: "#f8f8f8" }}
                                  error={errors && errors.member_feature_description}
                                />
                              }
                              control={control}
                              name="member_feature_description"
                            />
                            {!!errors.member_feature_description && <Error>
                              {errors.member_feature_description.message}
                            </Error>}
                          </Col>
                          <Col xl={2} lg={2} md={12} sm={12} className='m-auto p-0 text-center'>
                            <RFQButton onClick={onAddCountMemberFeature} type='button' fontSize='13.5px' width='150px' height='48px' >
                              Feature Details +
                            </RFQButton>
                          </Col>
                        </Row>}

                        {!!member_feature?.length && <Row className="align-items-center m-2">
                          <Col
                            className='benefit'
                            md={12}
                            lg={12}
                            xl={12}
                            sm={12}
                          >
                            <StyledTable bordered={false} headBorder className="text-center rounded text-nowrap" responsive>
                              <thead>
                                <tr>
                                  <th>Feature Description</th>
                                  <th>Relations</th>
                                  <th>Sum Insured</th>
                                  <th>Sum Insured Type</th>
                                  <th>Premium</th>
                                  <th>Premium Type</th>
                                  <th>Is Optional</th>
                                  {/* <th></th> */}
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {member_feature?.map(({ relation = [], premium, premium_type, description, cover, cover_type, is_optional }, index) =>
                                  <tr key={index + 'feature'} className='parent_feature'>
                                    <td >{description || '-'}</td>
                                    <td>{relation.reduce((total, { label }) => !total ? label : `${total}, ${label}`, '') || ''}</td>
                                    <td>{cover || '-'}</td>
                                    <td>{CoverType.find(({ id }) => +cover_type === id)?.name || ''}</td>
                                    <td>{premium || ''}</td>
                                    <td>{PremiumType.find(({ id }) => +premium_type === id)?.name || ''}</td>
                                    <td>{+is_optional === 1 ? 'Yes' : 'No'}</td>
                                    <td><div className='icon'>
                                      <i className="ti-pencil text-primary" onClick={() => setMemberFeatureModal({ ...member_feature[index], i: index })}></i>
                                      <i className="ti-trash text-danger" onClick={() => onSubCountMemberFeature(index)}></i>
                                    </div></td>
                                  </tr>
                                )}
                              </tbody>
                            </StyledTable>

                          </Col>
                        </Row>}
                      </TextCard>

                    </Col>

                    <Col xl={12} lg={12} md={12} sm={12}>
                      <TextCard className="pl-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
                        <Marker />
                        <Typography>
                          {"\u00A0"} Intial Premium will be paid by employer
                        </Typography>
                        <br />
                        <CustomCheck className="custom-control-checkbox">
                          <label className="custom-control-label-check  container-check">
                            <span >{'Will intial premium will be paid by employer?'}</span>
                            <Controller
                              as={
                                <input
                                  name={'will_initial_premium_be_paid_by_employer'}
                                  type="checkbox"
                                  checked={!!Number(will_initial_premium_be_paid_by_employer)}
                                // defaultChecked={!!(flex_detail.will_initial_premium_be_paid_by_employer || 0)}
                                />
                              }
                              name={'will_initial_premium_be_paid_by_employer'}
                              onChange={([e]) => e.target.checked ? 1 : 0}
                              control={control}
                            />
                            <span className="checkmark-check"></span>
                          </label>
                        </CustomCheck>
                      </TextCard>

                    </Col>

                  </Row>


                </>
              </Accordion.Collapse>
            </Accordion>

            <Row>
              <Col className='d-flex justify-content-end'>
                <Button type='button' onClick={() => flex_id ? history.replace('/broker/policy-flex-config') : setPage('list')} buttonStyle='danger' >Cancel</Button>
                <Button type='submit'>{flex_id ? 'Update' : 'Submit'}</Button></Col>
            </Row>
          </form>
        </Wrapper>
      </IconlessCard>
      {
        !!benefitModal && <BenefitModal
          set_deleted_feature_ids={set_deleted_feature_ids}
          setPlanData={!benefitModal.is_not_covered ? set_benefits_covered : set_benefits_not_covered}
          // planData={!benefitModal.is_not_covered ? benefits_covered : benefits_not_covered}
          benefit_master={benefit_master}
          benefits_covered={benefits_covered}
          benefits_not_covered={benefits_not_covered}
          setValueParent={setValue}
          show={benefitModal} onHide={setBenefitModal}
        />
      }
      {
        !!memberFeatureModal && <MemberFeatureModal
          setPlanData={set_member_feature}
          setValueParent={setValue}
          show={memberFeatureModal} onHide={setMemberFeatureModal}
          filteredRelation={filteredRelation}
        />
      }
      {loading && <Loader />}
    </>
  )
}

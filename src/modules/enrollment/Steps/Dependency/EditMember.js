import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { subDays } from 'date-fns'

import { Modal, Row, Col } from 'react-bootstrap';
import {
  Button, Input, Error, Head, Select,
  Marker, Typography, TabWrapper, Tab
} from 'components'
import { useForm, Controller } from "react-hook-form";
import { InputWrapper } from 'modules/policies/steps/additional-details/styles';
import { AttachFile, AttachFile2 } from 'modules/core'
import { Label } from '../../style';
// import Select from "modules/user-management/Onboard/Select/Select";

import { useDispatch, useSelector } from 'react-redux';
import { formatDate, filterGender } from '../../enrollment.help';
import { addMember } from '../../enrollment.slice';
import { numOnly, noSpecial } from "utils";
import { AnchorTag } from '../../../EndorsementRequest/style';
import { downloadFile } from '../../../../utils';
// import { addTopup } from '../../NewDesignComponents/enrolment.action';
import { shouldAskforSpecialChild, shouldShowSI } from '../../NewDesignComponents/SecondStep';
import { common_module } from 'config/validations';
import { ModuleControl } from '../../../../config/module-control';
const validation = common_module.user;

const Gender = {
  Male: 1,
  Female: 2,
  Other: 3,
};

export const EditMember = ({
  show, onHide,
  Data, flex = {},
  policy_id, relations = [{}],
  member_option = [],
  midTerm,
  type,
  topup = [] }) => {

  //const [specialMember, setSpecialMember] = useState(0);
  const [employee_relation, setEmployee_relation] = useState('');
  const { globalTheme } = useSelector(state => state.theme)
  const isSelf = Data?.relation_id === 1;
  const [deductible, setDeductible] = useState(flex?.has_payroll ? 'S' : flex?.has_wallet ? 'F' : 'S');
  const validationSchema = yup.object().shape({
    member_firstname: yup.string().test('alphabets', 'Name must contain only alphabets', (value) => {
      return /^([A-Za-z\s])+$/.test(value?.trim());
    }).required('First Name required'),
    member_lastname: yup.string().matches(/^([A-Za-z\s])+$/, { message: 'Name must contain only alphabets', excludeEmptyString: true })
      .notRequired().nullable(),
    member_dob: yup.string().required('DOB required'),
    member_gender: yup.string().required('Gender required'),
    member_contact_no: yup.string()
      .notRequired().nullable()
      .matches(validation.contact.regex, { message: "Not valid number", excludeEmptyString: true })
      // .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
    member_email: yup.string().notRequired().nullable(true).email('must be a valid email'),
    ...((employee_relation === "2" && midTerm) && { member_marriage_date: yup.string().required('Marriage Date required') })
  });
  const suminsureds = (flex?.suminsured && flex?.suminsured?.split(',').map((elem) => ({ name: elem, id: elem }))) || [];
  const premiums = (flex?.premium && flex?.premium?.split(',').map((elem) => ({ name: elem, id: elem }))) || [];

  const suminsureds_opd = (flex?.opd_suminsured && flex?.opd_suminsured?.split(',').map((elem) => ({ name: elem, id: elem, value: elem }))) || [];
  const premiums_opd = (flex?.opd_premium && flex?.opd_premium?.split(',').map((elem) => ({ name: elem, id: elem }))) || [];

  const { control, errors, setValue, reset, handleSubmit, watch, register } = useForm({
    defaultValues: {
      member_firstname: Data?.first_name,
      member_lastname: Data?.last_name,
      member_gender: Gender[Data?.gender],
      member_dob: Data?.dob,
      member_contact_no: Data?.mobile_no || '',
      member_email: Data?.email,
      member_marriage_date: Data?.marriage_date,
      disabled_child: Data?.is_disabled_child,
      sum_insured: Data?.suminsured,
      sum_insured_opd: Data?.opd_suminsured,
      is_adopted_child: Data?.is_adopted_child,
      ...Data?.number_of_time_salary && {
        number_of_time_salary: Number(Data?.number_of_time_salary)
      },
      employee_annual_salary: Data?.annual_salary,
      employee_designation: Data?.designation,
    },
    validationSchema
  });
  const dispatch = useDispatch();
  const [specialMemberImg, setSpecialMemberImg] = useState(0);
  const [specialFile, setSpecialFile] = useState(null);

  const contribution = employee_relation ? relations.find(({ id }) => Number(employee_relation) === id) : {};

  useEffect(() => {
    if (member_option.length > 0) {
      const self = member_option.find(({ relation_id }) => relation_id === 1);
      setValue('employee_designation', self?.employee_designation);
      setValue('employee_annual_salary', self?.employee_annual_salary);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member_option])

  useEffect(() => {
    if (Data) {
      reset({
        member_relation_id: Number(Data?.relation_id) || "",
        member_firstname: Data?.first_name,
        member_lastname: Data?.last_name,
        member_gender: Gender[Data?.gender],
        member_dob: Data?.dob,
        member_contact_no: Data?.mobile_no || '',
        member_email: Data?.email,
        member_marriage_date: Data?.marriage_date,
        disabled_child: Data?.is_disabled_child,
        // disabled_child_image: Data,
        sum_insured: Data?.suminsured,
        sum_insured_opd: Data?.opd_suminsured,
        is_unmarried_child: Number(Data?.is_unmarried_child) ? true : false,
        premium: Data?.total_premium,
        is_adopted_child: Data?.is_adopted_child,
        ...Data?.number_of_time_salary && {
          number_of_time_salary: Number(Data?.number_of_time_salary)
        },
        employee_annual_salary: Data?.annual_salary,
        employee_designation: Data?.designation,
      })
      setEmployee_relation(String(Data?.relation_id))
      if (Data?.is_special_child) {
        setSpecialMemberImg(1)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data, relations])

  const onChangeSpecialm = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? 1 : 0;
    setSpecialMemberImg(prev => checked);
    return checked;
  };

  const adoptedChild = watch('is_adopted_child');
  const member_dob = watch("member_dob");

  const onSubmit = (data) => {
    const formData = new FormData();
    if (specialMemberImg && specialFile) {
      formData.set("disabled_child", specialMemberImg);
      formData.set("special_child_image", specialFile);
      formData.set("is_special_child", specialMemberImg);
    } else {
      (Data?.is_special_child !== specialMemberImg || !isSelf) && formData.set("disabled_child", specialMemberImg);
      (Data?.is_special_child !== specialMemberImg || !isSelf) && formData.set("is_special_child", specialMemberImg);
    }
    // else if (Number(employee_relation) === 3 || Number(Data?.relation_id) === 3 || Number(employee_relation) === 4 || Number(Data?.relation_id) === 4) {
    //   formData.set("disabled_child", specialMemberImg);
    // }
    if ((flex?.suminsured && data.sum_insured) ||
      (!!flex?.suminsured_relation_wise &&
        [17].includes(flex?.suminsured_type_id) &&
        shouldShowSI(flex, member_option, Number(employee_relation), true))) {
      (Number(Data?.suminsured) !== Number(data.sum_insured) || !isSelf) && formData.set("sum_insured", data.sum_insured || Data?.suminsured);
    }
    if (flex?.premium && flex?.suminsured && data.sum_insured) {
      for (let i = 0; i < suminsureds?.length; i++) {
        if (Number(suminsureds[i].name) === data.sum_insured ||
          Number(suminsureds[i].name) === Data?.suminsured) {
          formData.set("premium", premiums[i]?.name || Data?.total_premium);
          break;
        }
      }
    }

    if (data.number_of_time_salary) {
      (Number(Data?.number_of_time_salary) !== Number(data.number_of_time_salary) || !isSelf) && formData.set("number_of_time_salary", data.number_of_time_salary);
    }

    if (flex?.opd_suminsured && data.sum_insured_opd) {
      (Number(Data?.opd_suminsured) !== Number(data.sum_insured_opd) || !isSelf) && formData.set("opd_suminsured", data.sum_insured_opd);
    }
    if (flex?.opd_suminsured && flex?.opd_premium && data.sum_insured_opd) {
      for (let i = 0; i < suminsureds_opd.length; i++) {
        if (Number(suminsureds_opd[i].name) === Number(data.sum_insured_opd)) {
          formData.set("opd_premium", premiums_opd[i].name);
          break;
        }
      }
    }
    // if (flex?.premium) {
    //   formData.set("premium", data.premium || Data?.total_premium);
    // }

    if (data.member_marriage_date && !isSelf) {
      (Data?.marriage_date !== data.member_marriage_date || !isSelf) && formData.append("member_marriage_date", data.member_marriage_date);
    }
    if (data.partner_document && data.partner_document[0] && !isSelf) {
      formData.append("partner_document", data.partner_document[0]);
    }

    formData.append("member_relation_id", employee_relation || Data?.relation_id);
    const MemberGender = (data.member_gender === "1") ? "Male" :
      (data.member_gender === "2"
        ? "Female"
        : "Other");
    (Data?.gender !== MemberGender || !isSelf) && formData.append("member_gender", MemberGender);
    (Data?.first_name !== data.member_firstname || !isSelf) && formData.append("member_firstname", data.member_firstname);
    (data.member_lastname && (Data?.last_name !== data.member_lastname || !isSelf)) && formData.append("member_lastname", data.member_lastname);
    (data.member_contact_no && (Data?.mobile_no !== data.member_contact_no || !isSelf)) && formData.append("member_contact_no", data.member_contact_no);
    (data.member_email && (Data?.email !== data.member_email || !isSelf)) && formData.append("member_email", data.member_email);
    (Data?.dob !== data.member_dob || !isSelf) && formData.append("member_dob", data.member_dob);
    (Data?.is_unmarried_child !== data.is_unmarried_child || !isSelf) && formData.append("is_unmarried_child", data.is_unmarried_child ? 1 : 0);
    (Data?.is_adopted_child !== data.is_adopted_child || !isSelf) && formData.append("is_adopted_child", data.is_adopted_child ? 1 : 0);
    if (!isSelf && data.is_adopted_child && data.adopted_child_document[0]) {
      formData.append("adopted_child_document", data.adopted_child_document[0]);
    }
    if (isSelf) {
      const self = member_option.find(({ relation_id }) => relation_id === 1);
      setValue('employee_designation', self?.employee_designation);
      setValue('employee_annual_salary', self?.employee_annual_salary);
      (data?.employee_annual_salary && self?.employee_annual_salary !== data?.employee_annual_salary) && formData.append("employee_annual_salary", data.employee_annual_salary);
      (data?.employee_designation && self?.employee_designation !== data?.employee_designation) && formData.append("employee_designation", data.employee_designation);
    }
    (!midTerm && Data.id) && formData.append("family_member_id", Data.id);
    formData.append("policy_id", policy_id);
    formData.append("type", (midTerm || !Data?.id) ? 1 : 2);
    if (midTerm) {
      formData.append("is_midterm_enrollement", 1);
      // ((contribution?.ipd_employee_contribution !== undefined || contribution?.opd_employee_contribution !== undefined) &&
      //   (contribution.ipd_employee_contribution !== 0 || contribution.opd_employee_contribution !== 0)) &&
      //   formData.append("deductible", deductible);
    }
    // formData.set("member_gender", (data.member_gender === "1") ? "Male" : "Female");
    (Data?.employer_verification_status === 2) && formData.append("resolved_dependency", 1);
    (Data?.employee_id) && formData.append("employee_id", Data.employee_id);

    dispatch(addMember(formData, policy_id, Data?.employee_id, type === 'topup' && flex.master_policy, onHide, topup));
    // setTimeout(onHide, 500);
  }

  const resetRender = ([data]) => {
    //let _isSpecialMember = relations.filter((elm) => Number(elm.id) === Number(data.target.value))
    setEmployee_relation(data.target.value);
    setValue([{ member_dob: '' }, { member_marriage_date: '' }])
    //setSpecialMember(_isSpecialMember[0].is_special_member);
    //setSpecial(_isSpecialMember[0].is_special_member)

    switch (data.target.value) {
      case '3': setValue('member_gender', 2);
        break;
      case '4': setValue('member_gender', 1);
        break;
      case '5': setValue('member_gender', 1);
        break;
      case '6': setValue('member_gender', 2);
        break;
      case '7': setValue('member_gender', 1);
        break;
      case '8': setValue('member_gender', 2);
        break;
      default: setValue('member_gender', '');
        break;
    }
    return data;
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>{midTerm ? 'Add' : 'Edit'} Member</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap" >

            {!isSelf && Data?.relation_id !== 1 && <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Select
                  label="Relation With Employee"
                  placeholder="Select Relation With Employee"
                  options={relations?.map(item => ({
                    id: item.id,
                    name: item.name,
                    value: item.id
                  })) || []}
                  id="employee_relation"
                />}
                error={errors && errors.member_relation_id}
                onChange={resetRender}
                disabled={!midTerm}
                name="member_relation_id"
                control={control}
              />
            </Col>}

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Select
                  label="Gender"
                  placeholder="Select Gender"
                  required
                  options={filterGender(Number(employee_relation)).map(item => ({
                    id: item.id,
                    name: item.name,
                    value: item.id
                  })) || []}
                  error={errors && errors.member_gender}
                />}
                error={errors && errors.member_gender}
                // onChange={([data]) => { setGender(data); return data }}
                name="member_gender"
                control={control}
              />
              {!!errors.member_gender && <Error>
                {errors.member_gender.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Input label="First Name" placeholder="Enter First Name" required />}
                error={errors && errors.member_firstname}
                // onChange={([e]) => { setFirst_name(e.target.value); return e }}
                control={control}
                name="member_firstname" />
              {!!errors.member_firstname && <Error>
                {errors.member_firstname.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Input label="Last Name" placeholder="Enter Last Name" required={false} />}
                error={errors && errors.member_lastname}
                // onChange={([e]) => { setLast_name(e.target.value); return e }}
                control={control}
                name="member_lastname" />
              {!!errors.member_lastname && <Error>
                {errors.member_lastname.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Input label="Contact No" placeholder="Enter Contact No" min={0} required={false}
                  type='tel'
                  maxLength={10}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  error={errors && errors.member_contact_no}
                />}
                control={control}
                name="member_contact_no" />
              {!!errors.member_contact_no && <Error>
                {errors.member_contact_no.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Input label="Email" placeholder="Enter Alternate Email" type="email" required={false}
                />}
                error={errors && errors.member_email}
                control={control}
                name="member_email" />
              {!!errors.member_email && <Error>
                {errors.member_email.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Input label="Date of Birth" type="date" required />}
                name="member_dob"
                {...((midTerm && ['3', '4'].includes(employee_relation)) && { min: formatDate(subDays(new Date(), flex?.default_midterm_enrollement_days_for_kids - 1)) })}
                max={formatDate(new Date())}
                error={errors && errors.member_dob}
                // onChange={([e]) => { setDob(e.target.value); return e }}
                control={control} />
              {!!errors.member_dob && <Error>
                {errors.member_dob.message}
              </Error>}
            </Col>

            {(employee_relation === "2") &&
              <Col md={6} lg={4} xl={4} sm={12}>
                <Controller
                  as={<Input label="Member Marriage Date" type="date" required={midTerm} />}
                  name="member_marriage_date"
                  {...midTerm && { min: formatDate(subDays(new Date(), flex?.default_midterm_enrollement_days_for_spouse - 1)) }}
                  max={formatDate(new Date())}
                  error={errors && errors.member_marriage_date}
                  // onChange={([e]) => { setDob(e.target.value); return e }}
                  control={control} />
                {!!errors.member_marriage_date && <Error>
                  {errors.member_marriage_date.message}
                </Error>}
              </Col>}

            {/* <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Input label="Sum Insured" placeholder="Enter Contact No" min={0} type="number"
                // error={errors && errors.mobile_no}
                />}
                control={control}
                name="sum_insured" />
            </Col>
            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={<Input label="Premium" placeholder="Enter Contact No" min={0} type="number"
                // error={errors && errors.mobile_no}
                />}
                control={control}
                name="premium" />
            </Col> */}

            {/* Sum Insured */}
            {flex?.main_suminsured_type_id === 1 && (!!suminsureds?.length) &&
              <Col md={6} lg={4} xl={4} sm={12}>
                <Controller
                  as={<Select
                    label="Sum Insured"
                    placeholder="Select Sum Insured"
                    options={suminsureds || []}
                    valueName="name"
                    id="sum_insured"
                    required
                  />}
                  name="sum_insured"
                  control={control}
                />
              </Col>}

            {/* Sum Insured */}
            {!!flex?.suminsured_relation_wise &&
              [17].includes(flex?.suminsured_type_id) &&
              shouldShowSI(flex, member_option, Number(employee_relation), true) && (
                <Col md={6} lg={6} xl={6} sm={12}>
                  <Controller
                    as={
                      <Select
                        label="Sum Insured"
                        placeholder="Select Sum Insured"
                        options={shouldShowSI(flex, member_option, Number(employee_relation), true) || []}
                        valueName="name"
                        id="sum_insured"
                        required
                      />
                    }
                    name="sum_insured"
                    control={control}
                  />
                </Col>
              )}

            {/* Sum Insured OPD */}
            {flex?.opd_suminsured_type_id === 1 && (!!suminsureds_opd?.length) &&
              <Col md={6} lg={4} xl={4} sm={12}>
                <Controller
                  as={<Select
                    label="OPD Sum Insured"
                    placeholder="Select OPD Sum Insured"
                    options={suminsureds_opd || []}
                    valueName="name"
                    id="sum_insured_opd"
                    required
                  />}
                  name="sum_insured_opd"
                  control={control}
                />
              </Col>}

            {/* No of time salary relation */}
            {!!flex?.number_of_time_salary?.length &&
              <div className="col-12 col-sm-6 w-100">
                <Controller
                  as={
                    <Select
                      label="No of time salary"
                      placeholder="Select No of time salary"
                      options={flex?.number_of_time_salary
                        .find(({ relation_id }) =>
                          Number(relation_id) === Number(employee_relation))?.number_of_time_salary
                        .filter((_, index) => {
                          const SelfSelectedOption = member_option.find(({ relation_id }) => relation_id === 1)?.number_of_time_salary
                          const SelfOptions = flex?.number_of_time_salary.find(({ relation_id }) => Number(relation_id) === 1)?.number_of_time_salary
                          const indexOfSelf = SelfOptions.findIndex((salary) => Number(salary) === Number(SelfSelectedOption))
                          Number(member_option?.[0]?.number_of_time_salary);
                          return indexOfSelf === index
                        })
                        .map((salary) => ({
                          id: Number(salary),
                          name: Number(salary),
                          value: Number(salary)
                        })) || []}
                      id="number_of_time_salary"
                      required
                    />
                  }
                  disabled={isSelf}
                  name="number_of_time_salary"
                  control={control}
                />
              </div>}

            {isSelf && <>
              <Col md={6} lg={4} xl={4} sm={12}>
                <Controller
                  as={
                    // designation.length ?
                    //   <Select
                    //     label="Designation"
                    //     placeholder="Select Designation"
                    //     required
                    //     options={designation}
                    //     error={errors && errors.employee_designation}
                    //   /> :
                    <Input
                      label="Designation"
                      placeholder="Enter Designation"
                      required={false}
                      error={errors && errors.employee_designation}
                    />
                  }
                  control={control}
                  name="employee_designation"
                />
                {!!errors.employee_designation && (
                  <Error>{errors.employee_designation.message}</Error>
                )}
              </Col>
              <Col md={6} lg={4} xl={4} sm={12}>
                <Controller
                  as={
                    <Input
                      label="Annual Salary"
                      placeholder="Enter Annual Salary"
                      min={0}
                      type="tel"
                      maxLength={10}
                      onKeyDown={numOnly}
                      onKeyPress={noSpecial}
                      required={false}
                      error={errors && errors.employee_annual_salary}
                    />
                  }
                  control={control}
                  name="employee_annual_salary"
                />
                {!!errors.employee_annual_salary && (
                  <Error>{errors.employee_annual_salary.message}</Error>
                )}
              </Col>
            </>}

          </Row>
          {(employee_relation === "3" || employee_relation === "4") && !!flex?.unmarried_child &&
            <Row>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="unmarried_check"
                      className="custom-control-input"
                      type="checkbox" />
                  }
                  defaultValue={false}
                  name="is_unmarried_child"
                  control={control}
                />
                <Label className="custom-control-label" htmlFor="unmarried_check">Unmarried Child</Label>
              </InputWrapper>
            </Row>
          }
          {(employee_relation === "3" || employee_relation === "4") && !!(flex?.has_adopted_child) &&
            <Row>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="adopted_check"
                      className="custom-control-input"
                      type="checkbox" />
                  }
                  defaultValue={!!Data?.is_adopted_child}
                  name="is_adopted_child"
                  control={control}
                />
                <Label className="custom-control-label" htmlFor="adopted_check">Adopted Child</Label>
              </InputWrapper>
            </Row>
          }
          {!!adoptedChild &&
            <Row>
              <Col className='text-left' md={12} lg={12} xl={12} sm={12}>
                <AttachFile2
                  name="adopted_child_document"
                  title="Attach Adopted Child Certificate"
                  key="adopted_child_document"
                  fileRegister={register}
                  accept=".jpeg, .png, .jpg"
                  description="File Formats: jpeg, png, jpg"
                  nameBox
                  required={(!Data?.adopted_child_document && !ModuleControl.isTATA) ? true : false}
                // error={errors && errors.s_file}
                />
                {!!Data?.adopted_child_document && <AnchorTag href={"#"}
                  onClick={() => downloadFile(Data?.adopted_child_document, null, true)}
                >
                  <i
                    className="ti-cloud-down attach-i"
                    style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                  ></i>
                  <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                    Download Document
                  </p>
                </AnchorTag>}
              </Col>
            </Row>
          }
          {/* {!!Data.is_disabled_child && */}
          {(employee_relation === "3" || employee_relation === "4") && !!(flex?.has_special_child) &&
            shouldAskforSpecialChild(relations, member_dob, specialMemberImg, setValue, setSpecialMemberImg) &&
            <Row>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="special_check"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={!!Data?.is_special_child} />
                  }
                  name="disabled_child"
                  control={control}
                  onChange={onChangeSpecialm}
                />
                <Label className="custom-control-label" htmlFor="special_check">Special Child</Label>
              </InputWrapper>
            </Row>
          }
          {!!specialMemberImg &&
            /* {!!1 && */
            <Row>
              <Col className='text-left' md={12} lg={12} xl={12} sm={12}>
                <AttachFile
                  name="special_member_image"
                  title="Attach Special Child Certificate"
                  key="special_file"
                  accept=".jpeg, .png, .jpg"
                  onUpload={(files) => setSpecialFile(files[0])}
                  description="File Formats: jpeg, png, jpg"
                  nameBox
                  required={(!(Data?.special_child_image || Data?.special_child_document) && !ModuleControl.isTATA) ? true : false}
                // error={errors && errors.s_file}
                />
                {!!(Data?.special_child_image || Data?.special_child_document) && <AnchorTag href={"#"}
                  onClick={() => downloadFile(Data?.special_child_image || Data?.special_child_document, null, true)}
                >
                  <i
                    className="ti-cloud-down attach-i"
                    style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                  ></i>
                  <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                    Download Document
                  </p>
                </AnchorTag>}
              </Col>
            </Row>
          }

          {/* {employee_relation === "2" && Gender[selfGender] === currentMemberGender && <Row>
            <Col className='text-left' md={12} lg={12} xl={12} sm={12}>
              <AttachFile2
                name="partner_document"
                title="Attach Marriage Official Letter/Document"
                key="partner_document"
                accept=".jpeg, .png, .jpg"
                fileRegister={register}
                // onUpload={(files) => setSpecialFile(files[0])}
                description="File Formats: jpeg, png, jpg"
                nameBox
                required={false}
              // error={errors && errors.s_file}
              />
            </Col>
          </Row>} */}
          {/* {(employee_relation === "3" || employee_relation === "4") && !!flex?.special_child &&
            <Row>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="special_check"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={!!special} />
                  }
                  name="disabled_child"
                  control={control}
                  onChange={onChangeSpecial}
                />

                <Label className="custom-control-label" htmlFor="special_check">Special Child</Label>
              </InputWrapper>
            </Row>} */}
          {/* {!!special &&
            <Row>
              <Col md={12} lg={12} xl={12} sm={12}>
                <AttachFile
                  name="disabled_child_image"
                  title="Attach Image of Special Child"
                  key="special_file"
                  accept=".jpeg, .png, .jpg"
                  onUpload={(files) => setSpecialFile(files[0])}
                  description="File Formats: jpeg, png, jpg"
                  nameBox
                  required={false}
                  error={errors && errors.premium_file}
                />
              </Col>
            </Row>} */}
          {(contribution?.ipd_employee_contribution !== undefined || contribution?.opd_employee_contribution !== undefined) &&
            (contribution?.ipd_employee_contribution !== 0 || contribution?.opd_employee_contribution !== 0) &&
            !!(flex?.has_payroll || flex?.has_wallet) && <div className='text-left'>
              <Marker />
              <Typography>{'\u00A0'}Premium deduction</Typography>
              <TabWrapper style={{ zoom: '0.85' }} width={'max-content'}>
                {!!flex?.has_payroll && <Tab isActive={Boolean(deductible === "S")} onClick={() => setDeductible("S")}>Payroll</Tab>}
                {!!flex?.has_wallet && <Tab isActive={Boolean(deductible === "F")} onClick={() => setDeductible("F")}>Wallet</Tab>}
              </TabWrapper>
            </div>}

          <Row >
            <Col md={12} className="d-flex justify-content-center mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button
                // onClick={handleSubmit(onSubmit)}
                type="submit" >{midTerm ? 'Add' : 'Update'}</Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal >
  );
}

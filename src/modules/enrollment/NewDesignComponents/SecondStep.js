/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useReducer } from "react";
import * as yup from "yup";
import swal from "sweetalert";

import classesone from "../index.module.css";
import { Row, Col, Accordion, OverlayTrigger/* , Button as Btn */ } from "react-bootstrap";
import { Label } from "../style";
import {
  Input, Button, Select,
  TabWrapper, Tab, Error,
  Marker, Typography, Loader
} from "components";
import Avatar from "./subComponent/Avatar";
import { InputWrapper } from "modules/policies/steps/additional-details/styles";
import { AttachFile, AttachFile2 } from "modules/core";
import classes from "../../contact-us/index.module.css";
import { comma } from "./ForthStep";
import { Head, OptionInput } from "modules/enrollment/style";
import { CardContentConatiner } from "modules/Insurance/style";

import { Controller, useForm } from "react-hook-form";
import { formatDate, filterGender, ContextAwareToggle, renderTooltip } from "../enrollment.help";
import { numOnly } from "utils";
import { useLocation } from "react-router";
import { noSpecial } from "../../../utils";
import {
  initialState, reducer,
  loadFlex,
  loadMember,
  loadRelations,
  addMember,
  findParentPairSI,
} from "./enrolment.action";
import { have_flex_policy, loadAllSummary, set_installments, validateFlexAmtAll } from "../enrollment.slice";
import { useDispatch, useSelector } from "react-redux";
import { ModuleControl } from "../../../config/module-control";
import { differenceInMonths, differenceInYears } from "date-fns";
import { calculatePremiumInstallment } from './TopUp.js';
import { common_module } from 'config/validations';
const validation = common_module.user;

const NotTATA = !ModuleControl.isTATA


export const shouldShowSI = (flex, member_option, employee_relation, editable = false) => {
  for (const key in flex.suminsured_relation_wise) {
    if (employee_relation === Number(key)) {
      const relation_sum_insured = flex.suminsured_relation_wise[key].relation_sum_insured || [],
        double_parent_suminsured = flex.suminsured_relation_wise[key].double_parent_suminsured || [],
        double_parent_in_law_suminsured = flex.suminsured_relation_wise[key].double_parent_in_law_suminsured || [];
      if (double_parent_suminsured?.filter(Number)?.length || double_parent_in_law_suminsured?.filter(Number)?.length) {
        if ([5, 6].includes(employee_relation) && (member_option.every(({ relation_id }) => ![5, 6].includes(relation_id)) || member_option.some(({ relation_id, suminsured }) => (employee_relation === Number(relation_id) && editable && suminsured)))) {
          return double_parent_suminsured.map(si => ({ name: si, id: si, value: si }))
        }
        if ([7, 8].includes(employee_relation) && (member_option.every(({ relation_id }) => ![7, 8].includes(relation_id)) || member_option.some(({ relation_id, suminsured }) => (employee_relation === Number(relation_id) && editable && suminsured)))) {
          return double_parent_in_law_suminsured.map(si => ({ name: si, id: si, value: si }))
        }
        return false
      }
      if (relation_sum_insured?.filter(Number)?.length) {
        return relation_sum_insured.map(si => ({ name: si, id: si, value: si }))
      }
      return false
    }
  }
  return false
}

export const isParentPairFirst = (member_relation_id, member_option, editable/* , isParentPolicy */) => {
  if (member_option.length && (member_option[0].cover_type === 2 || member_option[0].cover_type === 1 /* || isParentPolicy */)) {
    if (member_option[0].cover_type === 2) {
      if ([5, 6].includes(member_relation_id) && (member_option.every(({ relation_id }) => ![5, 6].includes(relation_id)) || member_option.some(({ relation_id, suminsured }) => (member_relation_id === Number(relation_id) && editable && suminsured))))
        return true
      if ([7, 8].includes(member_relation_id) && (member_option.every(({ relation_id }) => ![7, 8].includes(relation_id)) || member_option.some(({ relation_id, suminsured }) => (member_relation_id === Number(relation_id) && editable && suminsured))))
        return true
    }
    // if (member_option[0].cover_type === 1) {
    //   if ([5, 6].includes(member_relation_id) && (member_option.every(({ relation_id }) => ![5, 6].includes(relation_id)) || editable)) {
    //     const whoseFirst = member_option.find(({ relation_id }) => relation_id === 5 || relation_id === 6)
    //     return !whoseFirst ? true : whoseFirst.relation_id === member_relation_id
    //   }
    //   if ([7, 8].includes(member_relation_id) && (member_option.every(({ relation_id }) => ![7, 8].includes(relation_id)) || editable)) {
    //     const whoseFirst = member_option.find(({ relation_id }) => relation_id === 7 || relation_id === 8)
    //     return !whoseFirst ? true : whoseFirst.relation_id === member_relation_id
    //   }
    // }

    return false
  }
  return false

}

export const shouldAskforSpecialChild = (Relations, member_dob, special, setValue, setSpecial, editSelected) => {
  const childDetail = Relations.find(({ id }) => [3, 4].includes(id));
  if (!childDetail) return false;
  const childMaxAge = childDetail.ipd_max_age || childDetail.opd_max_age;
  if (!childMaxAge) {
    (editSelected && !special) && setSpecial(1);
    return true
  }
  if (member_dob && childMaxAge && (childMaxAge < differenceInYears(new Date(), new Date(member_dob).setHours(0, 0, 0, 0)))) {
    (editSelected && !special) && setSpecial(1);
    return true
  }
  special && setValue('disabled_child', 0);
  special && setSpecial(0);
  return false
}

const SecondStep = ({ policy_id, policy_name, policy_ids,
  setpolicyMembers, parentIndex, policyCoverage, policyNotCoverages, setPolicyMembersAll,
  description, baseEnrolmentStatus, flex_balance, is_installment_there, setFlexOfPolicy, memberLoad,
  set_is_installment_there, setpolicyMembersHaveInstalment, setpolicyMembersInstalmentSelected }) => {
  const location = useLocation();
  const { globalTheme } = useSelector(state => state.theme)
  const query = new URLSearchParams(location.search);
  const _plan_id = query.get("plan_id");

  const { currentUser } = useSelector((state) => state.login);
  const dispatchRedux = useDispatch()
  const [{ member_option = [], flex,
    relations, loading,
    error, success,
    flex_plan_data }, dispatch] = useReducer(reducer, initialState);

  const [employee_relation, setEmployee_relation] = useState("");

  const [special, setSpecial] = useState(0);
  const [specialFile, setSpecialFile] = useState(null);
  const [deductible, setDeductible] = useState("S");

  useEffect(() => {
    setDeductible(flex?.has_payroll ? "S" : (flex?.has_wallet ? "F" : "S"));
    setFlexOfPolicy(prev => {
      const prevCopy = [...prev];
      prevCopy[parentIndex] = flex;
      return prevCopy;
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flex])

  useEffect(() => {
    if (memberLoad[parentIndex]) {
      loadMember(dispatch, policy_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberLoad[parentIndex]])

  const TotalPremium = member_option.reduce((total, { ipd_employee_premium, opd_employee_premium }) =>
    total + (+ipd_employee_premium || 0) + (+opd_employee_premium || 0), 0)

  useEffect(() => {
    if (flex?.is_flex_policy) {
      dispatchRedux(have_flex_policy(!!flex?.is_flex_policy));
    }
    if (flex?.installments && (flex?.installment_level === 1 || flex?.installment_level === undefined)) {
      const monthDifference = differenceInMonths(new Date(flex.policy_end_date || ''), new Date())
      dispatchRedux(set_installments(flex.policy_end_date ? flex?.installments.filter(({ installment }) => monthDifference >= +installment) : flex?.installments));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flex])


  useEffect(() => {
    if (flex?.installments && flex?.installment_level === 0 && TotalPremium > 0) {
      const monthDifference = differenceInMonths(new Date(flex.policy_end_date || ''), new Date())
      set_is_installment_there(prev => {
        const prevCopy = [...prev];
        prevCopy[parentIndex] = flex.policy_end_date ? flex?.installments.filter(({ installment }) => monthDifference >= +installment) : flex?.installments;
        return prevCopy;
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flex, member_option])

  useEffect(() => {
    setpolicyMembersHaveInstalment(prev => {
      const prevCopy = [...prev];
      prevCopy[parentIndex] = member_option.some(({ installment }) => installment)
      return prevCopy;
    })
    setpolicyMembers(prev => {
      const prevCopy = [...prev];
      prevCopy[parentIndex] = member_option.map(({ relation_id }) => relation_id)
      return prevCopy;
    })
    setPolicyMembersAll(prev => {
      const prevCopy = [...prev];
      prevCopy[parentIndex] = member_option
      return prevCopy;
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentIndex, member_option])


  const suminsureds = flex_plan_data.totalSumInsured
    ? [
      {
        name: flex_plan_data.totalSumInsured,
        id: flex_plan_data.totalSumInsured,
        value: flex_plan_data.totalSumInsured,
      },
    ]
    : (flex?.suminsured &&
      flex?.suminsured
        ?.split(",")
        .map((elem) => ({ name: elem, id: elem, value: elem }))) ||
    [];

  const in_suminsureds = (flex?.in_suminsured && flex?.in_suminsured
    ?.split(",")
    .map((elem) => ({ name: elem, id: elem, value: elem }))) ||
    [];

  const premiums = flex_plan_data.totalPremium
    ? [
      {
        name: flex_plan_data.totalPremium,
        id: flex_plan_data.totalPremium,
        value: flex_plan_data.totalPremium,
      },
    ]
    : (flex?.premium &&
      flex?.premium?.split(",").map((elem) => ({ name: elem, id: elem }))) ||
    [];
  const suminsureds_opd =
    (flex?.opd_suminsured &&
      flex?.opd_suminsured
        ?.split(",")
        .map((elem) => ({ name: elem, id: elem, value: elem }))) ||
    [];
  const premiums_opd =
    (flex?.opd_premium &&
      flex?.opd_premium
        ?.split(",")
        .map((elem) => ({ name: elem, id: elem }))) ||
    [];
  const validationSchema = yup.object().shape({
    member_firstname: yup
      .string()
      .test("alphabets", "Name must contain only alphabets", (value) => {
        return /^([A-Za-z\s])+$/.test(value?.trim());
      })
      .required("First Name required"),
    member_lastname: yup
      .string()
      .matches(/^([A-Za-z\s])+$/, {
        message: "Name must contain only alphabets",
        excludeEmptyString: true,
      })
      .notRequired()
      .nullable(),
    member_dob: yup.string().required("DOB required"),
    member_gender: yup.string().required("Gender required"),
    // ...(employee_relation === "2" && {
    //   member_marriage_date: yup.string().required("Marriage Date required"),
    // }),
    member_relation_id: yup.string().required("Member Relation required"),
    member_contact_no: yup
      .string()
      .notRequired()
      .nullable()
      .matches(validation.contact.regex, {
        message: "Not valid number",
        excludeEmptyString: true,
      })
      .max(10, "Must be exactly 10 digits"),
    member_email: yup.string().email("must be a valid email"),
  });

  const contribution = employee_relation
    ? relations.find(({ id }) => Number(employee_relation) === id)
    : {};

  const { control, errors, reset, handleSubmit, register, watch, setValue } =
    useForm({
      validationSchema,
      defaultValues: {
        member_firstname: "",
        member_lastname: "",
        member_contact_no: "",
        member_email: "",
        member_dob: "",
        member_marriage_date: "",
        member_relation_id: "",
        member_gender: "",
        disabled_child: false,
        cover_type: (member_option?.[0]?.cover_type) || 0
      },
    });

  useEffect(() => {
    loadFlex(dispatch, policy_id, _plan_id);
    loadMember(dispatch, policy_id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (flex?.status) {
      policy_id && loadRelations(dispatch, policy_id, false, _plan_id, ([12].includes(flex.suminsured_type_id) || [14].includes(flex.premium_id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flex, policy_id])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    }
    if (!loading && success) {
      swal('Success', success, "success").then(() => {
        if ('Installment Saved Successfully.'.includes(success)) {
          loadMember(dispatch, policy_id);
        }
      });
      reset({
        member_firstname: "",
        member_lastname: "",
        member_contact_no: "",
        member_email: "",
        member_dob: "",
        member_marriage_date: "",
        member_relation_id: "",
        member_gender: "",
        disabled_child: false,
        is_adopted_child: "",
        sum_insured: "",
        sum_insured_opd: "",
        cover_type: (member_option?.[0]?.cover_type) || 0,
        // installment_id: (member_option?.[0]?.installment_id) || undefined,
      });
      setEmployee_relation("");
      setSpecial(0);
      dispatchRedux(loadAllSummary(policy_ids, setpolicyMembers))
      setDeductible(prev => {
        dispatchRedux(validateFlexAmtAll({ policy_ids: policy_ids.map(({ id }) => id) }))
        return 'S'
      })
    }

    return () => {
      dispatch({ type: 'CLEAR' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);

  const cover_type = (!member_option.length ? Number(watch("cover_type")) : (member_option?.[0]?.cover_type)) || 0;
  const adoptedChild = watch("is_adopted_child");
  const member_dob = watch("member_dob");

  const onChangeSpecial = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? 1 : 0;
    setSpecial((prev) => checked);
    return checked;
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (special) {
      formData.set("disabled_child", special);
      if (specialFile) formData.set("special_child_image", specialFile);
      formData.set("is_special_child", special);
    } else {
      formData.set("disabled_child", special);
      formData.set("is_special_child", special);
    }

    if (((data.sum_insured || suminsureds?.length === 1) &&
      ((((flex?.main_suminsured_type_id === 1 /* || cover_type === 1 */ || _plan_id || !member_option.length) &&
        ([1, 5].includes(flex?.suminsured_type_id) ||
          ([9, 13, 14].includes(flex?.suminsured_type_id) && (!member_option.length || flex?.main_suminsured_type_id === 3)))) ||
        ([9].includes(flex?.suminsured_type_id) && (flex?.main_suminsured_type_id === 3/*  || isParentPolicy */) && isParentPairFirst(Number(employee_relation), member_option, undefined/* , isParentPolicy */))) &&
        suminsureds?.length)) ||
      (!!flex?.suminsured_relation_wise &&
        [17].includes(flex?.suminsured_type_id) &&
        shouldShowSI(flex, member_option, Number(employee_relation)))
    ) {
      formData.set("sum_insured", data.sum_insured || suminsureds[0]?.name);
    }
    if (
      (flex?.premium && flex?.suminsured) ||
      (suminsureds.length && premiums.length && _plan_id)
    ) {
      for (let i = 0; i < suminsureds?.length; i++) {
        // eslint-disable-next-line eqeqeq
        if (suminsureds[i].name == data.sum_insured) {
          formData.set("premium", premiums[i].name);
          break;
        }
      }
    }

    if (member_option.length && [1, 2].includes(member_option[0].cover_type) && !data.sum_insured) {
      formData.set("sum_insured", findParentPairSI(member_option, Number(data.member_relation_id)) || suminsureds[0]?.name);
    }

    if (data.number_of_time_salary) {
      formData.set("number_of_time_salary", data.number_of_time_salary);
    }

    if ((data.sum_insured_opd || suminsureds_opd?.length === 1) && (flex?.opd_suminsured_type_id === 1 || _plan_id || (!member_option.length)) &&
      ([1, 5].includes(flex?.opd_suminsured_sub_type_id) ||
        ([9, 13, 14].includes(flex?.opd_suminsured_sub_type_id) && !member_option.length)) &&
      suminsureds_opd?.length) {
      formData.set("opd_suminsured", data.sum_insured_opd || suminsureds_opd[0]?.name);
    }
    if (flex?.opd_suminsured && flex?.opd_premium) {
      for (let i = 0; i < suminsureds_opd?.length; i++) {
        // eslint-disable-next-line eqeqeq
        if (suminsureds_opd[i].name == data.sum_insured_opd) {
          formData.set("opd_premium", premiums_opd[i].name);
          break;
        }
      }
    }
    if (data.member_marriage_date) {
      formData.append("member_marriage_date", data.member_marriage_date);
    }
    if (data.partner_document && data.partner_document[0]) {
      formData.append("partner_document", data.partner_document[0]);
    }
    formData.append("member_relation_id", data.member_relation_id);
    formData.append(
      "member_gender",
      data.member_gender === "1"
        ? "Male"
        : (data.member_gender === "2"
          ? "Female"
          : "Other")
    );
    formData.append("member_firstname", data.member_firstname);
    data.member_lastname &&
      formData.append("member_lastname", data.member_lastname);
    data.member_contact_no &&
      formData.append("member_contact_no", data.member_contact_no);
    data.member_email && formData.append("member_email", data.member_email);
    formData.append("member_dob", data.member_dob);
    formData.append("is_unmarried_child", data.is_unmarried_child ? 1 : 0);
    formData.append("is_adopted_child", data.is_adopted_child ? 1 : 0);
    if (data.is_adopted_child && data.adopted_child_document[0]) {
      formData.append("adopted_child_document", data.adopted_child_document[0]);
    }
    if (((!!contribution?.ipd_employee_contribution ||
      !!contribution?.opd_employee_contribution) ||
      ((employee_relation === "3" || employee_relation === "4") && ChildValidation(contribution, member_option, flex.max_twins, member_dob)) ||
      [14, 15].includes(flex?.premium_id)) && deductible) {
      if (deductible === "F" && Number(flex_balance?.remaining_flex_bal) === 0) {
        let shouldReturn = true;

        await swal({
          title: "Do you want to continue?",
          text: 'Amount will be deducted from your salary',
          icon: "info",
          buttons: true,
          dangerMode: true,
        }).then((submit) => {
          if (submit) {
            formData.append("deductible", 'S');
            shouldReturn = false
          }
        });
        if (shouldReturn) return null
      } else
        formData.append("deductible", deductible);
    }

    flex?.main_suminsured_type_id === 3 && (!member_option.length ? (data.cover_type && formData.append("cover_type", data.cover_type)) :
      ((member_option?.[0]?.cover_type) && formData.append("cover_type", (member_option?.[0]?.cover_type))));

    formData.append("policy_id", policy_id);
    formData.append("type", _plan_id ? 3 : 1);
    _plan_id && formData.append("plan_id", _plan_id);

    addMember(dispatch, formData, policy_id);
  };

  const resetRender = (data) => {
    setEmployee_relation(data.target.value);

    switch (data.target.value) {
      case "3":
        setValue("member_gender", 2);
        break;
      case "4":
        setValue("member_gender", 1);
        break;
      case "5":
        setValue("member_gender", 1);
        break;
      case "6":
        setValue("member_gender", 2);
        break;
      case "7":
        setValue("member_gender", 1);
        break;
      case "8":
        setValue("member_gender", 2);
        break;
      default:
        setValue("member_gender", "");
        break;
    }
    return data.target.value;
  };

  const Relations = relations
    ?.filter(({ id }) => !policyNotCoverages?.includes(id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      value: item.id,
    })) || []

  // const isParentPolicy = relations?.every(({ id }) =>
  //   [5, 6, 7, 8].includes(id)
  // )

  return (<>
    <Accordion defaultActiveKey={/* packageIndex + */ 1} style={{
      boxShadow: '1px 1px 16px 0px #e7e7e7',
      borderRadius: '15px',
      width: '100%',
      marginBottom: '15px',
      border: '1px solid #e8e8e8'
    }}>
      <Accordion.Toggle
        eventKey={/* packageIndex + */ 1} style={{
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
          {/* <img
            src={GetSrc(v.policy_sub_type_id)}
            alt={'policy_image_404'}
            style={{
              // border: '1px dashed #b6b6b6',
              borderRadius: "5px",
              // padding: "10px",
              textAlign: "center",
              marginRight: '10px',
              height: '40px'
            }} /> */}
          {policy_name}
          {Boolean(description) && Boolean(description?.length > 40) && <OverlayTrigger
            placement="top"
            overlay={(e) =>
              renderTooltip(e, description)
            }
          >
            <span className={classesone.textOverFlow}>{`${description/* ?.slice(0, 40) */}...`}</span>
          </OverlayTrigger>
          }
          {Boolean(description) && Boolean(description?.length <= 40) &&
            <span className={classesone.textOverFlow}>{`${description}`}</span>
          }
        </div>
        <ContextAwareToggle eventKey={/* packageIndex + */ 1} />
      </Accordion.Toggle>
      {true &&
        <Accordion.Collapse eventKey={/* packageIndex + */ 1} style={{
          width: '100%',
          // paddingTop: '50px',
          paddingTop: '15px',
          background: 'white',
          borderTop: '2px solid #FFDF00',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px'
        }}>
          <div className="row m-0 justify-content-center">
            <div className="row m-0 justify-content-center mx-2 w-100">
              {(Relations?.length && baseEnrolmentStatus) ? <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row m-0 justify-content-center justify-content-sm-center justify-content-md-start w-100">
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Select
                          label="Relation With Employee"
                          placeholder="Select Relation With Employee"
                          options={Relations}
                          valueName="name"
                          id="employee_relation"
                        />
                      }
                      error={errors && errors.member_relation_id}
                      onChange={([data]) => resetRender(data)}
                      name="member_relation_id"
                      control={control}
                    />
                    {!!errors.member_relation_id && (
                      <Error>{errors.member_relation_id.message}</Error>
                    )}
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Select
                          label="Gender"
                          placeholder="Select Gender"
                          required
                          options={
                            filterGender(Number(employee_relation)).map((item) => ({
                              id: item.id,
                              name: item.name,
                              value: item.id,
                            })) || []
                          }
                          error={errors && errors.member_gender}
                        />
                      }
                      control={control}
                      name="member_gender"
                    />
                    {!!errors.member_gender && (
                      <Error>{errors.member_gender.message}</Error>
                    )}
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          label="First Name"
                          placeholder="Enter First Name"
                          maxLength={50}
                          required
                        />
                      }
                      error={errors && errors.member_firstname}
                      control={control}
                      name="member_firstname"
                    />
                    {!!errors.member_firstname && (
                      <Error>{errors.member_firstname.message}</Error>
                    )}
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          label="Last Name"
                          placeholder="Enter Last Name"
                          maxLength={50}
                          required={false}
                        />
                      }
                      error={errors && errors.member_lastname}
                      control={control}
                      name="member_lastname"
                    />
                    {!!errors.member_lastname && (
                      <Error>{errors.member_lastname.message}</Error>
                    )}
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          label="Contact No"
                          placeholder="Enter Contact No"
                          min={0}
                          type="tel"
                          maxLength={10}
                          onKeyDown={numOnly}
                          onKeyPress={noSpecial}
                          required={false}
                          error={errors && errors.member_contact_no}
                        />
                      }
                      control={control}
                      name="member_contact_no"
                    />
                    {!!errors.member_contact_no && (
                      <Error>{errors.member_contact_no.message}</Error>
                    )}
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          label="Email"
                          placeholder="Enter Alternate Email"
                          type="email"
                          maxLength={50}
                          error={errors && errors.member_email}
                          required={false}
                        />
                      }
                      control={control}
                      name="member_email"
                    />
                    {!!errors.member_email && (
                      <Error>{errors.member_email.message}</Error>
                    )}
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={<Input label="Date of Birth" type="date" required />}
                      name="member_dob"
                      max={formatDate(new Date())}
                      error={errors && errors.member_dob}
                      control={control}
                    />
                    {!!errors.member_dob && (
                      <Error>{errors.member_dob.message}</Error>
                    )}
                  </div>
                  {employee_relation === "2" && (
                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Input label="Member Marriage Date" type="date" required={false} />
                        }
                        name="member_marriage_date"
                        max={formatDate(new Date())}
                        error={errors && errors.member_marriage_date}
                        control={control}
                      />
                      {!!errors.member_marriage_date && (
                        <Error>{errors.member_marriage_date.message}</Error>
                      )}
                    </div>
                  )}

                  {/* Cover Type */}
                  {(flex?.main_suminsured_type_id === 3 && !member_option.length) && (
                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Select
                            label="Sum Insured Type"
                            placeholder="Select Sum Insured Type"
                            options={[
                              ...!!in_suminsureds.length ? [{ id: 1, value: 1, name: 'Individual' }] : [],
                              ...!!suminsureds.length ? [{ id: 2, value: 2, name: 'Floater' }] : []
                            ]}
                            id="cover_type"
                            required
                          />
                        }
                        defaultValue={(in_suminsureds.length && 1) || (suminsureds.length && 2) || 0}
                        disabled={!in_suminsureds.length || !suminsureds.length}
                        name="cover_type"
                        control={control}
                      />
                    </div>
                  )}

                  {/* Sum Insured */}
                  {(
                    (
                      (
                        (
                          flex?.main_suminsured_type_id === 1 /* ||
                          cover_type === 1 */
                        ) ||
                        _plan_id ||
                        !member_option.length
                      ) &&
                      (
                        [1, 5].includes(flex?.suminsured_type_id) ||
                        ([9, 13, 14].includes(flex?.suminsured_type_id) &&
                          (
                            !member_option.length ||
                            flex?.main_suminsured_type_id === 3
                          )
                        )
                      )
                    ) ||
                    (
                      [9].includes(flex?.suminsured_type_id) &&
                      (flex?.main_suminsured_type_id === 3 /* || isParentPolicy */) &&
                      isParentPairFirst(Number(employee_relation), member_option, undefined/* , isParentPolicy */)
                    )
                  ) &&
                    !!suminsureds?.length && suminsureds?.length !== 1 && (
                      <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                        <Controller
                          as={
                            <Select
                              label="Sum Insured"
                              placeholder="Select Sum Insured"
                              options={(cover_type === 1 ? in_suminsureds : suminsureds) || []}
                              valueName="name"
                              id="sum_insured"
                              required
                            />
                          }
                          name="sum_insured"
                          control={control}
                        />
                      </div>
                    )}

                  {/* Sum Insured RelationWise */}
                  {!!flex?.suminsured_relation_wise &&
                    [17].includes(flex?.suminsured_type_id) &&
                    shouldShowSI(flex, member_option, Number(employee_relation)) && (
                      <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                        <Controller
                          as={
                            <Select
                              label="Sum Insured"
                              placeholder="Select Sum Insured"
                              options={shouldShowSI(flex, member_option, Number(employee_relation)) || []}
                              valueName="name"
                              id="sum_insured"
                              required
                            />
                          }
                          name="sum_insured"
                          control={control}
                        />
                      </div>
                    )}

                  {/* Sum Insured OPD */}
                  {(flex?.opd_suminsured_type_id === 1 || _plan_id || (!member_option.length)) &&
                    ([1, 5].includes(flex?.opd_suminsured_sub_type_id) ||
                      ([9, 13, 14].includes(flex?.opd_suminsured_sub_type_id) && !member_option.length)) &&
                    !!suminsureds_opd?.length && suminsureds_opd?.length !== 1 && (
                      <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                        <Controller
                          as={
                            <Select
                              label="OPD Sum Insured"
                              placeholder="Select OPD Sum Insured"
                              options={suminsureds_opd || []}
                              valueName="name"
                              id="sum_insured_opd"
                              required
                            />
                          }
                          name="sum_insured_opd"
                          control={control}
                        />
                      </div>
                    )}

                  {/* No. of time salary relation */}
                  {!!flex?.number_of_time_salary?.length &&
                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Select
                            label="No. of time salary"
                            placeholder="Select No. of time salary"
                            options={flex?.number_of_time_salary
                              .find(({ relation_id }, index) =>
                                Number(relation_id) === Number(employee_relation))?.number_of_time_salary
                              // .filter((_, index) => {
                              //   const SelfSelectedOption = member_option.find(({ relation_id }) => relation_id === 1)?.number_of_time_salary
                              //   const SelfOptions = flex?.number_of_time_salary.find(({ relation_id }) => Number(relation_id) === 1)?.number_of_time_salary
                              //   const indexOfSelf = SelfOptions.findIndex((salary) => Number(salary) === Number(SelfSelectedOption))
                              //   Number(member_option?.[0]?.number_of_time_salary);
                              //   return indexOfSelf === index
                              // })
                              .map((salary) => ({
                                id: salary,
                                name: Number(salary),
                                value: salary
                              })) || []}
                            valueName="name"
                            id="number_of_time_salary"
                            required
                          />
                        }
                        name="number_of_time_salary"
                        control={control}
                      />
                    </div>}
                </div>
                {(employee_relation === "3" || employee_relation === "4") &&
                  !!flex?.unmarried_child && (
                    <Row>
                      <InputWrapper className="custom-control custom-checkbox">
                        <Controller
                          as={
                            <input
                              id="unmarried_check"
                              className="custom-control-input"
                              type="checkbox"
                            />
                          }
                          defaultValue={false}
                          name="is_unmarried_child"
                          control={control}
                        />
                        <Label className="custom-control-label" htmlFor="unmarried_check">
                          Unmarried Child
                        </Label>
                      </InputWrapper>
                    </Row>
                  )}
                {(employee_relation === "3" || employee_relation === "4") &&
                  !!flex?.has_adopted_child && (
                    <Row className="w-100">
                      <InputWrapper className="custom-control custom-checkbox">
                        <Controller
                          as={
                            <input
                              id="_adopted_check"
                              className="custom-control-input"
                              type="checkbox"
                              defaultChecked={0}
                            />
                          }
                          defaultValue={false}
                          name="is_adopted_child"
                          control={control}
                          onChange={([selected]) => {
                            const target = selected.target;
                            const checked = target && target.checked ? 1 : 0;
                            return checked
                          }}
                        />
                        <Label className="custom-control-label" htmlFor="_adopted_check">
                          Adopted Child
                        </Label>
                      </InputWrapper>
                    </Row>
                  )}
                {!!adoptedChild && (
                  <Row className="w-100 mt-1">
                    <Col md={12} lg={12} xl={12} sm={12}>
                      <AttachFile2
                        name="adopted_child_document"
                        title="Attach Adopted Child Certificate"
                        key="adopted_child_document"
                        fileRegister={register}
                        accept=".jpeg, .png, .jpg"
                        description="File Formats: jpeg, png, jpg"
                        nameBox
                        required={!ModuleControl.isTATA}
                      />
                    </Col>
                  </Row>
                )}

                {(employee_relation === "3" || employee_relation === "4") &&
                  !!flex?.has_special_child && shouldAskforSpecialChild(relations, member_dob, special, setValue, setSpecial) && (
                    <Row className="w-100">
                      <InputWrapper className="custom-control custom-checkbox">
                        <Controller
                          as={
                            <input
                              id="_special_check"
                              className="custom-control-input"
                              type="checkbox"
                              defaultChecked={0}
                            />
                          }
                          name="disabled_child"
                          control={control}
                          onChange={onChangeSpecial}
                        />
                        <Label className="custom-control-label" htmlFor="_special_check">
                          Special Child
                        </Label>
                      </InputWrapper>
                    </Row>
                  )}
                {!!special && (
                  <Row className="w-100 mt-1">
                    <Col md={12} lg={12} xl={12} sm={12}>
                      <AttachFile
                        name="special_child_image"
                        title="Attach Special Child Certificate"
                        key="special_file"
                        accept=".jpeg, .png, .jpg"
                        onUpload={(files) => setSpecialFile(files[0])}
                        description="File Formats: jpeg, png, jpg"
                        nameBox
                        required={!ModuleControl.isTATA}
                      />
                    </Col>
                  </Row>
                )}
                {/* {employee_relation === "2" &&
            Gender[selfGender] === currentMemberGender && (
              <Row className="w-100 mt-1">
                <Col md={12} lg={12} xl={12} sm={12}>
                  <AttachFile2
                    name="partner_document"
                    title="Attach Marriage Official Letter/Document"
                    key="partner_document"
                    accept=".jpeg, .png, .jpg"
                    fileRegister={register}
                    // onUpload={(files) => setSpecialFile(files[0])}
                    description="File Formats: jpeg, png, jpg"
                    nameBox
                    required={true}
                  // error={errors && errors.s_file}
                  />
                </Col>
              </Row>
            )} */}
                {((!!contribution?.ipd_employee_contribution ||
                  !!contribution?.opd_employee_contribution) ||
                  ((employee_relation === "3" || employee_relation === "4") && ChildValidation(contribution, member_option, flex.max_twins, member_dob)) ||
                  [14, 15].includes(flex?.premium_id)) &&
                  !!(flex?.has_payroll || flex?.has_wallet) && (
                    <Row className="justify-content-start">
                      <div className="col-12">
                        <Marker />
                        <Typography>{"\u00A0"}Premium deduction from</Typography>
                      </div>
                      <TabWrapper
                        style={{ zoom: "0.85", MozTransform: "scale(0.85)" }}
                        width={"max-content"}
                      >
                        {!!flex?.has_payroll && (
                          <Tab
                            isActive={Boolean(deductible === "S")}
                            onClick={() => setDeductible("S")}
                          >
                            Payroll
                          </Tab>
                        )}
                        {!!flex?.has_wallet && (
                          <Tab
                            isActive={Boolean(deductible === "F")}
                            onClick={() => setDeductible("F")}
                          >
                            Wallet
                          </Tab>
                        )}
                      </TabWrapper>
                    </Row>
                  )}

                <div className="col-12">


                  <div className="d-flex justify-content-end align-items-center">
                    <div className="d-flex justify-content-center mr-3">
                      <Button
                        buttonStyle={"outline"}
                        className={`${classesone.bigButton2}`}
                      >
                        Add Member +
                      </Button>
                    </div>
                  </div>
                  {member_option.filter(({ relation_id }) => relation_id === 1) && flex.self_si_selection === 1 && !!suminsureds?.length && suminsureds?.length !== 1 && ModuleControl.CustomRelease /* Self SI Update */ &&
                    [member_option[0]]?.map((val, index) => {

                      const UdaanLogicActivate = ModuleControl.isHowden &&
                        ((((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('robin software development') ||
                          (currentUser?.company_name || '').toLowerCase().startsWith('rakuten')) &&
                          Number(val.number_of_time_salary) === 3)) &&
                        flex.policy_sub_type_id !== 1;

                      return (
                        <div className="d-flex flex-column" key={"Second" + index}>
                          <Avatar
                            originalRelation={relations}
                            policyCoverage={policyCoverage}
                            flex={flex}
                            flex_plan_data={flex_plan_data}
                            data={val}
                            relations={Relations}
                            name={val?.relation_name}
                            gender={val?.gender}
                            key={index}
                            parentIndex={index}
                            policy_id={policy_id}
                            dispatch={dispatch}
                            member_option={member_option}
                            success={success} loading={loading}
                            UdaanLogicActivate={UdaanLogicActivate}
                            baseEnrolmentStatus={baseEnrolmentStatus}
                            policy_ids={policy_ids}
                            setpolicyMembers={setpolicyMembers}
                            enhanceCover
                          />
                          {/* {(!UdaanLogicActivate && (!!Number(val?.ipd_employee_premium) || !!Number(val?.opd_employee_premium))) && (
                            <div className="text-center" style={{ marginTop: "-8px" }}>
                              {(
                                <>
                                  <small style={{ display: "block", fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}>
                                    Annual Premium
                                  </small>
                                  <small style={{ display: "block", fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}>₹ {comma(Number(val?.ipd_employee_premium) + Number(val?.opd_employee_premium))} /-</small>
                                </>
                              )}
                            </div>
                          )} */}
                        </div>
                      );
                    })}
                </div>
              </form> : !loading && !Relations?.length && (
                <div className="row w-100">
                  <div className={`col-12 w-100 py-2 ${classesone.pinkBackDiv}`}>
                    <div className="d-flex justify-content-around flex-column flex-sm-row align-items-center">
                      <h5>
                        Only employees are eligible in this policy.
                      </h5>
                    </div>
                  </div>
                </div>
              )}
              {/* {(employee_relation === "3" || employee_relation === "4") && !!flex?.unmarried_child &&
          <Row>
            <InputWrapper className="custom-control custom-checkbox">
              <Controller
                as={
                  <input
                    id="unmarried_check"
                    className="custom-control-input"
                    type="checkbox" />
                }
                defaultValue={true}
                name="is_unmarried_child"
                control={control}
              />
              <Label className="custom-control-label" htmlFor="unmarried_check">Unmarried Child</Label>
            </InputWrapper>
          </Row>
        } */}
            </div>
            {!!member_option.length && <h5 className="mt-2 mt-0">Members Covered</h5>}
            <div className={`${classes.autoscroll}`}>
              <div className="d-flex flex-nowrap flex-sm-wrap w-100">
                {member_option?.map((val, index) => {

                  const UdaanLogicActivate = ModuleControl.isHowden &&
                    ((((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('robin software development') ||
                      (currentUser?.company_name || '').toLowerCase().startsWith('rakuten')) &&
                      Number(val.number_of_time_salary) === 3)) &&
                    flex.policy_sub_type_id !== 1;

                  return (
                    <div className="d-flex flex-column" key={"Second" + index}>
                      <Avatar
                        originalRelation={relations}
                        policyCoverage={policyCoverage}
                        flex={flex}
                        flex_plan_data={flex_plan_data}
                        data={val}
                        relations={Relations}
                        name={val?.relation_name}
                        gender={val?.gender}
                        key={index}
                        parentIndex={index}
                        policy_id={policy_id}
                        dispatch={dispatch}
                        member_option={member_option}
                        success={success} loading={loading}
                        UdaanLogicActivate={UdaanLogicActivate}
                        baseEnrolmentStatus={baseEnrolmentStatus}
                        policy_ids={policy_ids}
                        setpolicyMembers={setpolicyMembers}
                      // isParentPolicy={isParentPolicy}
                      />
                      {(!UdaanLogicActivate && (!!Number(val?.ipd_employee_premium) || !!Number(val?.opd_employee_premium))) && (
                        <div className="text-center" style={{ marginTop: "-8px" }}>
                          {(
                            <>
                              <small style={{ display: "block", fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}>
                                Annual Premium
                              </small>
                              <small style={{ display: "block", fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}>₹ {comma(Number(val?.ipd_employee_premium) + Number(val?.opd_employee_premium))} /-</small>
                            </>
                          )}
                        </div>
                      )}

                      {/* {Number(val?.relation_id) !== 1 && <>
                        {!!flex?.employer_verification_needed &&
                          <Btn
                            disabled
                            size="sm"
                            style={{ wordBreak: 'break-word', opacity: "1", fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}
                            className="shadow m-1 rounded-lg"
                            variant="light">
                            Employer Verification Status<hr className="m-0" />
                            {val?.employer_verification_status_in_word}
                            {Number(val?.employer_verification_status) === 2
                              ? "-" + val?.employer_remark
                              : ""}
                          </Btn>}
                        {!!flex?.broker_verification_needed &&
                          <Btn
                            disabled
                            size="sm"
                            style={{ wordBreak: 'break-word', opacity: "1", fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}
                            className="shadow m-1 rounded-lg"
                            variant="light">
                            Broker Verification Status<hr className="m-0" />
                            {val?.broker_verification_status_in_word}
                            {Number(val?.broker_verification_status) === 2
                              ? "-" + val?.broker_remark
                              : ""}
                          </Btn>}
                      </>} */}
                    </div>
                  );
                })}
              </div>
            </div>
            {!!(member_option.length && TotalPremium > 0 && !!is_installment_there[parentIndex]?.length && flex?.installment_level !== 1) && <div className={`${classes.autoscroll}`}>
              <Marker className='ml-3 mt-4' />
              <Typography>{"\u00A0"}Premium installment</Typography>
              <div className="d-flex flex-nowrap flex-sm-wrap w-100">
                {!!member_option.length && (is_installment_there[parentIndex] || [])?.map(
                  ({ installment, id }) => (
                    <Col md={6} lg={4} xl={3} sm={12} key={installment + 'inst' + id} className="p-3">
                      <div
                        className="card"
                        style={{
                          borderRadius: "18px",
                          boxShadow: "rgb(179 179 179 / 35%) 1px 1px 12px 0px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setValue("installment_id" + parentIndex, String(id));
                          setpolicyMembersInstalmentSelected(prev => {
                            const prevCopy = [...prev];
                            prevCopy[parentIndex] = id
                            return prevCopy;
                          })

                        }}
                      >
                        <div className="card-body card-flex-em">
                          <OptionInput className="d-flex">
                            <input
                              name={"installment_id" + parentIndex}
                              type={"radio"}
                              ref={register}
                              key={parentIndex}
                              value={id}
                              defaultChecked={member_option[0].installment === installment}
                            />
                            <span></span>
                          </OptionInput>
                          <div
                            className="row rowButton2"
                            style={{
                              marginRight: "-15px !important",
                              marginLeft: "-15px !important",
                            }}
                          >
                            <CardContentConatiner height={"auto"}>
                              <div className="col-md-12 text-center">
                                <Head>
                                  {installment} month <br />{" "}
                                  {NotTATA &&
                                    `Premium ₹${calculatePremiumInstallment(
                                      TotalPremium / installment
                                    )}/month`}
                                </Head>
                              </div>
                            </CardContentConatiner>
                          </div>
                        </div>
                      </div>
                    </Col>
                  )
                )}
              </div>
            </div>}
          </div>
        </Accordion.Collapse>
      }
    </Accordion>
    {loading && <Loader />}
  </>
  );
};

export default SecondStep;

export const ChildValidation = (contribution, members, max_twins, member_dob) => {
  if (contribution.take_premium_from_child === 0) return true;

  const childAddedCount = members.filter(({ relation_id }) => [3, 4].includes(relation_id))?.length;
  const twinChildCount = members.filter((({ dob }) => dob === member_dob)).length;

  if (contribution.take_premium_from_child) {
    return childAddedCount + 1 >= contribution.take_premium_from_child && (twinChildCount > max_twins || twinChildCount === 0)
  }
  return false
}

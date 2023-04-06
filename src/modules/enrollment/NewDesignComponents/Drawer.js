/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { subDays } from "date-fns";
import swal from "sweetalert";

import classesone from "../index.module.css";
import { Row, Col } from "react-bootstrap";
import {
  Input,
  Error,
  Select,
  // Typography,
  // TabWrapper,
  // Tab,
} from "components";
import { InputWrapper } from "modules/policies/steps/additional-details/styles";
import { AttachFile, AttachFile2 } from "modules/core";
import { Label } from "../style";

import { useForm, Controller } from "react-hook-form";
import { formatDate, filterGender } from "../enrollment.help";
import { addMember, findParentPairSI, memberRemove } from "./enrolment.action";
import { numOnly, noSpecial } from "utils";
import { comma } from "./ForthStep";
import { downloadFile } from "../../../utils";
import { AnchorTag } from "../../EndorsementRequest/style";
import { isParentPairFirst, shouldAskforSpecialChild, shouldShowSI } from "./SecondStep";
import { useDispatch, useSelector } from "react-redux";
import { common_module } from 'config/validations';
import { ModuleControl } from "../../../config/module-control";
const validation = common_module.user;


const Gender = {
  Male: 1,
  Female: 2,
  Other: 3,
};

export const CheckRelationMandatory = (current_relation_id, user_relation_id) => {

  if ([3, 4].includes(current_relation_id) && [3, 4].includes(user_relation_id)) {
    return true
  }
  // if ([5, 6].includes(current_relation_id) && [5, 6].includes(user_relation_id)) {
  //   return true
  // }
  // if ([7, 8].includes(current_relation_id) && [7, 8].includes(user_relation_id)) {
  //   return true
  // }
  if (current_relation_id === user_relation_id) {
    return true
  }
  return false
}

const DrawerForm = ({
  Data,
  flex = {},
  policy_id,
  relations = [],
  originalRelation = [],
  member_option = [],
  midTerm,
  type,
  dispatch,
  flex_plan_data,
  UdaanLogicActivate,
  policyCoverage = [],
  parentIndex,
  baseEnrolmentStatus,
  policy_ids,
  setpolicyMembers,
  // isParentPolicy
}) => {
  const [employee_relation, setEmployee_relation] = useState("");
  const isSelf = (Data?.relation_id === 1);
  const { globalTheme } = useSelector(state => state.theme)
  const { currentUser } = useSelector(state => state.login);

  const dispatchRedux = useDispatch()
  // const [deductible, setDeductible] = useState(
  //   flex?.has_payroll ? "S" : flex?.has_wallet ? "F" : "S"
  // );
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
    member_contact_no: yup
      .string()
      .notRequired()
      .nullable()
      .matches(validation.contact.regex, {
        message: "Not valid number",
        excludeEmptyString: true,
      })
      .max(10, "Must be exactly 10 digits"),
    ...(!isSelf && {
      member_email: yup
        .string()
        .notRequired()
        .nullable(true)
        .email("must be a valid email"),
    }),
    // ...(employee_relation === "2" && {
    //   member_marriage_date: yup.string().required("Marriage Date required"),
    // }),
  });

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

  const SelfSIUpdateIPD = (flex.self_si_selection === 1 && Data.relation_id === 1 &&
    suminsureds?.length && suminsureds?.length !== 1 &&
    true /* Self SI Update */);

  const SelfSIUpdateOPD = (flex.self_si_selection === 1 && Data.relation_id === 1 &&
    suminsureds_opd?.length && suminsureds_opd?.length !== 1 &&
    true /* Self SI Update */);

  const { control, errors, setValue, reset, handleSubmit, watch, register } =
    useForm({
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
        ...flex?.main_suminsured_type_id === 3 && {
          cover_type: Data?.cover_type || 1
        }
      },
      validationSchema,
    });

  const cover_type = Number(watch("cover_type"));
  const member_dob = watch("member_dob");
  const [specialMemberImg, setSpecialMemberImg] = useState(0);
  const [specialFile, setSpecialFile] = useState(null);

  // const contribution = employee_relation
  //   ? relations.find(({ id }) => Number(employee_relation) === id)
  //   : {};

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
        ...flex?.main_suminsured_type_id === 3 && {
          cover_type: Data?.cover_type || 1
        }
      });
      setEmployee_relation(String(Data?.relation_id));
      if (Data?.is_special_child) {
        setSpecialMemberImg(1);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data]);

  const onChangeSpecialm = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? 1 : 0;
    setSpecialMemberImg((prev) => checked);
    return checked;
  };

  const removeMember = (id) => {
    const currentMember = member_option.find((elem) => elem.id === id);
    if (policyCoverage.length &&
      policyCoverage.includes(Number(Data?.relation_id)) &&
      (member_option.filter(({ relation_id }) => CheckRelationMandatory(relation_id, Data?.relation_id)).length === 1 ||
        member_option.some(({ created_by }) => created_by !== currentUser.id)
      )) {
      // todo: should not allowed delete member
      swal('Not Allowed to Delete Member')
      return null
    }
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        memberRemove(dispatch, { policy_id: policy_id, member_id: id }, policy_id,
          { flex, member_option, Data, midTerm, sum_insured: currentMember.suminsured, delete_member_relation_id: currentMember.relation_id/* , isParentPolicy */ },
          { dispatchRedux, policy_ids }
        )
      }
    });
  };

  const adoptedChild = watch("is_adopted_child");
  const disabled_child = watch('disabled_child');

  const onSubmit = (data) => {
    const formData = new FormData();

    // for (let elem in data) {
    //   formData.append(elem, data[elem]);
    // }
    // if (unmarried) {
    //   formData.set("unmarried_child", unmarried);
    // }
    if (specialMemberImg && specialFile) {
      formData.set("disabled_child", specialMemberImg);
      formData.set("special_child_image", specialFile);
      formData.set("is_special_child", specialMemberImg);
    } else {
      formData.set("disabled_child", specialMemberImg);
      formData.set("is_special_child", specialMemberImg);
    }
    // else if (Number(employee_relation) === 3 || Number(Data?.relation_id) === 3 || Number(employee_relation) === 4 || Number(Data?.relation_id) === 4) {
    //   formData.set("disabled_child", specialMemberImg);
    // }

    if (((flex?.suminsured && !isSelf && data.sum_insured) ||
      (!!flex?.suminsured_relation_wise &&
        [17].includes(flex?.suminsured_type_id) &&
        shouldShowSI(flex, member_option, Number(employee_relation), true))) || SelfSIUpdateIPD) {
      formData.set("sum_insured", data.sum_insured || Data?.suminsured);
    } else if (Data?.suminsured) {
      formData.set("sum_insured", Data?.suminsured);
    }
    if (flex?.premium && flex?.suminsured && !isSelf && data.sum_insured) {
      for (let i = 0; i < suminsureds?.length; i++) {
        if (
          Number(suminsureds[i].name) === data.sum_insured ||
          Number(suminsureds[i].name) === Data?.suminsured
        ) {
          formData.set("premium", premiums[i]?.name || Data?.total_premium);
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

    if ((flex?.opd_suminsured && !isSelf && data.sum_insured_opd) || SelfSIUpdateOPD) {
      formData.set("opd_suminsured", data.sum_insured_opd);
    } else if (Data?.opd_suminsured) {
      formData.set("opd_suminsured", Data?.opd_suminsured);
    }
    if (
      flex?.opd_suminsured &&
      flex?.opd_premium &&
      !isSelf &&
      data.sum_insured_opd
    ) {
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
      formData.append("member_marriage_date", data.member_marriage_date);
    }
    if (data.partner_document && data.partner_document[0] && !isSelf) {
      formData.append("partner_document", data.partner_document[0]);
    }
    formData.append(
      "member_relation_id",
      employee_relation || Data?.relation_id
    );
    formData.append(
      "member_gender",
      data.member_gender === "1" ? "Male" :
        (data.member_gender === "2"
          ? "Female"
          : "Other")
    );
    formData.append("member_firstname", data.member_firstname);
    data.member_lastname &&
      formData.append("member_lastname", data.member_lastname);
    data.member_contact_no &&
      formData.append("member_contact_no", data.member_contact_no);
    !isSelf &&
      data.member_email &&
      formData.append("member_email", data.member_email);
    formData.append("member_dob", data.member_dob);
    formData.append("is_unmarried_child", data.is_unmarried_child ? 1 : 0);
    formData.append("is_adopted_child", data.is_adopted_child ? 1 : 0);
    if (!isSelf && data.is_adopted_child && data.adopted_child_document[0]) {
      formData.append("adopted_child_document", data.adopted_child_document[0]);
    }

    (SelfSIUpdateIPD || SelfSIUpdateOPD) && formData.append("from_enrollment", true);

    flex?.main_suminsured_type_id === 3 && data.cover_type && formData.append("cover_type", data.cover_type);

    !midTerm && Data.id && formData.append("family_member_id", Data.id);
    formData.append("policy_id", policy_id);
    formData.append("type", (midTerm || !Data.id) ? 1 : 2);
    midTerm && formData.append("is_midterm_enrollement", 1);

    // not coming from backend
    // ((!!contribution?.ipd_employee_contribution ||
    //   !!contribution?.opd_employee_contribution) ||
    //   ((employee_relation === "3" || employee_relation === "4") && ChildValidation(contribution, member_option) &&
    //     (!!Number(Data?.ipd_employee_premium) ||
    //       !!Number(Data?.opd_employee_premium))
    //   ) ||
    //   [14, 15].includes(flex?.premium_id)) &&
    //   deductible &&
    //   formData.append("deductible", deductible);


    Data?.employer_verification_status === 2 &&
      formData.append("resolved_dependency", 1);
    Data?.employee_id && formData.append("employee_id", Data.employee_id);

    addMember(
      dispatch,
      formData,
      policy_id,
      Data?.employee_id,
      { flex, member_option, Data, midTerm, sum_insured: data.sum_insured, add_member_relation_id: (employee_relation || Data?.relation_id), cover_type: data.cover_type || member_option[0].cover_type/* , isParentPolicy */ },
      { dispatchRedux, policy_ids }
    );
  };

  const resetRender = (data) => {
    //let _isSpecialMember = relations.filter((elm) => Number(elm.id) === Number(data.target.value))
    setEmployee_relation(data.target.value);
    //setSpecialMember(_isSpecialMember[0].is_special_member);
    //setSpecial(_isSpecialMember[0].is_special_member)

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
  return (
    <div
      style={{ maxWidth: "450px" }}
      className="row w-100 justify-content-center mx-1"
    >
      <div className="col-12 my-2">
        <div className="row justify-content-center">
          <div style={{ textAlign: 'center' }} className="col-12 col-sm-5">
            <button className={`${classesone.grayBack}`}>
              {Data?.relation_name} Details <br />
              <span className="text-nowrap">{!!(SelfSIUpdateIPD || SelfSIUpdateOPD) && 'Enhnace Your Coverage'}</span>
            </button>
          </div>
        </div>
      </div>
      {(Boolean(!!Data?.suminsured) || !!Number(Data?.ipd_employee_premium)) && <div className={`${classesone.backPink} col-10 my-2 py-2`}>
        <div className="row w-100">
          <div className="col-6">
            {(!!Data?.suminsured) && <><small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
              {(Boolean(!!Data?.opd_suminsured) || !!Number(Data?.opd_employee_premium)) && 'IPD'} Sum Insured
            </small>
              <h5 className={`${classesone.redColor}`}>
                ₹ {comma(Data?.suminsured)} /-
              </h5></>}
          </div>
          <div className="col-6 text-right">
            {!UdaanLogicActivate && !!Number(Data?.ipd_employee_premium) && <><small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
              {(Boolean(!!Data?.opd_suminsured) || !!Number(Data?.opd_employee_premium)) && 'IPD'} Annual Premium
            </small>
              <h5 className={`${classesone.redColor}`}>
                ₹ {comma(Data?.ipd_employee_premium)} /-
              </h5></>}
          </div>
        </div>
      </div>}
      {(Boolean(!!Data?.opd_suminsured) || !!Number(Data?.opd_employee_premium)) && <div className={`${classesone.backPink} col-10 my-2 py-2`}>
        <div className="row w-100">
          <div className="col-6">
            {(!!Data?.opd_suminsured) && <><small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
              OPD Sum Insured
            </small>
              <h5 className={`${classesone.redColor}`}>
                ₹ {comma(Data?.opd_suminsured)} /-
              </h5></>}
          </div>
          <div className="col-6 text-right">
            {!!Number(Data?.opd_employee_premium) && <><small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
              OPD Annual Premium
            </small>
              <h5 className={`${classesone.redColor}`}>
                ₹ {comma(Data?.opd_employee_premium)} /-
              </h5></>}
          </div>
        </div>
      </div>}
      <form
        className="row w-100 justify-content-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="row w-100 justify-content-between">
          {Data?.relation_id !== 1 && (
            <div

              className="col-12 col-sm-6 w-100"
            >
              <Controller
                as={
                  <Select
                    label="Relation With Employee"
                    placeholder="Select Relation With Employee"
                    options={
                      relations?.map((item) => ({
                        id: item.id,
                        name: item.name,
                        value: item.id,
                      })) || []
                    }
                    valueName="name"
                    id="employee_relation"
                  />
                }
                disabled
                error={errors && errors.member_relation_id}
                onChange={([data]) => {
                  resetRender(data);
                  setValue([
                    { member_dob: "" },
                    { member_marriage_date: "" },
                  ]);
                  return data
                }}
                name="member_relation_id"
                control={control}
              />
            </div>
          )}
          <div

            className="col-12 col-sm-6 w-100"
          >
            <Controller
              as={
                <Select
                  style={{ backgroundColor: "white" }}
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
                  disabled={isSelf}
                />
              }
              error={errors && errors.member_gender}
              // onChange={([data]) => { setGender(data); return data }}
              name="member_gender"
              control={control}
            />
            {!!errors.member_gender && (
              <Error>{errors.member_gender.message}</Error>
            )}
          </div>
          <div

            className="col-12 col-sm-6 w-100"
          >
            <Controller
              as={
                <Input
                  style={{ backgroundColor: "white" }}
                  label="First Name"
                  placeholder="Enter First Name"
                  required
                  maxLength={50}
                  disabled={isSelf}
                />
              }
              error={errors && errors.member_firstname}
              // onChange={([e]) => { setFirst_name(e.target.value); return e }}
              control={control}
              name="member_firstname"
            />
            {!!errors.member_firstname && (
              <Error>{errors.member_firstname.message}</Error>
            )}
          </div>
          <div

            className="col-12 col-sm-6 w-100"
          >
            <Controller
              as={
                <Input
                  style={{ backgroundColor: "white" }}
                  label="Last Name"
                  placeholder="Enter Last Name"
                  maxLength={50}
                  required={false}
                  disabled={isSelf}
                />
              }
              error={errors && errors.member_lastname}
              // onChange={([e]) => { setLast_name(e.target.value); return e }}
              control={control}
              name="member_lastname"
            />
            {!!errors.member_lastname && (
              <Error>{errors.member_lastname.message}</Error>
            )}
          </div>
          <div

            className="col-12 col-sm-6 w-100"
          >
            <Controller
              as={
                <Input
                  style={{ backgroundColor: "white" }}
                  label="Contact No"
                  placeholder="Enter Contact No"
                  min={0}
                  required={false}
                  type="tel"
                  maxLength={10}
                  onKeyDown={numOnly}
                  onKeyPress={noSpecial}
                  error={errors && errors.member_contact_no}
                  disabled={isSelf}
                />
              }
              control={control}
              name="member_contact_no"
            />
            {!!errors.member_contact_no && (
              <Error>{errors.member_contact_no.message}</Error>
            )}
          </div>
          <div

            className="col-12 col-sm-6 w-100"
          >
            <Controller
              as={
                <Input
                  style={{ backgroundColor: "white" }}
                  label="Email"
                  placeholder="Enter Email"
                  type="email"
                  maxLength={50}
                  required={false}
                  disabled={isSelf}
                />
              }
              error={errors && errors.member_email}
              control={control}
              name="member_email"
            />
            {!!errors.member_email && (
              <Error>{errors.member_email.message}</Error>
            )}
          </div>
          <div

            className="col-12 col-sm-6 w-100"
          >
            <Controller
              as={<Input label="Date of Birth" type="date" required
                style={{ backgroundColor: "white" }}
                disabled={isSelf} />}
              name="member_dob"
              {...(midTerm &&
                ["3", "4"].includes(employee_relation) && {
                min: formatDate(
                  subDays(
                    new Date(),
                    flex?.default_midterm_enrollement_days - 1
                  )
                ),
              })}
              max={formatDate(new Date())}
              error={errors && errors.member_dob}
              // onChange={([e]) => { setDob(e.target.value); return e }}
              control={control}
            />
            {!!errors.member_dob && (
              <Error>{errors.member_dob.message}</Error>
            )}
          </div>
          {employee_relation === "2" && (
            <div

              className="col-12 col-sm-6 w-100"
            >
              <Controller
                as={
                  <Input
                    style={{ backgroundColor: "white" }}
                    label="Member Marriage Date" type="date" required={false} disabled={isSelf} />
                }
                name="member_marriage_date"
                {...(midTerm && {
                  min: formatDate(
                    subDays(
                      new Date(),
                      flex?.default_midterm_enrollement_days - 1
                    )
                  ),
                })}
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
          {(flex?.main_suminsured_type_id === 3 && parentIndex === 0) && (
            <Col md={6} lg={6} xl={6} sm={12}>
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
            </Col>
          )}

          {/* Sum Insured */}
          {(((((
            (
              (
                flex?.main_suminsured_type_id === 1 /* ||
                cover_type === 1 */
              ) ||
              parentIndex === 0
            ) &&
            (
              [1, 5].includes(flex?.suminsured_type_id) ||
              (
                [9, 13, 14].includes(flex?.suminsured_type_id) &&
                (
                  parentIndex === 0 ||
                  flex?.main_suminsured_type_id === 3
                )
              )
            )
          ) ||
            (
              [9].includes(flex?.suminsured_type_id) &&
              flex?.main_suminsured_type_id === 3 /* || isParentPolicy */ &&
              isParentPairFirst(Number(employee_relation), member_option, true/* , isParentPolicy */))
          )) &&
            !!suminsureds?.length && suminsureds?.length !== 1 && !isSelf) || (!!SelfSIUpdateIPD && !!suminsureds?.length)) && (
              <Col md={6} lg={6} xl={6} sm={12}>
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
              </Col>
            )}

          {/* Sum Insured RelationWise */}
          {((!!flex?.suminsured_relation_wise &&
            [17].includes(flex?.suminsured_type_id) &&
            shouldShowSI(flex, member_option, Number(employee_relation), true) && (!isSelf || !!SelfSIUpdateIPD))) && (
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
          {((((flex?.opd_suminsured_type_id === 1 || parentIndex === 0) && ([1, 5].includes(flex?.opd_suminsured_sub_type_id) ||
            ([9, 13, 14].includes(flex?.opd_suminsured_sub_type_id) && parentIndex === 0))) &&
            !!suminsureds_opd?.length && suminsureds_opd?.length !== 1 && !isSelf) || !!SelfSIUpdateOPD) && (
              <Col md={6} lg={6} xl={6} sm={12}>
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
              </Col>
            )}

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
                      // .filter((_, index) => {
                      //   const SelfSelectedOption = member_option.find(({ relation_id }) => relation_id === 1)?.number_of_time_salary
                      //   const SelfOptions = flex?.number_of_time_salary.find(({ relation_id }) => Number(relation_id) === 1)?.number_of_time_salary
                      //   const indexOfSelf = SelfOptions.findIndex((salary) => Number(salary) === Number(SelfSelectedOption))
                      //   Number(member_option?.[0]?.number_of_time_salary);
                      //   return indexOfSelf === index
                      // })
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
        </div>
        {!isSelf && (employee_relation === "3" || employee_relation === "4") &&
          !!flex?.unmarried_child && (
            <Row className="w-100">
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="unmarried_check"
                      className="custom-control-input"
                      type="checkbox"
                    />
                  }
                  defaultValue={true}
                  name="is_unmarried_child"
                  control={control}
                />
                <Label className="custom-control-label" htmlFor="unmarried_check">
                  Unmarried Child
                </Label>
              </InputWrapper>
            </Row>
          )}
        {!isSelf && (employee_relation === "3" || employee_relation === "4") &&
          !!flex?.has_adopted_child && (
            <Row className="w-100">
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="adopted_check"
                      className="custom-control-input"
                      type="checkbox"
                    />
                  }
                  defaultValue={!!Data?.is_adopted_child}
                  name="is_adopted_child"
                  control={control}
                  onChange={([selected]) => {
                    const target = selected.target;
                    const checked = target && target.checked ? 1 : 0;
                    return checked
                  }}
                />
                <Label className="custom-control-label" htmlFor="adopted_check">
                  Adopted Child
                </Label>
              </InputWrapper>
            </Row>
          )}
        {!isSelf && !!adoptedChild && (
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
                required={(!Data?.adopted_child_document && !ModuleControl.isTATA) ? true : false}
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
        )}
        {!isSelf && (employee_relation === "3" || employee_relation === "4") &&
          !!flex?.has_special_child && shouldAskforSpecialChild(originalRelation, member_dob, specialMemberImg, setValue, setSpecialMemberImg, disabled_child === undefined ? !!Data.is_special_child : disabled_child) && (
            <Row className="w-100">
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="special_check"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={!!Data.is_special_child}
                    />
                  }
                  name="disabled_child"
                  control={control}
                  onChange={onChangeSpecialm}
                />
                <Label className="custom-control-label" htmlFor="special_check">
                  Special Child
                </Label>
              </InputWrapper>
            </Row>
          )}
        {!isSelf && !!specialMemberImg && (
          <Row className="w-100 mt-1">
            <Col className="text-left" md={12} lg={12} xl={12} sm={12}>
              <AttachFile
                name="special_member_image"
                title="Attach Special Child Certificate"
                key="special_file"
                accept=".jpeg, .png, .jpg"
                onUpload={(files) => setSpecialFile(files[0])}
                description="File Formats: jpeg, png, jpg"
                nameBox
                required={(!Data?.special_child_image && !ModuleControl.isTATA) ? true : false}
              />
              {!!Data?.special_child_image && <AnchorTag href={"#"}
                onClick={() => downloadFile(Data?.special_child_image, null, true)}
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
        )}
        {/* {employee_relation === "2" &&
            Gender[selfGender] === currentMemberGender && (
              <Row>
                <Col className="text-left" md={12} lg={12} xl={12} sm={12}>
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
              </Row>
            )} */}
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
                  description="File Formats: jpeg, png, jpg "
                  nameBox
                  required={false}
                  error={errors && errors.premium_file}
                />
              </Col>
            </Row>} */}

        {/* Not Coming from Backend */}
        {/* {!isSelf && ((!!contribution?.ipd_employee_contribution ||
            !!contribution?.opd_employee_contribution) ||
            ((employee_relation === "3" || employee_relation === "4") && ChildValidation(contribution, member_option) &&
              (!!Number(Data?.ipd_employee_premium) ||
                !!Number(Data?.opd_employee_premium))
            ) ||
            [14, 15].includes(flex?.premium_id)) &&
            !!(flex?.has_payroll || flex?.has_wallet) && (
              <div className="text-left">

                <Typography>{"\u00A0"}Premium deduction</Typography>
                <TabWrapper
                  style={{ zoom: "0.85" }}
                  width={'max-content'}
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
              </div>
            )} */}
        <div className="row justify-content-between w-100 my-2">
          <div className="col-6">
            {!isSelf && (
              <div
                className="mr-1 btn btn-danger w-100"
                onClick={() => removeMember(Data?.id)}
              >
                Delete Member
              </div>
            )}
          </div>
          {(!isSelf || !!SelfSIUpdateIPD || !!SelfSIUpdateOPD) && (
            <div className="col-6">
              <button className="btn btn-success w-100" type={"submit"}>
                Save & Update
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DrawerForm;

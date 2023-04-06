/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import swal from "sweetalert";

import {
  Select,
  Input,
  Checkbox,
  Button,
  Marker,
  Typography,
  Head,
} from "components";
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";

import {
  Wrapper,
  Title,
  FormWrapper,
  InputWrapper,
  SmallInput,
} from "./styles";
import { useSelector } from "react-redux";
import { CustomCheck } from "../../approve-policy/style";
import { sortRelation } from "../../../RFQ/plan-configuration/helper";
import { noSpecial, numOnly } from "utils";
import { Error } from "../../../../components";

export const MidtermEnrollment = (is_spouse, is_partner) => [
  { id: 1, value: 1, name: "Date of Upload" },
  {
    id: 2,
    value: 2,
    name: is_partner ? 'Employee Cover Start Date' :
      ("Date of " +
        ((is_spouse) ? "Marriage" : "Birth"))
  },
];

const MemberDetails = (props) => {
  const { configs, savedConfig = {}, formId, onSave, moveNext } = props;
  const { control, errors, register, watch, handleSubmit, setValue } = useForm({
    defaultValues: savedConfig || {},
  });
  const [members, setMembers] = useState(savedConfig.ages?.length || 1);
  const [hasUnmarried, setHasUnmarried] = useState(
    savedConfig.has_unmarried_child ? true : false
  );
  // const [employeeInc, setEmployeeInc] = useState(savedConfig.is_employee_included ?? 1);
  const [showAgeLimit, setShowAgeLimit] = useState(
    savedConfig.ages?.map((elem) => (elem?.no_limit ? true : false)) || []
  );
  const [memberRelation, setMemberRelation] = useState(
    savedConfig.ages?.map((elem) => String(elem?.relation_id || 1)) || [1]
  );
  const policyConfigState = useSelector((state) => state.policyConfig);
  const [memberError, setMemberError] = useState(false);
  const employeeInc = watch("is_employee_included");
  const is_midterm_enrollement_allowed_for_spouse = watch(
    "is_midterm_enrollement_allowed_for_spouse"
  );
  const is_midterm_enrollement_allowed_for_partner = watch(
    "is_midterm_enrollement_allowed_for_partner"
  );
  const is_midterm_enrollement_allowed_for_kids = watch(
    "is_midterm_enrollement_allowed_for_kids"
  );
  const no_of_parents = watch("no_of_parents");

  useEffect(() => {
    if (Number(employeeInc) === 0 && Number(members) === 1) {
      setMembers(2);
    }
  }, [employeeInc, members]);

  useEffect(() => {
    const { stepSaved } = policyConfigState;
    if (stepSaved && stepSaved === formId) {
      moveNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyConfigState]);

  useEffect(() => {
    if (members) {
      let tempData = [...memberRelation];
      tempData.length = members;
      for (let i = 0; i < members; i++) {
        if (
          !tempData[i] &&
          savedConfig?.ages?.length &&
          savedConfig?.ages[i]?.relation_id
        ) {
          tempData[i] = String(savedConfig.ages[i]?.relation_id);
        }
      }
      setMemberRelation(tempData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  useEffect(() => {
    if (memberRelation.includes("5") || memberRelation.includes("7")) {
      register("no_of_parents", {
        required: true,
        min: 1,
        max:
          memberRelation.includes("5") && memberRelation.includes("7") ? 4 : 2,
      });
      setValue("no_of_parents", no_of_parents);
    }
    // else {
    //   register('no_of_parents', { required: false });
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberRelation]);

  const addCount = () => {
    setMembers((prev) => (prev ? prev + 1 : 1));
  };

  const subCount = () => {
    setMembers((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const onSubmit = (data) => {
    if (
      Number(members) !==
      memberRelation.filter(
        (elem, index) =>
          (elem !== "undefined" && elem !== "null" && elem) || index === 0
      ).length &&
      Number(members) !== 1
    ) {
      setMemberError(true);
      // swal("Validation","Relation not selected", "info");
      return;
    }

    if (Number(data.is_employee_included)) {
      data.ages[0].relation_id = "1";
    }
    const result = {
      ages: data.ages,
      no_of_member: data.no_of_member,
      no_of_adult: 0,
      no_of_spouse: data.no_of_spouse || 0,
      no_of_partner: data.no_of_partner || 0,
      // no_of_daughter: Number(data.no_of_daughter) || 0,
      // no_of_son: Number(data.no_of_son) || 0,
      no_of_child: Number(data.no_of_child || 0),
      no_of_siblings: Number(data.no_of_siblings || 0),
      no_of_parents: Number(data.no_of_parents || 0),
      is_employee_included: data.is_employee_included,
      has_special_child: data.has_special_child ? 1 : 0,
      has_unmarried_child: data.has_unmarried_child ? 1 : 0,
      has_adopted_child: data.has_adopted_child ? 1 : 0,
      parent_cross_selection: data.parent_cross_selection ? 1 : 0,
      max_twins: data.max_twins || 0,
      is_parent_policy: data.ages.every(({ relation_id }) =>
        [5, 6, 7, 8].includes(Number(relation_id))
      )
        ? 1
        : 0,
      // Spouse
      is_midterm_enrollement_allowed_for_spouse: data.is_midterm_enrollement_allowed_for_spouse
        ? 1
        : 0,
      ...(data.is_midterm_enrollement_allowed_for_spouse && {
        default_midterm_enrollement_days_for_spouse: data.default_midterm_enrollement_days_for_spouse,
        midterm_premium_calculation_from_for_spouse: data.midterm_premium_calculation_from_for_spouse,
      }),
      // Partner
      is_midterm_enrollement_allowed_for_partner: data.is_midterm_enrollement_allowed_for_partner
        ? 1
        : 0,
      ...(data.is_midterm_enrollement_allowed_for_partner && {
        default_midterm_enrollement_days_for_partner: 0,
        midterm_premium_calculation_from_for_partner: data.midterm_premium_calculation_from_for_partner,
      }),
      // Child
      is_midterm_enrollement_allowed_for_kids: data.is_midterm_enrollement_allowed_for_kids
        ? 1
        : 0,
      ...(data.is_midterm_enrollement_allowed_for_kids && {
        default_midterm_enrollement_days_for_kids: data.default_midterm_enrollement_days_for_kids,
        midterm_premium_calculation_from_for_kids: data.midterm_premium_calculation_from_for_kids,
      }),
      ...(data.has_unmarried_child && {
        unmarried_min_age: data.unmarried_min_age,
      }),
    };
    const ages = data?.ages;
    for (let i = 0; i < ages.length; i++) {
      if (
        !ages[i]?.no_limit &&
        ([3, 4, 9].includes(Number(ages[i]?.relation_id)))
      ) {
        if (Number(ages[i]?.min_age) < 0 || Number(ages[i]?.min_age) > 150) {
          swal(
            "Validation",
            filteredRelation.find((elem) => elem.id == ages[i].relation_id)
              ?.name +
            " Min age is wrong!\n* Should be in between 0-150\n* Should be less than Max Age",
            "info"
          );
          return;
        }
        if (
          Number(ages[i]?.max_age) < 0 ||
          Number(ages[i]?.max_age) < Number(ages[i]?.min_age) ||
          Number(ages[i]?.max_age) > 150
        ) {
          swal(
            "Validation",
            filteredRelation.find((elem) => elem.id == ages[i].relation_id)
              ?.name +
            " Max age is wrong!\n* Should be in between 0-150\n* Should be more than Min Age",
            "info"
          );
          return;
        }
      } else if (!ages[i]?.no_limit) {
        if (Number(ages[i]?.min_age) < 18 || Number(ages[i]?.min_age) > 150) {
          swal(
            "Validation",
            (filteredRelation.find((elem) => elem.id == ages[i].relation_id)
              ?.name || "Self") +
            " Min age is wrong!\n* Should be in between 18-150\n* Should be less than Max Age",
            "info"
          );
          return;
        }
        if (
          Number(ages[i]?.max_age) < 18 ||
          Number(ages[i]?.max_age) < Number(ages[i]?.min_age) ||
          Number(ages[i]?.max_age) > 150
        ) {
          swal(
            "Validation",
            (filteredRelation.find((elem) => elem.id == ages[i].relation_id)
              ?.name || "Self") +
            " Max age is wrong!\n* Should be in between 18-150\n* Should be more than Min Age",
            "info"
          );
          return;
        }
      }
    }

    if (onSave) onSave({ formId, data: result });
  };

  const filteredRelation = sortRelation(configs.familyLabels);
  const _renderFamilyMembers = () => {
    return (
      <>
        <Marker />
        <Typography>{"\u00A0"} Allowed Relation in Policy</Typography>
        {[...Array(Number(members))].map(
          (_, index) =>
            ((index === 0 && !!Number(employeeInc)) || index !== 0) &&
            <React.Fragment key={`member-${index}`}>
              <Row
                style={{ borderTop: index !== 0 && "1px solid #c5c5c5" }}
              >
                {index === 0 ? (
                  <Col xl={3} lg={4} md={6} sm={12} className="ml-2">
                    <Controller
                      as={
                        <Input
                          label="Member Type"
                          placeholder="Select Member Type"
                          value="Self"
                          disabled
                          error={errors && errors.members}
                          labelProps={{
                            background: "linear-gradient(#ffffff, #dadada)",
                          }}
                        />
                      }
                      defaultValue={"Self"}
                      name={`dummy_data`}
                      control={control}
                    // rules={{ required: true }}
                    />
                    <Controller
                      as={<input type="hidden" value={1} />}
                      defaultValue={1}
                      name={`ages[0].relation_id`}
                      control={control}
                    />
                  </Col>
                ) : (
                  <Col xl={3} lg={4} md={6} sm={12} className="ml-2">
                    <Controller
                      as={
                        <Select
                          label="Member Type"
                          placeholder="Select Member Type"
                          options={filteredRelation
                            .filter(
                              (elem) =>
                                !memberRelation.includes(String(elem.id)) ||
                                elem.id === Number(memberRelation[index])
                            )
                            .map((elem) => ({ ...elem, value: elem.id }))}
                          required
                          error={
                            memberError &&
                            (["undefined", "null", ""].includes(
                              memberRelation[index]
                            ) ||
                              !memberRelation[index])
                          }
                        />
                      }
                      name={`ages[${index}].relation_id`}
                      control={control}
                      onChange={([e]) => {
                        const value = e.target.value;
                        setMemberRelation((prev) => {
                          prev[index] = value;
                          return [...prev];
                        });
                        return e;
                      }}
                      rules={{ required: true }}
                    />
                  </Col>
                )}

                <Col xl={2} lg={4} md={6} sm={12} className="ml-3 my-auto">
                  <InputWrapper className="custom-control custom-checkbox no-heading">
                    <Controller
                      as={
                        <input
                          id={`${index}-no-limit`}
                          className="custom-control-input"
                          type="checkbox"
                        // required
                        />
                      }
                      name={`ages[${index}].no_limit`}
                      control={control}
                      onChange={([ev]) => {
                        const target = ev.target;
                        const checked = target ? target.checked : false;
                        setShowAgeLimit((prev) => {
                          prev[index] = checked;
                          return [...prev];
                        });
                        return checked;
                      }}
                    // rules={{ required: true }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor={`${index}-no-limit`}
                    >
                      No Age Limit
                    </label>
                  </InputWrapper>
                </Col>
                <Controller
                  as={<input type="hidden" />}
                  name={`ages[${index}].relation_id`}
                  control={control}
                // defaultValue={member.id}
                />
                {!showAgeLimit[index] && (
                  <>
                    <Col xl={3} lg={4} md={6} sm={12}>
                      <SmallInput>
                        <Controller
                          as={
                            <Input
                              label="Min Age"
                              placeholder="ex 40"
                              type="number"
                              noWrapper
                              // min={isChild ? 0 : 18}
                              onKeyDown={numOnly}
                              onKeyPress={noSpecial}
                              max={150}
                              required
                              error={
                                errors &&
                                errors["ages"] &&
                                errors["ages"][`${index}`] &&
                                errors["ages"][`${index}`]["min_age"]
                              }
                            />
                          }
                          name={`ages[${index}].min_age`}
                          control={control}
                          rules={{ required: true, min: 0, max: 150 }}
                        />
                      </SmallInput>
                    </Col>
                    <Col xl={3} lg={4} md={6} sm={12}>
                      <SmallInput>
                        <Controller
                          as={
                            <Input
                              label="Max Age"
                              placeholder="ex 40"
                              type="number"
                              // min={isChild ? 0 : 18}
                              onKeyDown={numOnly}
                              onKeyPress={noSpecial}
                              max={150}
                              noWrapper
                              required
                              error={
                                errors &&
                                errors["ages"] &&
                                errors["ages"][`${index}`] &&
                                errors["ages"][`${index}`]["max_age"]
                              }
                            />
                          }
                          name={`ages[${index}].max_age`}
                          control={control}
                          rules={{ required: true, min: 0, max: 150 }}
                        />
                      </SmallInput>
                    </Col>
                  </>
                )}
                {[3, 5, 7].includes(
                  Number(watch(`ages[${index}].relation_id`))
                ) && (
                    <>
                      <Row className="mx-0 mx-sm-2 w-100">
                        <Col xl={4} lg={5} md={4} sm={12}>
                          <Controller
                            as={
                              <Select
                                label={`${Number(
                                  watch(`ages[${index}].relation_id`)
                                ) === 3
                                  ? "Children"
                                  : Number(
                                    watch(`ages[${index}].relation_id`)
                                  ) === 5
                                    ? "Parents"
                                    : "Parents In Law"
                                  } Age Depend`}
                                placeholder="Select Member"
                                options={[
                                  { id: 1, value: 1, name: "Self" },
                                  ...filteredRelation
                                    .filter(
                                      (elem) =>
                                        memberRelation.includes(
                                          String(elem.id)
                                        ) && [2, 10].includes(Number(elem.id))
                                    )
                                    .map((elem) => ({
                                      ...elem,
                                      value: elem.id,
                                    })),
                                ]}
                                required={true}
                                error={
                                  errors &&
                                  errors["ages"] &&
                                  errors["ages"][`${index}`] &&
                                  errors["ages"][`${index}`][
                                  "difference_from_relation"
                                  ]
                                }
                              />
                            }
                            defaultValue={1}
                            name={`ages[${index}].difference_from_relation`}
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>
                        <Col xl={4} lg={5} md={4} sm={12}>
                          <Controller
                            as={
                              <Input
                                label="Age Difference"
                                placeholder="Enter Age Difference"
                                type="tel"
                                maxLength={2}
                                onKeyDown={numOnly}
                                onKeyPress={noSpecial}
                                required={true}
                                error={
                                  errors &&
                                  errors["ages"] &&
                                  errors["ages"][`${index}`] &&
                                  errors["ages"][`${index}`]["age_difference"]
                                }
                              />
                            }
                            isRequired={true}
                            name={`ages[${index}].age_difference`}
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>
                        {[5, 7].includes(
                          Number(watch(`ages[${index}].relation_id`))
                        ) && (
                            <Col xl={4} lg={5} md={4} sm={12}>
                              <Head className="text-center">
                                {Number(watch(`ages[${index}].relation_id`)) === 5
                                  ? "Parents"
                                  : "Parents In Law"}{" "}
                                Allowed For - Employee
                              </Head>
                              <div
                                className="d-flex justify-content-around flex-wrap mt-2"
                                style={{ margin: "0 39px 40px -12px" }}
                              >
                                <CustomControl className="d-flex mt-4 mr-0">
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      paddingLeft: "27px",
                                      marginBottom: "0px",
                                    }}
                                  >
                                    {"Male"}
                                  </p>
                                  <input
                                    ref={register}
                                    name={`ages[${index}].is_allowed_for_gender`}
                                    type={"radio"}
                                    value={0}
                                  />
                                  <span></span>
                                </CustomControl>
                                <CustomControl className="d-flex mt-4 ml-0">
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      paddingLeft: "27px",
                                      marginBottom: "0px",
                                    }}
                                  >
                                    {"Female"}
                                  </p>
                                  <input
                                    ref={register}
                                    name={`ages[${index}].is_allowed_for_gender`}
                                    type={"radio"}
                                    value={1}
                                  />
                                  <span></span>
                                </CustomControl>
                                <CustomControl className="d-flex mt-4 ml-0">
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      paddingLeft: "27px",
                                      marginBottom: "0px",
                                    }}
                                  >
                                    {"Both"}
                                  </p>
                                  <input
                                    ref={register}
                                    name={`ages[${index}].is_allowed_for_gender`}
                                    type={"radio"}
                                    value={2}
                                    defaultChecked={true}
                                  />
                                  <span></span>
                                </CustomControl>
                              </div>
                            </Col>
                          )}
                      </Row>
                    </>
                  )}
                {/* {index !== 0 &&
                <Col xl={2} lg={4} md={6} sm={12} className="ml-3 my-auto">
                  <InputWrapper className="custom-control custom-checkbox no-heading">
                    <Controller
                      as={
                        <input
                          id={`${index}-is_special_member_allowed`}
                          className="custom-control-input"
                          type="checkbox"
                        // required
                        />
                      }
                      name={`ages[${index}].is_special_member_allowed`}
                      control={control}
                      onChange={([ev]) => {
                        const target = ev.target;
                        const checked = target ? target.checked : false;
                        return checked;
                      }}
                    // rules={{ required: true }}
                    />
                    <label className="custom-control-label" htmlFor={`${index}-is_special_member_allowed`}>Special Member</label>
                  </InputWrapper>
                </Col>
              } */}
              </Row>
              {/* <Row>
              
            </Row> */}
            </React.Fragment>
        )}
        <Row className="mt-3">
          <Col className="d-flex justify-content-end align-items-center">
            <Button buttonStyle="warning" type="button" onClick={addCount}>
              <i className="ti ti-plus"></i> Add{"\u00A0"}
            </Button>
            {members !== 1 && (
              <Button buttonStyle="danger" type="button" onClick={subCount}>
                <i className="ti ti-minus"></i> Remove
              </Button>
            )}
          </Col>
        </Row>
        <Row className="pl-3 mt-4">
          {memberRelation.includes("2") && (
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Spouse"
                    placeholder="Enter Spouse Limit"
                    min={1}
                    max={4}
                    type="number"
                    error={errors && errors["no_of_spouse"]}
                    required={false}
                    isRequired={true}
                  />
                }
                defaultValue={"1"}
                rules={{ required: true, min: 1, max: 4 }}
                name="no_of_spouse"
                control={control}
              />
            </Col>
          )}
          {memberRelation.includes("10") && (
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Partner"
                    placeholder="Enter Partner Limit"
                    min={1}
                    max={4}
                    type="number"
                    error={errors && errors["no_of_partner"]}
                    required={false}
                    isRequired={true}
                  />
                }
                defaultValue={"1"}
                rules={{ required: true, min: 1, max: 4 }}
                name="no_of_partner"
                control={control}
              />
            </Col>
          )}
          {memberRelation.includes("3") && (
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Child"
                    placeholder="Enter Child Limit"
                    min={1}
                    max={10}
                    type="number"
                    error={errors && errors["no_of_child"]}
                    required={false}
                    isRequired={true}
                  />
                }
                defaultValue={"1"}
                rules={{ required: true, min: 1, max: 10 }}
                name="no_of_child"
                control={control}
              />
            </Col>
          )}
          {(memberRelation.includes("5") || memberRelation.includes("7")) && (
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label={`No. of ${memberRelation.includes("5") ? "Parents" : ""
                      } ${memberRelation.includes("5") &&
                        memberRelation.includes("7")
                        ? "&"
                        : ""
                      } ${memberRelation.includes("7") ? "Parents in Law" : ""}`}
                    placeholder="Enter Limit"
                    min={1}
                    max={
                      memberRelation.includes("5") &&
                        memberRelation.includes("7")
                        ? 4
                        : 2
                    }
                    type="number"
                    error={errors && errors["no_of_parents"]}
                    required={false}
                    isRequired={true}
                  />
                }
                defaultValue={"1"}
                rules={{
                  required: true,
                  min: 1,
                  max:
                    memberRelation.includes("5") && memberRelation.includes("7")
                      ? 4
                      : 2,
                }}
                name="no_of_parents"
                control={control}
              />
            </Col>
          )}
          {memberRelation.includes("9") && (
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Sibling"
                    placeholder="Enter Sibling Limit"
                    min={1}
                    max={10}
                    type="number"
                    error={errors && errors["no_of_siblings"]}
                    required={false}
                    isRequired={true}
                  />
                }
                defaultValue={"1"}
                rules={{ required: true, min: 1, max: 10 }}
                name="no_of_siblings"
                control={control}
              />
            </Col>
          )}
          {/* {memberRelation.includes('4') &&
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Son"
                    placeholder="Enter Son Limit"
                    min={1}
                    max={10}
                    type="number"
                    error={errors && errors['no_of_son']}
                    required={false}
                    isRequired={true}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 10 }}
                name="no_of_son"
                control={control}
              />
            </Col>
          } */}
        </Row>
        {(memberRelation.includes("2") ||
          memberRelation.includes("3") ||
          memberRelation.includes("4")) && (
            <Row>
              <Col md={12} lg={12} xl={12} sm={12}>
                <TextCard
                  className="px-1 px-md-3 pt-3 mb-4 mt-4"
                  borderRadius="10px"
                  noShadow
                  border="1px dashed #929292"
                  bgColor="#f8f8f8"
                >
                  <Marker />
                  <Typography>
                    {"\u00A0"} Midterm Allowed for{" "}
                    {(function () {
                      let result = '';
                      if (
                        memberRelation.includes("2") &&
                        (memberRelation.includes("3") ||
                          memberRelation.includes("4")) &&
                        memberRelation.includes("10")
                      )
                        result = "Spouse, Partner & Child";
                      if (
                        memberRelation.includes("2") &&
                        (memberRelation.includes("3") ||
                          memberRelation.includes("4"))
                      )
                        result = "Spouse & Child";
                      if (memberRelation.includes("2")) result = "Spouse";
                      else result = "Child";
                      if (memberRelation.includes("10")) {
                        result = !result ? 'Partner' : ('Partner' + (result.includes('&') ? ', ' : ' & ') + result)
                      }
                      return result
                    })()}{" "}
                  </Typography>
                  <br />

                  {memberRelation.includes("2") && <>


                    {/* Spouse */}
                    <CustomCheck className="custom-control-checkbox">
                      <label className="custom-control-label-check  container-check">
                        <span>{"Is Midterm Allowed for Spouse?"}</span>
                        <Controller
                          as={
                            <input
                              name={"is_midterm_enrollement_allowed_for_spouse"}
                              type="checkbox"
                              defaultChecked={
                                savedConfig?.is_midterm_enrollement_allowed_for_spouse
                              }
                            />
                          }
                          name={"is_midterm_enrollement_allowed_for_spouse"}
                          onChange={([e]) => (e.target.checked ? 1 : 0)}
                          control={control}
                          defaultValue={0}
                        />
                        <span className="checkmark-check"></span>
                      </label>
                    </CustomCheck>
                    {!!is_midterm_enrollement_allowed_for_spouse && (
                      <Row>
                        <Col xl={6} lg={9} md={12} sm={12}>
                          <Controller
                            as={
                              <Input
                                label="Spouse Enrolment Allowed Days (Mid Term)"
                                placeholder="Enter Spouse Enrolment Allowed Days (Mid Term)"
                                type="number"
                                min={0}
                                required
                                labelProps={{ background: "#f8f8f8" }}
                                error={
                                  errors && errors.default_midterm_enrollement_days_for_spouse
                                }
                              />
                            }
                            rules={{ required: true, min: 1, max: 365 }}
                            control={control}
                            name="default_midterm_enrollement_days_for_spouse"
                          />
                          {!!errors.default_midterm_enrollement_days_for_spouse && <Error>
                            {errors.default_midterm_enrollement_days_for_spouse.type === 'max' && 'Max Limit 365'}
                            {errors.default_midterm_enrollement_days_for_spouse.type === 'min' && 'Required Min 1'}
                            {errors.default_midterm_enrollement_days_for_spouse.type === 'required' && 'Required'}
                          </Error>}
                        </Col>

                        <Col xl={6} lg={9} md={12} sm={12}>
                          <Controller
                            as={
                              <Select
                                label="Spouse Enrolment Considered From (Mid Term)"
                                placeholder="Select Spouse Enrolment Considered From (Mid Term)"
                                required
                                labelProps={{ background: "#f8f8f8" }}
                                options={MidtermEnrollment(true)}
                                error={
                                  errors && errors.midterm_premium_calculation_from_for_spouse
                                }
                              />
                            }
                            rules={{ required: true }}
                            control={control}
                            name="midterm_premium_calculation_from_for_spouse"
                          />
                        </Col>
                      </Row>
                    )}
                  </>}
                  {memberRelation.includes("10") && <>


                    {/* Spouse */}
                    <CustomCheck className="custom-control-checkbox">
                      <label className="custom-control-label-check  container-check">
                        <span>{"Is Midterm Allowed for Partner?"}</span>
                        <Controller
                          as={
                            <input
                              name={"is_midterm_enrollement_allowed_for_partner"}
                              type="checkbox"
                              defaultChecked={
                                savedConfig?.is_midterm_enrollement_allowed_for_partner
                              }
                            />
                          }
                          name={"is_midterm_enrollement_allowed_for_partner"}
                          onChange={([e]) => (e.target.checked ? 1 : 0)}
                          control={control}
                          defaultValue={0}
                        />
                        <span className="checkmark-check"></span>
                      </label>
                    </CustomCheck>
                    {!!is_midterm_enrollement_allowed_for_partner && (
                      <Row>
                        {/* <Col xl={6} lg={9} md={12} sm={12}>
                          <Controller
                            as={
                              <Input
                                label="Partner Enrolment Allowed Days (Mid Term)"
                                placeholder="Enter Partner Enrolment Allowed Days (Mid Term)"
                                type="number"
                                min={0}
                                required
                                labelProps={{ background: "#f8f8f8" }}
                                error={
                                  errors && errors.default_midterm_enrollement_days_for_partner
                                }
                              />
                            }
                            rules={{ required: true, min: 1, max: 365 }}
                            control={control}
                            name="default_midterm_enrollement_days_for_partner"
                          />
                          {!!errors.default_midterm_enrollement_days_for_partner && <Error>
                            {errors.default_midterm_enrollement_days_for_partner.type === 'max' && 'Max Limit 365'}
                            {errors.default_midterm_enrollement_days_for_partner.type === 'min' && 'Required Min 1'}
                            {errors.default_midterm_enrollement_days_for_partner.type === 'required' && 'Required'}
                          </Error>}
                        </Col> */}

                        <Col xl={6} lg={9} md={12} sm={12}>
                          <Controller
                            as={
                              <Select
                                label="Partner Enrolment Considered From (Mid Term)"
                                placeholder="Select Partner Enrolment Considered From (Mid Term)"
                                required
                                labelProps={{ background: "#f8f8f8" }}
                                options={MidtermEnrollment(false, true)}
                                error={
                                  errors && errors.midterm_premium_calculation_from_for_partner
                                }
                              />
                            }
                            rules={{ required: true }}
                            control={control}
                            name="midterm_premium_calculation_from_for_partner"
                          />
                        </Col>
                      </Row>
                    )}
                  </>}
                  {(memberRelation.includes("3") ||
                    memberRelation.includes("4")) && <>
                      {/* Child */}
                      <CustomCheck className="custom-control-checkbox">
                        <label className="custom-control-label-check  container-check">
                          <span>{"Is Midterm Allowed for Child?"}</span>
                          <Controller
                            as={
                              <input
                                name={"is_midterm_enrollement_allowed_for_kids"}
                                type="checkbox"
                                defaultChecked={
                                  savedConfig?.is_midterm_enrollement_allowed_for_kids
                                }
                              />
                            }
                            name={"is_midterm_enrollement_allowed_for_kids"}
                            onChange={([e]) => (e.target.checked ? 1 : 0)}
                            control={control}
                            defaultValue={0}
                          />
                          <span className="checkmark-check"></span>
                        </label>
                      </CustomCheck>
                      {!!is_midterm_enrollement_allowed_for_kids && (
                        <Row>
                          <Col xl={6} lg={9} md={12} sm={12}>
                            <Controller
                              as={
                                <Input
                                  label="Child Enrolment Allowed Days (Mid Term)"
                                  placeholder="Enter Child Enrolment Allowed Days (Mid Term)"
                                  type="number"
                                  min={0}
                                  required
                                  labelProps={{ background: "#f8f8f8" }}
                                  error={
                                    errors && errors.default_midterm_enrollement_days_for_kids
                                  }
                                />
                              }
                              rules={{ required: true, min: 1, max: 365 }}
                              control={control}
                              name="default_midterm_enrollement_days_for_kids"
                            />
                            {!!errors.default_midterm_enrollement_days_for_kids && <Error>
                              {errors.default_midterm_enrollement_days_for_kids.type === 'max' && 'Max Limit 365'}
                              {errors.default_midterm_enrollement_days_for_kids.type === 'min' && 'Required Min 1'}
                              {errors.default_midterm_enrollement_days_for_kids.type === 'required' && 'Required'}
                            </Error>}
                          </Col>

                          <Col xl={6} lg={9} md={12} sm={12}>
                            <Controller
                              as={
                                <Select
                                  label="Child Enrolment Considered From (Mid Term)"
                                  placeholder="Select Child Enrolment Considered From (Mid Term)"
                                  required
                                  labelProps={{ background: "#f8f8f8" }}
                                  options={MidtermEnrollment(false)}
                                  error={
                                    errors && errors.midterm_premium_calculation_from_for_kids
                                  }
                                />
                              }
                              rules={{ required: true }}
                              control={control}
                              name="midterm_premium_calculation_from_for_kids"
                            />
                          </Col>
                        </Row>
                      )}
                    </>}
                </TextCard>
              </Col>
            </Row>
          )
        }
        <Row className="pl-3 mt-4">
          {(memberRelation.includes("3") || memberRelation.includes("4")) && (
            <>
              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Checkbox
                      label="Special Child"
                      placeholder="Special Child"
                      checked={
                        savedConfig && savedConfig.has_special_child
                          ? true
                          : false
                      }
                    />
                  }
                  control={control}
                  name="has_special_child"
                  valueName="checked"
                  onChange={([ev]) => ev.target.checked}
                />
              </Col>
              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Checkbox
                      label="Unmarried Child"
                      placeholder="Unmarried Child"
                    />
                  }
                  control={control}
                  defaultValue={
                    savedConfig && savedConfig.has_unmarried_child
                      ? true
                      : false
                  }
                  name="has_unmarried_child"
                  valueName="checked"
                  onChange={([ev]) => {
                    setHasUnmarried(ev.target.checked);
                    return ev.target.checked;
                  }}
                />
              </Col>
            </>
          )}

          {hasUnmarried && (
            <Col xl={4} lg={5} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Unmarried Child Max Age"
                    placeholder="Enter Unmarried Child Max Age"
                    min={18}
                    type="number"
                    error={errors && errors["unmarried_min_age"]}
                  />
                }
                defaultValue={"18"}
                rules={{ required: true, min: 18 }}
                name="unmarried_min_age"
                control={control}
              />
            </Col>
          )}
        </Row>
        <Row className="pl-3 mt-4">
          {memberRelation.filter((elem) => ["3", "4"].includes(elem)).length >=
            1 && (
              <>
                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="No. of Twin Child"
                        placeholder="Enter Twin Child Limit"
                        min={0}
                        type="number"
                        error={errors && errors["max_twins"]}
                        required={false}
                        isRequired={false}
                      />
                    }
                    defaultValue={"0"}
                    rules={{ required: true, min: 0 }}
                    name="max_twins"
                    control={control}
                  />
                </Col>

                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Checkbox
                        label="Adopted Child Allowed"
                        placeholder="Adopted Child"
                      />
                    }
                    control={control}
                    defaultValue={
                      savedConfig && savedConfig.has_adopted_child ? true : false
                    }
                    name="has_adopted_child"
                    valueName="checked"
                    onChange={([ev]) => {
                      return ev.target.checked;
                    }}
                  />
                </Col>
              </>
            )}
          {memberRelation.includes("5") &&
            // memberRelation.includes('6') &&
            memberRelation.includes("7") && (
              // && memberRelation.includes('8')
              <Col xl={4} lg={5} md={6} sm={12}>
                <Controller
                  as={
                    <Checkbox
                      label="Parent Cross Selection"
                      placeholder="Parent Cross Selection"
                      checked={
                        savedConfig && savedConfig.parent_cross_selection
                          ? true
                          : false
                      }
                    />
                  }
                  control={control}
                  name="parent_cross_selection"
                  valueName="checked"
                  onChange={([ev]) => ev.target.checked}
                />
              </Col>
            )}
        </Row>
      </>
    );
  };

  return configs && configs.family_constructs ? (
    <Wrapper>
      <Title>
        <h4>
          <span className="dot-xd"></span>
          Family Construct &amp; Relation (Age Limit)
        </h4>
      </Title>
      <FormWrapper>
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col xl={4} lg={5} md={4} sm={12} className="ml-2 mb-4">
              <Controller
                as={
                  <Input
                    label="No. of Allowed Members"
                    placeholder="No. of Allowed Members"
                    min={1}
                    max={15}
                    type="number"
                    required
                    error={errors && errors.no_of_member}
                  />
                }
                name="no_of_member"
                control={control}
                defaultValue={"1"}
                // onChange={handleConstructChange}
                rules={{ required: true, max: 15, min: 1 }}
              />
            </Col>
            <Col xl={4} lg={5} md={4} sm={12} className="ml-2 mb-4">
              <Head className="text-center">Employee Included</Head>
              <div
                className="d-flex justify-content-around flex-wrap mt-2"
                style={{ margin: "0 39px 40px -12px" }}
              >
                <CustomControl className="d-flex mt-4 mr-0">
                  <p
                    style={{
                      fontWeight: "600",
                      paddingLeft: "27px",
                      marginBottom: "0px",
                    }}
                  >
                    {"Yes"}
                  </p>
                  <input
                    ref={register}
                    name={"is_employee_included"}
                    type={"radio"}
                    value={1}
                    defaultChecked={true}
                  />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p
                    style={{
                      fontWeight: "600",
                      paddingLeft: "27px",
                      marginBottom: "0px",
                    }}
                  >
                    {"No"}
                  </p>
                  <input
                    ref={register}
                    name={"is_employee_included"}
                    type={"radio"}
                    value={0}
                  />
                  <span></span>
                </CustomControl>
              </div>
              {/* <Controller
                  as={<Switch />}
                  name="is_employee_included"
                  label={'Employee Included'}
                  control={control}
                  onChange={([e]) => {
                    setEmployeeInc(e);
                  }}
                  defaultValue={1}
                /> */}
            </Col>
          </Row>

          {_renderFamilyMembers()}
        </form>
      </FormWrapper>
    </Wrapper>
  ) : null;
};

export default MemberDetails;

// is_employee_included
// no_of_adult : 0
// no_of_child : 3
// no_of_member : 3
//relation_Id

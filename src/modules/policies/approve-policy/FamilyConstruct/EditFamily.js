import React, { useState, useEffect } from "react";
import _ from "lodash";
import swal from "sweetalert";

import { Input, Button, Typography, Marker, Head, Select } from "components";
import { Row, Col, Table, Form } from "react-bootstrap";
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck, OptionInput } from "../style";
import { CustomControl } from "modules/user-management/AssignRole/option/style";

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { editPolicy } from "../approve-policy.slice";
import { sortRelation } from "../../../RFQ/plan-configuration/helper";
import { MidtermEnrollment } from "../../steps/member-details/family-details";
import { Error } from "../../../../components";
import { ContributionTypeRater } from "../../steps/premium-details/premium-details";

export const EditFamily = ({ options, policyData, style }) => {
  const { globalTheme } = useSelector(state => state.theme)
  const isNoRule = policyData.sum_insured_sub_type !== 16 && policyData.premium_type_id !== 18
  const filteredRelation = sortRelation(options.relations);
  const filteredRelation2 = sortRelation(options.familyLabels);
  let _memberCount = filteredRelation
    ?.map((elem) =>
      policyData?.ageDetails?.find(
        ({ relation_id }) => Number(relation_id) === Number(elem.id)
      )
    )
    .filter(Boolean);

  const dispatch = useDispatch();
  const { userType } = useSelector((state) => state.login);
  // const [specialMember, setSpecialMember] = useState(_memberCount?.map((value) => (value.is_special_member_allowed)));
  const [ageLimit, setAgeLimit] = useState(
    _memberCount?.map((value) => !value.max_age)
  );
  const [has_additional_premium, setHas_additional_premium] = useState(
    policyData.has_additional_premium
  );
  const [has_additional_premium_opd, setHas_additional_premium_opd] = useState(
    _memberCount[0].additional_premium_opd
  );
  const [employeeConribtion, setEmployeeConribtion] = useState(
    _memberCount?.length && String(_memberCount[0].employee_contribution)
  );
  const [employerConribtion, setEmployerConribtion] = useState(
    _memberCount?.length && String(_memberCount[0].employer_contribution)
  );
  const [employeeConribtion_opd, setEmployeeConribtion_opd] = useState(
    _memberCount?.length && String(_memberCount[0].employee_contribution_opd)
  );
  const [employerConribtion_opd, setEmployerConribtion_opd] = useState(
    _memberCount?.length && String(_memberCount[0].employer_contribution_opd)
  );
  const [has_special_child, setHas_special_child] = useState(
    !!policyData.has_special_child
  );
  const [has_unmarried_child, setHas_unmarried_child] = useState(
    !!policyData.has_unmarried_child
  );
  const [membersCount, setMembersCount] = useState(_memberCount?.length || 1);
  const [memberRelation, setMemberRelation] = useState(
    _memberCount?.map((elem) => String(elem.relation_id)) || []
  );

  const {
    special_child_additional_premium,
    special_child_employee_contribution,
    special_child_employer_contribution,
    unmarried_child_premium,
    unmarried_child_employee_contribution,
    unmarried_child_employer_contribution,
  } = policyData;
  const { control, errors, register, watch, reset, handleSubmit, setValue } =
    useForm({
      defaultValues: policyData,
    });

  const employeeInc = watch("is_employee_included");
  const parentType = Number(watch('parent_contribution_type')) || 1;

  const parent_contribution = watch("parent_contribution");
  const parentinlaw_contribution = watch("parentinlaw_contribution");

  const noParentCont = [11, 12].includes(policyData?.premium_type_id);
  const noParentCont_opd = [11, 12].includes(policyData?.opd_premium_type_id);

  const is_midterm_enrollement_allowed_for_spouse = watch(
    "is_midterm_enrollement_allowed_for_spouse"
  );
  const is_midterm_enrollement_allowed_for_partner = watch(
    "is_midterm_enrollement_allowed_for_partner"
  );
  const is_midterm_enrollement_allowed_for_kids = watch(
    "is_midterm_enrollement_allowed_for_kids"
  );
  const max_parents = watch("max_parents");

  useEffect(() => {
    if (Number(employeeInc) === 0 && Number(membersCount) === 1) {
      setMembersCount(2);
    }

    if (Number(employeeInc)) {
      setValue("parent_contribution_type", "1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeInc, membersCount]);

  useEffect(() => {
    if (!_.isEmpty(policyData)) {
      const parentCont = _memberCount.find(({ relation_id }) =>
        [5, 6].includes(Number(relation_id))
      );
      const parentInlawCont = _memberCount.find(({ relation_id }) =>
        [7, 8].includes(Number(relation_id))
      );
      reset({
        ...policyData,
        special_child_additional_premium: String(
          special_child_additional_premium
        ),
        special_child_employee_contribution: String(
          special_child_employee_contribution
        ),
        special_child_employer_contribution: String(
          special_child_employer_contribution
        ),
        unmarried_child_premium: String(unmarried_child_premium),
        unmarried_child_employee_contribution: String(
          unmarried_child_employee_contribution
        ),
        unmarried_child_employer_contribution: String(
          unmarried_child_employer_contribution
        ),
        max_twins: String(_memberCount[0].max_twins),
        is_employee_included: String(policyData?.is_employee_included),
        no_of_spouse:
          _memberCount.find((elem) => elem.relation_id === 2)?.no_of_relation ||
          "1",
        no_of_partner:
          _memberCount.find((elem) => elem.relation_id === 10)?.no_of_relation ||
          "1",
        // no_of_daughter: _memberCount.find((elem) => elem.relation_id === 3)?.no_of_relation || '1',
        // no_of_daughter: _memberCount.find((elem) => elem.relation_id === 3)?.no_of_relation || '1',
        no_of_childs: policyData.no_of_childs,
        no_of_siblings: policyData.no_of_siblings,
        max_parents: policyData.max_parents || 1,
        unmarried_min_age: policyData?.unmarried_min_age,
        parent_contribution_type:
          (policyData.parent_contribution_type &&
            String(policyData.parent_contribution_type)) ||
          "1",
        ...(policyData.parent_contribution_type === 2 && {
          parent_contribution: {
            additional_premium: parentCont.additional_premium,
            employee_contribution: parentCont.employee_contribution,
            employer_contribution: parentCont.employer_contribution,
          },
          parentinlaw_contribution: {
            additional_premium: parentInlawCont.additional_premium,
            employee_contribution: parentInlawCont.employee_contribution,
            employer_contribution: parentInlawCont.employer_contribution,
          },
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, policyData]);

  useEffect(() => {
    if (membersCount) {
      let tempData = [...memberRelation];
      tempData.length = membersCount;
      for (let i = 0; i < membersCount; i++) {
        if (!tempData[i] && _memberCount[i]?.relation_id) {
          tempData[i] = String(_memberCount[i]?.relation_id);
        }
      }
      setMemberRelation(tempData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersCount]);

  useEffect(() => {
    if (memberRelation.includes("5") || memberRelation.includes("7")) {
      register("max_parents", {
        required: true,
        min: 1,
        max:
          memberRelation.includes("5") && memberRelation.includes("7") ? 4 : 2,
      });
      setValue("max_parents", max_parents);
    }
    // else {
    //   register('max_parents', { required: false });
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberRelation]);

  const is_opd = policyData.policy_rater_type_id === 3;
  const is_parent_policy = Number(employeeInc) === 0 &&
    memberRelation.every((relation_id) => [1, 5, 6, 7, 8].includes(Number(relation_id))) &&
    [1, 2].includes(policyData.policy_rater_type_id)

  const handleConstructChange = ([e]) => {
    if (Number(e.target.value) > 15) {
      swal("Validation", "Member limit 15", "info");
      return membersCount;
    }
    // setMembersCount(Number(e.target.value) > 0 ? Number(e.target.value) : '0')
    return e;
  };

  const ageLimitFilter = (value, index) => {
    let newSet = _.cloneDeep(ageLimit);
    newSet[index] = value ? 1 : 0;
    setAgeLimit(newSet);
  };

  // const specialMemberFilter = (value, index) => {
  //   let newSet = _.cloneDeep(specialMember);
  //   newSet[index] = value;
  //   setSpecialMember(newSet)
  // }

  const additionalPremiumFilter = (value) => {
    setHas_additional_premium(value);
  };
  const additionalPremiumFilter_opd = (value) => {
    setHas_additional_premium_opd(value);
  };

  const addCount = () => {
    setMembersCount((prev) => (prev ? prev + 1 : 1));
  };

  const subCount = () => {
    setMembersCount((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const noIpdContRater = !(ContributionTypeRater.includes(policyData.premium_type_id));
  const noOpdContRater = !(ContributionTypeRater.includes(policyData.opd_premium_type_id));

  const onSubmit = (data) => {
    const {
      min_age,
      max_age,
      employee_contribution,
      employer_contribution,
      employee_contribution_opd,
      employer_contribution_opd,
      relation,
      family_construct_id,
      parent_cross_selection,
      special_child_employee_contribution,
      special_child_employer_contribution,
      unmarried_child_employee_contribution,
      unmarried_child_employer_contribution,
      special_child_additional_premium,
      unmarried_child_premium,
      has_adopted_child,
      additional_premium,
      additional_premium_opd,
      max_twins,
      unmarried_min_age,
      age_difference,
      difference_from_relation,
      is_allowed_for_gender,
    } = data;
    let ages =
      relation?.map((val, index) => {
        return {
          ...(!ageLimit[index] && {
            min_age: min_age[index],
            max_age: max_age[index],
          }),
          ...(Boolean(String(age_difference?.[index] || '')) && {
            age_difference: age_difference[index],
          }),
          ...(Boolean(String(difference_from_relation?.[index] || '')) && {
            difference_from_relation: difference_from_relation[index],
          }),
          ...(!_.isEmpty(is_allowed_for_gender) && {
            is_allowed_for_gender: is_allowed_for_gender[index],
          }),
          is_opd_contribution: policyData.policy_rater_type_id === 2 ? 1 : 0,
          employee_contribution:
            typeof employee_contribution === "object"
              ? employee_contribution[index] || 0
              : parentType === 2 && has_additional_premium && is_parent_policy
                ? [5, 6].includes(Number(val))
                  ? parent_contribution.employee_contribution || 0
                  : [7, 8].includes(Number(val))
                    ? parentinlaw_contribution.employee_contribution || 0
                    : employee_contribution || 0
                : employee_contribution || 0,
          employer_contribution:
            typeof employer_contribution === "object"
              ? employer_contribution[index] || 0
              : parentType === 2 && has_additional_premium && is_parent_policy
                ? [5, 6].includes(Number(val))
                  ? parent_contribution.employer_contribution || 0
                  : [7, 8].includes(Number(val))
                    ? parentinlaw_contribution.employer_contribution || 0
                    : employer_contribution || 0
                : employer_contribution || 0,
          ...(has_additional_premium && {
            add_premium:
              parentType === 2 && is_parent_policy
                ? [5, 6].includes(Number(val))
                  ? parent_contribution.additional_premium || 0
                  : [7, 8].includes(Number(val))
                    ? parentinlaw_contribution.additional_premium || 0
                    : additional_premium[index] || 0
                : additional_premium[index] || 0,
          }),
          relation_id: index === 0 ? 1 : val,
          no_of_relation:
            Number(val) === 2
              ? data.no_of_spouse
              : Number(val) === 10
                ? data.no_of_partner
                : Number(val) === 3
                  ? data.no_of_daughter
                  : Number(val) === 4
                    ? data.no_of_son
                    : 1,
          max_twins: max_twins || 0,
          // ...((val !== "Self" && specialMember[index]) && {
          //   special_member_additional_premium: Number(data?.special_member_additional_premium[index]),
          //   special_member_employee_contribution: Number(data?.special_member_employee_contribution[index]),
          //   special_member_employer_contribution: Number(data?.special_member_employer_contribution[index]),
          //   is_special_member_allowed: specialMember[index] ? true : false
          // })
        };
      }) || [];
    let ages_opd = [];
    if (is_opd) {
      ages_opd =
        relation?.map((val, index) => {
          return {
            ...(!ageLimit[index] && {
              min_age: min_age[index],
              max_age: max_age[index],
            }),
            is_opd_contribution: 1,
            employee_contribution:
              typeof employee_contribution_opd === "object"
                ? employee_contribution_opd[index] || 0
                : employee_contribution_opd || 0,
            employer_contribution:
              typeof employer_contribution_opd === "object"
                ? employer_contribution_opd[index] || 0
                : employer_contribution_opd || 0,
            ...(has_additional_premium_opd && {
              add_premium: additional_premium_opd[index] || 0,
            }),
            relation_id: index === 0 ? 1 : val,
            no_of_relation:
              Number(val) === 2
                ? data.no_of_spouse
                : Number(val) === 10
                  ? data.no_of_partner
                  : Number(val) === 3
                    ? data.no_of_daughter
                    : Number(val) === 4
                      ? data.no_of_son
                      : 1,
            max_twins: max_twins || 0,
          };
        }) || [];
    }

    ages = [...ages, ...ages_opd];

    // refill relation
    const agesCopy = [...ages];

    agesCopy.forEach((elem) => {
      if (elem) {
        if ([3, 5, 7].includes(Number(elem.relation_id))) {
          ages.push({ ...elem, relation_id: Number(elem.relation_id) + 1 });
        }
      }
    });

    if (!Number(employeeInc)) {
      ages = ages.filter(
        (age) => age?.relation_id && Number(age.relation_id) !== 1
      );
    }

    for (let i = 0; i < ages.length; i++) {
      if (ages[i].employee_contribution && ages[i].employer_contribution)
        if (
          ages[i] &&
          has_additional_premium &&
          Number(ages[i].employee_contribution) +
          Number(ages[i].employer_contribution) !==
          100
        ) {
          parentType === 2 && has_additional_premium && is_parent_policy
            ? swal(
              "Validation",
              ([5, 6].includes(Number(ages[i].relation_id))
                ? "Parent"
                : "Parent In-law") + " Total contribution must be 100",
              "info"
            )
            : swal(
              "Validation",
              options?.relations.find(
                ({ id }) => id === Number(ages[i].relation_id)
              ).name + " Total contribution must be 100",
              "info"
            );
          return;
        }
    }

    if (isNoRule) {
      if (noIpdContRater && !has_additional_premium && (Number(employee_contribution) + Number(employer_contribution)) !== 100) {
        swal("Validation", `Total contribution${is_opd ? ' (IPD)' : ''} for all must be 100`, "info");
        return;
      }

      if (noOpdContRater && is_opd && !has_additional_premium_opd && (Number(employee_contribution_opd) + Number(employer_contribution_opd)) !== 100) {
        swal("Validation", "Total contribution (OPD) for all must be 100", "info");
        return;
      }
    }

    for (let i = 0; i < ages.length; i++) {
      const minAge = +ages[i]?.min_age,
        maxAge = +ages[i]?.max_age,
        memberName = _memberCount.find(({ relation_id }) => +relation_id === +ages[i]?.relation_id)?.relation;

      if ((ages[i]?.relation_id === 3 || ages[i]?.relation_id === 4)) {
        if (minAge < 0 || minAge > 100) {
          swal("Validation", memberName + " Min age is wrong!\n* Should be in between 0-100\n* Should be less than Max Age", "info");
          return;
        }
        if (maxAge < 0 || maxAge < minAge || maxAge > 100) {
          swal("Validation", memberName + " Max age is wrong!\n* Should be in between 0-100\n* Should be more than Min Age", "info");
          return;
        }
      } else if ((ages[i]?.relation_id !== 3 || ages[i]?.relation_id !== 4)) {
        if (minAge < 18 || minAge > 100) {
          swal("Validation", memberName + " Min age is wrong!\n* Should be in between 18-100\n* Should be less than Max Age", "info");
          return;
        }
        if (maxAge < 18 || maxAge < minAge || maxAge > 100) {
          swal("Validation", memberName + " Max age is wrong!\n* Should be in between 18-100\n* Should be more than Min Age", "info");
          return;
        }
      }
    }

    if (memberRelation.includes("3") || memberRelation.includes("4")) {
      if (
        has_special_child &&
        Number(special_child_employer_contribution) +
        Number(special_child_employee_contribution) !==
        100
      ) {
        swal(
          "Validation",
          "Special child total contribution must be 100",
          "info"
        );
        return;
      }
      if (
        has_unmarried_child &&
        Number(unmarried_child_employee_contribution) +
        Number(unmarried_child_employer_contribution) !==
        100
      ) {
        swal(
          "Validation",
          "Unmmaried child total contribution must be 100",
          "info"
        );
        return;
      }
    }

    dispatch(
      editPolicy(
        {
          no_of_member: data.no_of_member,
          family_construct_id,
          has_additional_premium: Number(has_additional_premium),
          max_adult: 0,
          no_of_spouse: data.no_of_spouse || 0,
          no_of_partner: data.no_of_partner || 0,
          no_of_siblings: data.no_of_siblings || 0,
          max_parents: data.max_parents || 0,
          // no_of_daughter: Number(data.no_of_daughter) || 0,
          // no_of_son: Number(data.no_of_son) || 0,
          max_child: Number(data.no_of_childs) || 0,
          ...((memberRelation.includes("3") ||
            memberRelation.includes("4")) && {
            has_special_child: Number(has_special_child),
            ...(has_special_child && {
              special_child_additional_premium,
              special_child_employee_contribution,
              special_child_employer_contribution,
            }),
            has_unmarried_child: Number(has_unmarried_child),
            ...(has_unmarried_child && {
              unmarried_child_premium,
              unmarried_child_employee_contribution,
              unmarried_child_employer_contribution,
              unmarried_min_age: unmarried_min_age || 18,
            }),
            has_adopted_child: has_adopted_child ? 1 : 0,
          }),
          // Spouse
          is_midterm_enrollement_allowed_for_spouse: data.is_midterm_enrollement_allowed_for_spouse
            ? 1
            : 0,
          ...(data.is_midterm_enrollement_allowed_for_spouse && {
            default_midterm_enrollement_days_for_spouse:
              data.default_midterm_enrollement_days_for_spouse,
            midterm_premium_calculation_from_for_spouse:
              data.midterm_premium_calculation_from_for_spouse,
          }),
          // Partner
          is_midterm_enrollement_allowed_for_partner: data.is_midterm_enrollement_allowed_for_partner
            ? 1
            : 0,
          ...(data.is_midterm_enrollement_allowed_for_partner && {
            default_midterm_enrollement_days_for_partner:
              0,
            midterm_premium_calculation_from_for_partner:
              data.midterm_premium_calculation_from_for_partner,
          }),
          // Child
          is_midterm_enrollement_allowed_for_kids: data.is_midterm_enrollement_allowed_for_kids
            ? 1
            : 0,
          ...(data.is_midterm_enrollement_allowed_for_kids && {
            default_midterm_enrollement_days_for_kids:
              data.default_midterm_enrollement_days_for_kids,
            midterm_premium_calculation_from_for_kids:
              data.midterm_premium_calculation_from_for_kids,
          }),
          ...(memberRelation.includes("5") &&
            // memberRelation.includes('6') &&
            memberRelation.includes("7") && // memberRelation.includes('8') //  &&
          {
            has_parent_cross_selection:
              parent_cross_selection !== undefined
                ? Number(parent_cross_selection)
                : policyData.has_parent_cross_selection,
          }),
          ages: ages,
          parent_contribution_type: parentType || 0,
          is_parent_policy: ages.every(({ relation_id }) =>
            [5, 6, 7, 8].includes(Number(relation_id))
          )
            ? 1
            : 0,
          user_type_name: userType,
          step: 2,
          _method: "PATCH",
          policy_id: policyData.id,
        },
        policyData.id
      )
    );
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input
              label="No. of Allowed Members"
              placeholder='Enter Allowed Members'
              valueName="name"
              min={1}
              max={15}
              type='number'
              id="family_constructs"
              required
            />}
            onChange={handleConstructChange}
            name="no_of_member"
            control={control}
          />
        </Col>
        <Col xl={4} lg={4} md={6} sm={12} className="ml-2 mb-4">
          <Head className='text-center'>Employee Included</Head>
          <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
            <CustomControl className="d-flex mt-4 mr-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
              <input ref={register} name={'is_employee_included'} type={'radio'} value={1} defaultChecked={!!employeeInc} />
              <span></span>
            </CustomControl>
            <CustomControl className="d-flex mt-4 ml-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
              <input ref={register} name={'is_employee_included'} type={'radio'} value={0} defaultChecked={!employeeInc} />
              <span></span>
            </CustomControl>
          </div>
        </Col>
      </Row>

      {isNoRule && <>
        {noIpdContRater && <>
          <Marker />
          <Typography>{'\u00A0'}Contribution Type {is_opd && '(IPD)'}</Typography>
          <Row className="d-flex flex-wrap" >
            <Col md={12} lg={8} xl={6} sm={12} >
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -40px' }}>
                <Controller
                  as={<CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Contribution For All"}</p>
                    <input name={'has_additional_premium'} type={'radio'} value={0} defaultChecked={!has_additional_premium} />
                    <span></span>
                  </CustomControl>}
                  onChange={([e]) => { additionalPremiumFilter(false); return e.target.checked }}
                  name={'has_additional_premium'}
                  control={control}
                />
                <Controller
                  as={<CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Additional Premium"}</p>
                    <input name={'has_additional_premium'} type={'radio'} value={1} defaultChecked={!!has_additional_premium} />
                    <span></span>
                  </CustomControl>}
                  onChange={([e]) => { additionalPremiumFilter(true); return e.target.checked }}
                  name={'has_additional_premium'}
                  control={control}
                />
              </div>
            </Col>
          </Row>


          {!has_additional_premium &&
            <Row className="d-flex flex-wrap" >
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input label="Employee Contribution %" type="number" min={0} max={100} placeholder="Employee Contribution" required />}
                  onChange={([e]) => { setEmployeeConribtion(e.target.value); return e.target.value }}
                  defaultValue={employeeConribtion}
                  name="employee_contribution"
                  error={errors && errors.employee_contribution}
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input label="Employer Contribution %" type="number" min={0} max={100} placeholder="Employer Contribution" required />}
                  onChange={([e]) => { setEmployerConribtion(e.target.value); return e.target.value }}
                  defaultValue={employerConribtion}
                  name="employer_contribution"
                  error={errors && errors.employer_contribution}
                  control={control}
                />
              </Col>
            </Row>
          }

        </>}

        {!!has_additional_premium && is_parent_policy && <>
          <Marker />
          <Typography>{'\u00A0'}Parent Contribution Type</Typography>
          <Col md={6} lg={6} xl={6} sm={12}>
            <div className="d-flex justify-content-around flex-wrap mt-2 text-nowrap" style={{ margin: '0px 32px 50px -58px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Basic"}</p>
                <input ref={register} name={'parent_contribution_type'} type={'radio'} value={'1'} defaultChecked={true} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Parent Pair"}</p>
                <input ref={register} name={'parent_contribution_type'} type={'radio'} value={'2'} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No. of Parent"}</p>
                <input ref={register} name={'parent_contribution_type'} type={'radio'} value={'3'} />
                <span></span>
              </CustomControl>
            </div>
          </Col>
        </>}

        {(parentType === 2 && has_additional_premium && is_parent_policy) && <>
          {memberRelation.some((relation_id) => [5, 6].includes(Number(relation_id))) && <Row className="d-flex flex-wrap">
            <Col md={12} lg={12} xl={12} sm={12}>
              <Head>Parent Premium</Head>
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Premium" type="number" min={0} placeholder="Premium" required />}
                name="parent_contribution.additional_premium"
                error={errors && errors.parent_contribution?.additional_premium}
                control={control}
              />
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Employee Contribution %" type="number" min={0} max={100} placeholder="Employee Contribution" required />}
                name="parent_contribution.employee_contribution"
                error={errors && errors.parent_contribution?.employee_contribution}
                control={control}
              />
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Employer Contribution %" type="number" min={0} max={100} placeholder="Employer Contribution" required />}
                name="parent_contribution.employer_contribution"
                error={errors && errors.parent_contribution?.employer_contribution}
                control={control}
              />
            </Col>
          </Row>}

          {memberRelation.some((relation_id) => [7, 8].includes(Number(relation_id))) && <Row className="d-flex flex-wrap">
            <Col md={12} lg={12} xl={12} sm={12}>
              <Head>Parent Inlaw Premium</Head>
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Premium" type="number" min={0} placeholder="Premium" required />}
                name="parentinlaw_contribution.additional_premium"
                error={errors && errors.parent_contribution?.additional_premium}
                control={control}
              />
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Employee Contribution %" type="number" min={0} max={100} placeholder="Employee Contribution" required />}
                name="parentinlaw_contribution.employee_contribution"
                error={errors && errors.parent_contribution?.employee_contribution}
                control={control}
              />
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Employer Contribution %" type="number" min={0} max={100} placeholder="Employer Contribution" required />}
                name="parentinlaw_contribution.employer_contribution"
                error={errors && errors.parent_contribution?.employer_contribution}
                control={control}
              />
            </Col>
          </Row>} </>}

        {(parentType === 3 && has_additional_premium && is_parent_policy) && ([...Array(Number(membersCount))])?.map((_, index) =>
          ((index === 0 && !!Number(employeeInc)) || index !== 0) &&
          (<Row key={'family' + index}>
            <Col md={12} lg={12} xl={12} sm={12}>
              <Head>{index} Parent Premium</Head>
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input className="rounded-lg" size="sm" required
                    label='Premium' placeholder="Emter Premium" min="0" type="number"
                  />}
                name={`additional_premium.${index}`}
                control={control}
                defaultValue={String(_memberCount[index]?.additional_premium) || ""}
              />

            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input className="rounded-lg" size="sm" required
                    label='Employee Contribution' placeholder="Emter Employee Contribution" min="0" max="100" type="number"
                  />}
                name={`employee_contribution.${index}`}
                control={control}
                defaultValue={String(_memberCount[index]?.employee_contribution) || ""}
              />

            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input className="rounded-lg" size="sm" required
                    label='Employer Contribution' placeholder="Emter Employer Contribution" min="0" max="100" type="number"
                  />}
                name={`employer_contribution.${index}`}
                control={control}
                defaultValue={String(_memberCount[index]?.employer_contribution) || ""}
              />


            </Col>
          </Row>))}

        {noOpdContRater && is_opd && <>
          <Marker />
          <Typography>{'\u00A0'}Contribution Type (OPD)</Typography>
          <Row className="d-flex flex-wrap" >
            <Col md={12} lg={8} xl={6} sm={12} >
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -40px' }}>
                <Controller
                  as={<CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Contribution For All"}</p>
                    <input name={'has_additional_premium_opd'} type={'radio'} value={0} defaultChecked={!has_additional_premium_opd} />
                    <span></span>
                  </CustomControl>}
                  onChange={([e]) => { additionalPremiumFilter_opd(false); return e.target.checked }}
                  name={'has_additional_premium_opd'}
                  control={control}
                />
                <Controller
                  as={<CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Additional Premium"}</p>
                    <input name={'has_additional_premium_opd'} type={'radio'} value={1} defaultChecked={!!has_additional_premium_opd} />
                    <span></span>
                  </CustomControl>}
                  onChange={([e]) => { additionalPremiumFilter_opd(true); return e.target.checked }}
                  name={'has_additional_premium_opd'}
                  control={control}
                />
              </div>
            </Col>
          </Row>


          {!has_additional_premium_opd &&
            <Row className="d-flex flex-wrap" >
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input label="Employee Contribution %" type="number" min={0} max={100} placeholder="Employee Contribution" required />}
                  onChange={([e]) => { setEmployeeConribtion_opd(e.target.value); return e.target.value }}
                  defaultValue={employeeConribtion_opd}
                  name="employee_contribution_opd"
                  error={errors && errors.employee_contribution_opd}
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input label="Employer Contribution %" type="number" min={0} max={100} placeholder="Employer Contribution" required />}
                  onChange={([e]) => { setEmployerConribtion_opd(e.target.value); return e.target.value }}
                  defaultValue={employerConribtion_opd}
                  name="employer_contribution_opd"
                  error={errors && errors.employer_contribution_opd}
                  control={control}
                />
              </Col>
            </Row>
          }
        </>}
      </>}
      <Table className="text-center" style={style.Table} responsive>
        <thead >
          <tr style={style.HeadRow}>
            <th style={style.TableHead} scope="col">Family Relation </th>
            <th style={style.TableHead} scope="col">Min Age</th>
            <th style={style.TableHead} scope="col">Max Age</th>
            <th style={style.TableHead} scope="col">Age Limit</th>
            {noIpdContRater && ((parentType !== 3 && has_additional_premium && is_parent_policy) || !is_parent_policy) && <>
              <th style={style.TableHead} scope="col">Employee Contribution%{is_opd && '(IPD)'}</th>
              <th style={style.TableHead} scope="col">Employer Contribution%{is_opd && '(IPD)'}</th>
              <th style={style.TableHead} scope="col">Additional Premium{is_opd && '(IPD)'}</th>
            </>}
            {noOpdContRater && is_opd &&
              <>
                <th style={style.TableHead} scope="col">Employee Contribution%(OPD)</th>
                <th style={style.TableHead} scope="col">Employer Contribution%(OPD)</th>
                <th style={style.TableHead} scope="col">Additional Premium(OPD)</th>
              </>
            }
            {/* <th scope="col">Special Member</th>
              <th scope="col">Special Member Employee Contribution%</th>
              <th scope="col">Special Member Employer Contribution%</th>
              <th scope="col">Special Member Additional Premium</th> */}
            {/* </>
              } */}
            <th scope="col">Age Depend</th>
            <th scope="col">Age Difference</th>
            <th scope="col">Allowed For</th>
          </tr>
        </thead>
        <tbody>
          {([...Array(Number(membersCount))])?.map((_, index) =>
            ((index === 0 && !!Number(employeeInc)) || index !== 0) &&
            (<tr key={index + 'member'}>
              {index === 0 && Number(memberRelation[0]) === 1 ? <td>
                <Controller
                  as={
                    <Form.Control className="rounded-lg" size="sm" required
                      placeholder="Relation" disabled
                      labelprops={{ background: 'linear-gradient(#ffffff, #dadada)' }} />}
                  name={`relation.${index}`}
                  control={control}
                  defaultValue={_memberCount[index]?.relation || "Self"}
                />
              </td> :
                <td>
                  <Controller
                    as={
                      <Form.Control as='select' className="rounded-lg" size="sm" required>
                        {/* {options.familyLabels.map((elem) =>
                            <option value={elem.id}>{elem.name}</option>
                          )} */}
                        <option value=''>Select Relation</option>
                        {filteredRelation2
                          .filter((elem) => (!memberRelation.includes(String(elem.id)) || elem.id === Number(memberRelation[index])))
                          .map((elem, index) => (<option key={'reltion65' + index} value={elem.id}>{elem.name}</option>))}
                      </Form.Control>}
                    name={`relation.${index}`}
                    control={control}
                    onChange={([e]) => {
                      const value = e.target.value
                      setMemberRelation(prev => {
                        prev[index] = value;
                        return [...prev];
                      })
                      return e
                    }}
                    defaultValue={_memberCount[index]?.relation_id}
                  />
                </td>}
              <td>
                {!ageLimit[index] ?
                  <Controller
                    as={
                      <Form.Control className="rounded-lg" size="sm" required
                        placeholder="Min Age"
                        min={
                          [3, 4, 9].includes(
                            Number(watch(`relation.${index}`))
                          ) ?
                            '0' : '18'}
                        max="150" type="number"
                      />}
                    name={`min_age.${index}`}
                    control={control}
                    defaultValue={String(_memberCount[index]?.min_age) || ""}
                  />
                  :
                  <Form.Control className="rounded-lg" size="sm"
                    value="0" disabled
                  />}
              </td>
              <td>
                {!ageLimit[index] ?
                  <Controller
                    as={
                      <Form.Control className="rounded-lg" size="sm" required
                        placeholder="Max Age"
                        min={
                          [3, 4, 9].includes(
                            Number(watch(`relation.${index}`))
                          ) ?
                            '0' : '18'}
                        max="150" type="number"
                      />}
                    name={`max_age.${index}`}
                    control={control}
                    defaultValue={String(_memberCount[index]?.max_age) || ""}
                  />
                  :
                  <Form.Control className="rounded-lg" size="sm"
                    value="0" disabled
                  />
                }
              </td>
              <td>
                <Controller
                  as={<OptionInput className="d-flex justify-content-center">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No Age Limit"}</p>
                    <input name={'age_limit'} type={'checkbox'} defaultChecked={ageLimit[index]} />
                    <span></span>
                  </OptionInput>}
                  onChange={([e]) => { ageLimitFilter(e.target.checked, index); return e.target.checked }}
                  name={'age_limit'}
                  control={control}
                />
              </td>
              {noIpdContRater && ((parentType !== 3 && has_additional_premium && is_parent_policy) || !is_parent_policy) && <>
                <td>
                  {(noParentCont ? [5, 6, 7, 8].includes(Number(memberRelation[index])) : false) ? null :
                    (has_additional_premium && ((parentType !== 2 && is_parent_policy) || !is_parent_policy)) ?
                      <Controller
                        as={
                          <Form.Control className="rounded-lg" size="sm" required
                            placeholder="Employee Contribution" min="0" max="100" type="number"
                          />}
                        name={`employee_contribution.${index}`}
                        control={control}
                        defaultValue={String(_memberCount[index]?.employee_contribution) || ""}
                      />
                      :
                      <Form.Control className="rounded-lg" size="sm" name={`employee_contribution.${index}`}
                        value={((parentType === 2 && has_additional_premium && is_parent_policy) ?
                          [5, 6].includes(Number(memberRelation[index])) ? parent_contribution?.employee_contribution :
                            [7, 8].includes(Number(memberRelation[index])) ? parentinlaw_contribution?.employee_contribution
                              : employeeConribtion : employeeConribtion)} disabled
                      />
                  }
                </td>
                <td>
                  {(noParentCont ? [5, 6, 7, 8].includes(Number(memberRelation[index])) : false) ? null :
                    (has_additional_premium && ((parentType !== 2 && is_parent_policy) || !is_parent_policy)) ?
                      <Controller
                        as={
                          <Form.Control className="rounded-lg" size="sm" required
                            placeholder="Employer Contribution" min="0" max="100" type="number"
                          />}
                        name={`employer_contribution.${index}`}
                        control={control}
                        defaultValue={String(_memberCount[index]?.employer_contribution) || ""}
                      />
                      :
                      <Form.Control className="rounded-lg" size="sm" name={`employer_contribution.${index}`}
                        value={(parentType === 2 && has_additional_premium && is_parent_policy) ?
                          [5, 6].includes(Number(memberRelation[index])) ? parent_contribution?.employer_contribution :
                            [7, 8].includes(Number(memberRelation[index])) ? parentinlaw_contribution?.employer_contribution
                              : employerConribtion : employerConribtion} disabled
                      />
                  }
                </td>
                <td>
                  {(noParentCont ? [5, 6, 7, 8].includes(Number(memberRelation[index])) : false) ? null :
                    (has_additional_premium && ((parentType !== 2 && is_parent_policy) || !is_parent_policy)) ?
                      <Controller
                        as={
                          <Form.Control className="rounded-lg" size="sm"
                            placeholder="Additional Premium" min="0" type="number"
                          />}
                        name={`additional_premium.${index}`}
                        control={control}
                        defaultValue={String(_memberCount[index]?.additional_premium || "0")}
                      />
                      :
                      <Form.Control className="rounded-lg" size="sm" name={`additional_premium.${index}`}
                        value={(parentType === 2 && has_additional_premium && is_parent_policy) ?
                          [5, 6].includes(Number(memberRelation[index])) ? parent_contribution?.additional_premium :
                            [7, 8].includes(Number(memberRelation[index])) ? parentinlaw_contribution?.additional_premium
                              : "0" : "0"} disabled
                      />
                  }
                </td>
              </>
              }
              {noOpdContRater && is_opd && <>
                <td>
                  {(noParentCont_opd ? [5, 6, 7, 8].includes(Number(memberRelation[index])) : false) ? null :
                    has_additional_premium_opd ?
                      <Controller
                        as={
                          <Form.Control className="rounded-lg" size="sm" required
                            placeholder="Employee Contribution" min="0" max="100" type="number"
                          />}
                        name={`employee_contribution_opd.${index}`}
                        control={control}
                        defaultValue={String(_memberCount[index]?.employee_contribution_opd) || ""}
                      />
                      :
                      <Form.Control className="rounded-lg" size="sm" name={`employee_contribution_opd.${index}`}
                        value={employeeConribtion_opd} disabled
                      />
                  }
                </td>
                <td>
                  {(noParentCont_opd ? [5, 6, 7, 8].includes(Number(memberRelation[index])) : false) ? null :
                    has_additional_premium_opd ?
                      <Controller
                        as={
                          <Form.Control className="rounded-lg" size="sm" required
                            placeholder="Employer Contribution" min="0" max="100" type="number"
                          />}
                        name={`employer_contribution_opd.${index}`}
                        control={control}
                        defaultValue={String(_memberCount[index]?.employer_contribution_opd) || ""}
                      />
                      :
                      <Form.Control className="rounded-lg" size="sm" name={`employer_contribution_opd.${index}`}
                        value={employerConribtion_opd} disabled
                      />
                  }

                </td>
                <td>
                  {(noParentCont_opd ? [5, 6, 7, 8].includes(Number(memberRelation[index])) : false) ? null :
                    has_additional_premium_opd ?
                      <Controller
                        as={
                          <Form.Control className="rounded-lg" size="sm"
                            placeholder="Additional Premium" min="0" type="number"
                          />}
                        name={`additional_premium_opd.${index}`}
                        control={control}
                        defaultValue={String(_memberCount[index]?.additional_premium_opd || "0")}
                      />
                      :
                      <Form.Control className="rounded-lg" size="sm"
                        value="0" disabled
                      />
                  }
                </td>
              </>}
              {/* <td>
                  {_memberCount[index]?.relation_id !== 1 ?
                    <Controller
                      as={<OptionInput className="d-flex justify-content-center">
                        <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Special Member"}</p>
                        <input name={`is_special_member_allowed.${index}`} type={'checkbox'} defaultChecked={specialMember[index]} />
                        <span style={{ marginLeft: '-12px' }}></span>
                      </OptionInput>}
                      onChange={([e]) => { specialMemberFilter(e.target.checked, index); return e.target.checked }}
                      name={`is_special_member_allowed.${index}`}
                      control={control}
                    /> : "-"
                  }
                </td> */}
              {/* {_memberCount[index]?.relation_id !== 1 ?
                  <>
                    <td>
                      {specialMember[index] ?
                        <Controller
                          as={
                            <Form.Control className="rounded-lg" size="sm" required
                              placeholder=""
                            />}
                          name={`special_member_employee_contribution.${index}`}
                          control={control}
                          defaultValue={_memberCount[index]?.special_member_employee_contribution || ""}
                        />
                        :
                        <Form.Control className="rounded-lg" size="sm"
                          value="0" disabled
                        />
                      }
                    </td>
                    <td>
                      {specialMember[index] ?
                        <Controller
                          as={
                            <Form.Control className="rounded-lg" size="sm" required
                              placeholder=""
                            />}
                          name={`special_member_employer_contribution.${index}`}
                          control={control}
                          defaultValue={_memberCount[index]?.special_member_employer_contribution || ""}
                        />
                        :
                        <Form.Control className="rounded-lg" size="sm"
                          value="0" disabled
                        />
                      }
                    </td>
                    <td>
                      {specialMember[index] ?
                        <Controller
                          as={
                            <Form.Control className="rounded-lg" size="sm" required
                              placeholder=""
                            />}
                          name={`special_member_additional_premium.${index}`}
                          control={control}
                          defaultValue={_memberCount[index]?.special_member_additional_premium || ""}
                        />
                        :
                        <Form.Control className="rounded-lg" size="sm"
                          value="0" disabled
                        />
                      }
                    </td>
                  </> :
                  <>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </>
                } */}
              <td>
                {[3, 5, 7].includes(
                  Number(watch(`relation.${index}`))
                ) ? (
                  <Controller
                    as={
                      <Form.Control
                        as="select"
                        className="rounded-lg"
                        size="sm"
                        required
                        style={{ minWidth: "125px" }}
                      >
                        <option value="">Select Relation</option>
                        {filteredRelation
                          .filter((elem) =>
                            [1, memberRelation.includes('2') ? 2 : "", memberRelation.includes('10') ? 2 : ""].includes(Number(elem.id))
                          )
                          .map((elem, index) => (
                            <option
                              key={"agedepended65" + index}
                              value={elem.id}
                            >
                              {elem.name}
                            </option>
                          ))}
                      </Form.Control>
                    }
                    name={`difference_from_relation.${index}`}
                    control={control}
                    defaultValue={
                      [3, 5, 7].includes(
                        Number(_memberCount[index]?.relation_id)
                      )
                        ? Number(
                          _memberCount[index]?.difference_from_relation
                        )
                        : ""
                    }
                    rules={{ required: true }}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td>
                {[3, 5, 7].includes(
                  Number(watch(`relation.${index}`))
                ) ? (
                  <Controller
                    as={
                      <Form.Control
                        className="rounded-lg"
                        size="sm"
                        required
                        placeholder="Age Diffrence"
                        min="0"
                        max="150"
                        type="number"
                        style={{ minWidth: "125px" }}
                      />
                    }
                    name={`age_difference.${index}`}
                    control={control}
                    defaultValue={
                      Number(_memberCount[index]?.age_difference) || 0
                    }
                    rules={{ required: true }}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td>
                {[5, 7].includes(Number(watch(`relation.${index}`))) ? (
                  <div
                    className="d-flex justify-content-around flex-nowrap"
                    style={{ minWidth: "250px" }}
                  >
                    <CustomControl className="d-flex">
                      <p
                        style={{
                          fontWeight: "600",
                          marginBottom: "0px",
                        }}
                      >
                        {"Male"}
                      </p>
                      <input
                        ref={register}
                        name={`is_allowed_for_gender.[${index}]`}
                        type={"radio"}
                        value={0}
                        defaultChecked={Boolean(
                          Number(
                            _memberCount[index]?.is_allowed_for_gender
                          ) === 0
                        )}
                      />
                      <span></span>
                    </CustomControl>
                    <CustomControl className="d-flex">
                      <p
                        style={{
                          fontWeight: "600",
                          marginBottom: "0px",
                        }}
                      >
                        {"Female"}
                      </p>
                      <input
                        ref={register}
                        name={`is_allowed_for_gender.[${index}]`}
                        type={"radio"}
                        value={1}
                        defaultChecked={Boolean(
                          Number(
                            _memberCount[index]?.is_allowed_for_gender
                          ) === 1
                        )}
                      />
                      <span></span>
                    </CustomControl>
                    <CustomControl className="d-flex">
                      <p
                        style={{
                          fontWeight: "600",
                          marginBottom: "0px",
                        }}
                      >
                        {"Both"}
                      </p>
                      <input
                        ref={register}
                        name={`is_allowed_for_gender.[${index}]`}
                        type={"radio"}
                        value={2}
                        defaultChecked={
                          Boolean(
                            Number(
                              _memberCount[index]?.is_allowed_for_gender
                            ) === 2
                          ) ||
                          ![0, 1, 2].includes(
                            Number(
                              _memberCount[index]?.is_allowed_for_gender
                            )
                          )
                        }
                      />
                      <span></span>
                    </CustomControl>
                  </div>
                ) : (
                  "-"
                )}
              </td>
            </tr>)
          )}
        </tbody>
      </Table>

      <Row className='mt-3'>
        <Col className="d-flex justify-content-end align-items-center">
          <Button buttonStyle="warning" type='button' onClick={addCount}>
            <i className="ti ti-plus"></i> Add{'\u00A0'}
          </Button>
          {membersCount !== 1 &&
            <Button buttonStyle="danger" type='button' onClick={subCount}>
              <i className="ti ti-minus"></i> Remove
            </Button>
          }
        </Col>
      </Row>
      {(memberRelation.includes('2') || memberRelation.includes('10') || memberRelation.includes('3') || memberRelation.includes('4') || memberRelation.includes('5')) &&
        <Row className="pl-3 mt-4">
          {memberRelation.includes('2') &&
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Spouse"
                    placeholder="Enter Spouse Limit"
                    min={1}
                    max={4}
                    type="number"
                    error={errors && errors['no_of_spouse']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 4 }}
                name="no_of_spouse"
                control={control}
              />
            </Col>
          }
          {memberRelation.includes('10') &&
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Partner"
                    placeholder="Enter Partner Limit"
                    min={1}
                    max={4}
                    type="number"
                    error={errors && errors['no_of_partner']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 4 }}
                name="no_of_partner"
                control={control}
              />
            </Col>
          }
          {(memberRelation.includes('3') || memberRelation.includes('4')) &&
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Child"
                    placeholder="Enter Child Limit"
                    min={1}
                    max={10}
                    type="number"
                    error={errors && errors['no_of_childs']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 10 }}
                name="no_of_childs"
                control={control}
              />
            </Col>
          }
          {(memberRelation.includes('5') || memberRelation.includes('7')) &&
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label={`No. of ${memberRelation.includes('5') ? 'Parents' : ''} ${(memberRelation.includes('5') && memberRelation.includes('7')) ? '&' : ''} ${memberRelation.includes('7') ? 'Parents in Law' : ''}`}
                    placeholder="Enter Limit"
                    min={1}
                    max={(memberRelation.includes('5') && memberRelation.includes('7')) ? 4 : 2}
                    type="number"
                    error={errors && errors['max_parents']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: (memberRelation.includes('5') && memberRelation.includes('7')) ? 4 : 2 }}
                name="max_parents"
                control={control}
              />
            </Col>
          }
          {(memberRelation.includes('9')) &&
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Sibling"
                    placeholder="Enter Sibling Limit"
                    min={1}
                    max={10}
                    type="number"
                    error={errors && errors['no_of_siblings']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 10 }}
                name="no_of_siblings"
                control={control}
              />
            </Col>
          }
          {/* {memberRelation.includes('4') &&
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <Input
                      label="No. of Son"
                      placeholder="Enter Son Limit"
                      min={1}
                      max={10}
                      type="number"
                      error={errors && errors['no_of_son']}
                    />
                  }
                  defaultValue={'1'}
                  rules={{ required: true, min: 1, max: 10 }}
                  name="no_of_son"
                  control={control}
                />
              </Col>
            } */}
        </Row>}

      {(memberRelation.includes('2') || memberRelation.includes('3') || memberRelation.includes('4')||memberRelation.includes('10')) && <Row>
        <Col md={12} lg={12} xl={12} sm={12}>
          <TextCard className="px-1 px-md-3 pt-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
            <Marker />
            <Typography>{'\u00A0'} Midterm Allowed for {(function () {
              let result = '';
              if (memberRelation.includes('2') && (memberRelation.includes('3') || memberRelation.includes('4')))
                result = 'Spouse & Child'
              if (memberRelation.includes('2')) result = 'Spouse'
              else result = 'Child'
              if (memberRelation.includes("10")) {
                result = !result ? 'Partner' : ('Partner' + (result.includes('&') ? ', ' : ' & ') + result)
              }
              return result
            }())} </Typography>
            <br />
            {memberRelation.includes('2') && <>
              {/* Spouse */}
              <CustomCheck className="custom-control-checkbox">
                <label className="custom-control-label-check  container-check">
                  <span >{'Is Midterm Allowed for Spouse?'}</span>
                  <Controller
                    as={
                      <input
                        name={'is_midterm_enrollement_allowed_for_spouse'}
                        type="checkbox"
                        defaultChecked={policyData?.is_midterm_enrollement_allowed_for_spouse}
                      />
                    }
                    name={'is_midterm_enrollement_allowed_for_spouse'}
                    onChange={([e]) => e.target.checked ? 1 : 0}
                    control={control}
                    defaultValue={0}
                  />
                  <span className="checkmark-check"></span>
                </label>
              </CustomCheck>
              {!!is_midterm_enrollement_allowed_for_spouse && <Row>
                <Col xl={6} lg={9} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Spouse Enrolment Allowed Days (Mid Term)"
                        placeholder="Enter Spouse Enrolment Allowed Days (Mid Term)"
                        type="number"
                        min={0}
                        required
                        labelProps={{ background: '#f8f8f8' }}
                        error={errors && errors.default_midterm_enrollement_days_for_spouse}
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
                        labelProps={{ background: '#f8f8f8' }}
                        options={MidtermEnrollment(true)}
                        error={errors && errors.midterm_premium_calculation_from_for_spouse}
                      />
                    } rules={{ required: true }}
                    control={control}
                    name="midterm_premium_calculation_from_for_spouse"
                  />
                </Col>
              </Row>}
            </>}

            {memberRelation.includes('10') && <>
              {/* Partner */}
              <CustomCheck className="custom-control-checkbox">
                <label className="custom-control-label-check  container-check">
                  <span >{'Is Midterm Allowed for Partner?'}</span>
                  <Controller
                    as={
                      <input
                        name={'is_midterm_enrollement_allowed_for_partner'}
                        type="checkbox"
                        defaultChecked={policyData?.is_midterm_enrollement_allowed_for_partner}
                      />
                    }
                    name={'is_midterm_enrollement_allowed_for_partner'}
                    onChange={([e]) => e.target.checked ? 1 : 0}
                    control={control}
                    defaultValue={0}
                  />
                  <span className="checkmark-check"></span>
                </label>
              </CustomCheck>
              {!!is_midterm_enrollement_allowed_for_partner && <Row>
                {/* <Col xl={6} lg={9} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Partner Enrolment Allowed Days (Mid Term)"
                        placeholder="Enter Partner Enrolment Allowed Days (Mid Term)"
                        type="number"
                        min={0}
                        required
                        labelProps={{ background: '#f8f8f8' }}
                        error={errors && errors.default_midterm_enrollement_days_for_partner}
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
                        labelProps={{ background: '#f8f8f8' }}
                        options={MidtermEnrollment(false, true)}
                        error={errors && errors.midterm_premium_calculation_from_for_partner}
                      />
                    } rules={{ required: true }}
                    control={control}
                    name="midterm_premium_calculation_from_for_partner"
                  />
                </Col>
              </Row>}
            </>}

            {(memberRelation.includes('3') || memberRelation.includes('4')) && <>
              {/* Child */}
              <CustomCheck className="custom-control-checkbox">
                <label className="custom-control-label-check  container-check">
                  <span >{'Is Midterm Allowed for Child?'}</span>
                  <Controller
                    as={
                      <input
                        name={'is_midterm_enrollement_allowed_for_kids'}
                        type="checkbox"
                        defaultChecked={policyData?.is_midterm_enrollement_allowed_for_kids}
                      />
                    }
                    name={'is_midterm_enrollement_allowed_for_kids'}
                    onChange={([e]) => e.target.checked ? 1 : 0}
                    control={control}
                    defaultValue={0}
                  />
                  <span className="checkmark-check"></span>
                </label>
              </CustomCheck>
              {!!is_midterm_enrollement_allowed_for_kids && <Row>
                <Col xl={6} lg={9} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Child Enrolment Allowed Days (Mid Term)"
                        placeholder="Enter Child Enrolment Allowed Days (Mid Term)"
                        type="number"
                        min={0}
                        required
                        labelProps={{ background: '#f8f8f8' }}
                        error={errors && errors.default_midterm_enrollement_days_for_kids}
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
                        labelProps={{ background: '#f8f8f8' }}
                        options={MidtermEnrollment(false)}
                        error={errors && errors.midterm_premium_calculation_from_for_kids}
                      />
                    } rules={{ required: true }}
                    control={control}
                    name="midterm_premium_calculation_from_for_kids"
                  />
                </Col>
              </Row>}
            </>}
          </TextCard>
        </Col>
      </Row>}
      {(memberRelation.includes('3') ||
        memberRelation.includes('4')) &&
        <>
          <Marker />
          <Typography>{'\u00A0'}Special Child</Typography>
          <Row className="d-flex flex-wrap" >
            <Controller
              as={<OptionInput className="d-flex justify-content-center m-4">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}>{"Special Child"}</p>
                <input name={'has_special_child'} type={'checkbox'} defaultChecked={has_special_child} />
                <span style={{ left: "-125px", top: "0" }}></span>
              </OptionInput>}
              onChange={([e]) => { setHas_special_child(e.target.checked); return e.target.checked }}
              name={'has_special_child'}
              control={control}
            />
          </Row>
          {has_special_child &&
            <Row className="d-flex flex-wrap">
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input label="Premium" type="number" min={0} placeholder="Premium" required />}
                  name="special_child_additional_premium"
                  error={errors && errors.special_child_premium}
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input label="Employee Contribution %" type="number" min={0} max={100} placeholder="Employee Contribution" required />}
                  name="special_child_employee_contribution"
                  error={errors && errors.special_child_employee_contribution}
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input label="Employer Contribution %" type="number" min={0} max={100} placeholder="Employer Contribution" required />}
                  name="special_child_employer_contribution"
                  error={errors && errors.special_child_employer_contribution}
                  control={control}
                />
              </Col>
            </Row>}
        </>
      }

      {/* <Marker />
        <Typography>{'\u00A0'}Unmarried Child</Typography> */}
      {(memberRelation.includes('3') ||
        memberRelation.includes('4')) &&
        <>
          <Row className="d-flex flex-wrap" >
            <Controller
              as={<OptionInput className="d-flex justify-content-center m-4">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}>{"Unmarried Child"}</p>
                <input name={'has_unmarried_child'} type={'checkbox'} defaultChecked={has_unmarried_child} />
                <span style={{ left: "-150px", top: "0" }}></span>
              </OptionInput>}
              onChange={([e]) => { setHas_unmarried_child(e.target.checked); return e.target.checked }}
              name={'has_unmarried_child'}
              control={control}
            />
          </Row>
          {has_unmarried_child &&
            <>
              <Row className="d-flex flex-wrap">
                <Col md={6} lg={4} xl={3} sm={12}>
                  <Controller
                    as={<Input label="Premium" type="number" min={0} placeholder="Premium" required />}
                    name="unmarried_child_premium"
                    error={errors && errors.unmarried_child_premium}
                    control={control}
                  />
                </Col>
                <Col md={6} lg={4} xl={3} sm={12}>
                  <Controller
                    as={<Input label="Employee Contribution %" type="number" min={0} max={100} placeholder="Employee Contribution" required />}
                    name="unmarried_child_employee_contribution"
                    error={errors && errors.unmarried_child_employee_contribution}
                    control={control}
                  />
                </Col>
                <Col md={6} lg={4} xl={3} sm={12}>
                  <Controller
                    as={<Input label="Employer Contribution %" type="number" min={0} max={100} placeholder="Employer Contribution" required />}
                    name="unmarried_child_employer_contribution"
                    error={errors && errors.unmarried_child_employer_contribution}
                    control={control}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={4} xl={3} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="Unmarried Child Max Age"
                        placeholder="Enter Unmarried Child Max Age"
                        min={18}
                        type="number"
                        error={errors && errors['unmarried_min_age']}
                      />
                    }
                    defaultValue={'18'}
                    rules={{ required: true, min: 18 }}
                    name="unmarried_min_age"
                    control={control}
                  />
                </Col>
              </Row>
            </>}
        </>
      }

      {(memberRelation.filter((elem) => ['3', '4'].includes(elem)).length >= 1) &&
        <>
          <Row className="d-flex flex-wrap">
            <Controller
              as={<OptionInput className="d-flex justify-content-center m-4">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}>{"Adopted Child Allowed"}</p>
                <input name={'has_adopted_child'} type={'checkbox'} defaultChecked={!!policyData.has_adopted_child} />
                <span style={{ left: "-190px", top: "0" }}></span>
              </OptionInput>}
              onChange={([e]) => e.target.checked}
              name={'has_adopted_child'}
              control={control}
            />
          </Row>
          <Marker />
          <Typography>{'\u00A0'}Max Twin</Typography>
          <Row className="d-flex flex-wrap">
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input label="Max Twin Allowed" type="number" min={0} placeholder="Max Twin" isRequired={false}
                  required={false} />}
                name="max_twins"
                // error={errors && errors.unmarried_child_premium}
                //error={errors && errors['max_twins']}
                //rules={{ required: true, min: 0 }}
                defaultValue={'0'}
                control={control}
              />
            </Col>
          </Row>
        </>}

      {(memberRelation.includes('5') &&
        // memberRelation.includes('6') &&
        memberRelation.includes('7')
        // && memberRelation.includes('8')
      ) &&
        <>
          <Marker />
          <Typography>{'\u00A0'}Parent Cross Selection</Typography>
          <Row className="d-flex flex-wrap" >
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Has Parent Cross Selection</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -40px' }}>
                <Controller
                  as={<CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                    <input name={'parent_cross_selection'} type={'radio'} value={1} defaultChecked={!!policyData.has_parent_cross_selection} />
                    <span></span>
                  </CustomControl>}
                  name={'parent_cross_selection'}
                  control={control}
                />
                <Controller
                  as={<CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                    <input name={'parent_cross_selection'} type={'radio'} value={0} defaultChecked={!policyData.has_parent_cross_selection} />
                    <span></span>
                  </CustomControl>}
                  name={'parent_cross_selection'}
                  control={control}
                />
              </div>
            </Col>
          </Row>
        </>
      }

      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="submit">
            Update
          </Button>
        </Col>
      </Row>
    </Form>)
};

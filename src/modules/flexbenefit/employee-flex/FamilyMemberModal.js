import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./styleflexmodal.css";
import { Checkbox, TextField, FormControlLabel } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import classesone from "./FamilyMemberModal.module.css";

import { SelectComponent } from "../../../components";
import { /* Badge, */ Col, Row } from "react-bootstrap";
import swal from "sweetalert";
import _ from "lodash";
import { Controller, useForm } from "react-hook-form";
import { subDays } from "date-fns";

export const Relation_Name = {
  1: "Self",
  2: "Spouse",
  3: "Daughter",
  4: "Son",
  5: "Father",
  6: "Mother",
  7: "Father-in-law",
  8: "Mother-in-law",
  9: "Siblings",
  10: "Partner",
}

const CoverAction = (sum_insureds, cover_actions, current_suminsured, employeePolicies, currentPlanDetail) => {
  if (!cover_actions?.length) {
    return sum_insureds;
  }
  if (cover_actions[0].cover_action === 0) { // ALL
    return sum_insureds
  }
  let current_suminsured_$ = 0;
  if (current_suminsured_$ && typeof (current_suminsured_$) !== 'string') {
    current_suminsured_$ = current_suminsured
  } else {
    const currentPolicyDetail = employeePolicies.find(({ policy_sub_type_id, policy_end_date }) => policy_sub_type_id === currentPlanDetail.product_id &&
      // previous policy end date is between 30 days of current policy start date
      (new Date(policy_end_date).setHours(0, 0, 0, 0) <= new Date(currentPlanDetail.policy_start_date).setHours(0, 0, 0, 0) &&
        new Date(policy_end_date).setHours(0, 0, 0, 0) >= subDays(new Date(currentPlanDetail.policy_start_date), 31).setHours(0, 0, 0, 0))
    )
    if (currentPolicyDetail?.suminsured) {
      current_suminsured_$ = +currentPolicyDetail.suminsured;
    }
  }
  if (!current_suminsured_$) return sum_insureds;

  if (cover_actions[0].cover_action === 1) { // Enhance
    return sum_insureds.filter(({ sum_insured }) => +sum_insured >= current_suminsured_$)
  }

  if (cover_actions[0].cover_action === 2) { // Reduce
    return sum_insureds.filter(({ sum_insured }) => +sum_insured <= current_suminsured_$)
  }
  if (cover_actions[0].cover_action === 3) { // Disabled
    return sum_insureds.filter(({ sum_insured }) => +sum_insured === current_suminsured_$)
  }

}

const disableAction = ({
  id, members_selected, index, ExtractedDetail,
  is_only_topup, is_only_parent, is_only_base,
  /* selected_si, */
  topup_selected_si, parent_selected_si,
  set_members_selected, isChecked, PolicyCoverages }) => {

  if (id === 1) return true // self

  if (PolicyCoverages?.some(relation_id => id === relation_id)) {
    return true
  }

  if (([3, 4].includes(id) &&
    !members_selected[index]?.selected &&
    members_selected.filter((elem) => elem && [3, 4].includes(elem.id) && elem.selected).length >= ExtractedDetail.no_of_childs))
    return true // child limit exceed

  if ([5, 6, 7, 8].includes(id) &&
    !members_selected[index]?.selected &&
    members_selected.filter((elem) => elem && [5, 6, 7, 8].includes(elem.id) && elem.selected).length >= ExtractedDetail.max_parents)
    return true // parent limit exceed

  // cross parent selection
  if (!ExtractedDetail.has_parent_cross_selection && [5, 6, 7, 8].includes(id)) {
    if ([5, 6].includes(id) &&
      !members_selected[index]?.selected &&
      members_selected.some((elem) => elem && [7, 8].includes(elem.id) && elem.selected)) {
      return true
    }

    if ([7, 8].includes(id) &&
      !members_selected[index]?.selected &&
      members_selected.some((elem) => elem && [5, 6].includes(elem.id) && elem.selected)) {
      return true
    }
  }

  // disable relation if topup policy is not selected
  if (is_only_topup && (!is_only_parent && !is_only_base) && !Number.isInteger(Number(topup_selected_si?.value))) {
    isChecked && set_members_selected(prev => {
      const prevCopy = [...prev];
      prevCopy[index] = {
        id,
        selected: false
      };
      return prevCopy;
    });
    return true
  }

  // disable relation if parent policy is not selected
  if (is_only_parent && (!is_only_topup && !is_only_base) && !Number.isInteger(Number(parent_selected_si?.value))) {
    isChecked && set_members_selected(prev => {
      const prevCopy = [...prev];
      prevCopy[index] = {
        id,
        selected: false
      };
      return prevCopy;
    });
    return true
  }

  // disable relation if topup policy && is_only_parent is not selected either
  if (is_only_topup && is_only_parent && (!is_only_base) && (!Number.isInteger(Number(topup_selected_si?.value)) && !Number.isInteger(Number(parent_selected_si?.value)))) {
    isChecked && set_members_selected(prev => {
      const prevCopy = [...prev];
      prevCopy[index] = {
        id,
        selected: false
      };
      return prevCopy;
    });
    return true
  }

  // disable if relation is not in base but in other policies(topup & parent)
  if (parent_selected_si && topup_selected_si && is_only_parent && is_only_topup && !is_only_base && !Number.isInteger(Number(parent_selected_si?.value))) {
    isChecked && set_members_selected(prev => {
      const prevCopy = [...prev];
      prevCopy[index] = {
        id,
        selected: false
      };
      return prevCopy;
    });
    return true
  }

}

const sortRelation = (optionRelation, stateRelation, PolicyCoverages) => {
  let optionRelationCopy = _.cloneDeep(optionRelation)
  let newArray = [];
  stateRelation.forEach(({ relation_id }, index) => {
    const currentRelation = optionRelationCopy?.filter(elem => !!elem).find(({ id, selected, isProccessed }) => (id === relation_id && selected && !isProccessed));
    const indexoOfCurrentRelation = optionRelationCopy?.filter(elem => !!elem).findIndex(({ id, selected, isProccessed }) => (id === relation_id && selected && !isProccessed));
    if (indexoOfCurrentRelation >= 0 && optionRelationCopy[indexoOfCurrentRelation]) optionRelationCopy[indexoOfCurrentRelation].isProccessed = true;
    newArray[index] = { id: relation_id, selected: (currentRelation || PolicyCoverages?.some(rel_id => rel_id === relation_id)) ? true : false }
  });
  return newArray
}

const FlexModal = ({ lgShow, onHide, details, topup_detail,
  parent_detail, setOptionState, optionState, employeePolicies,
  globalTheme, setPremiumUpdated, isSinglePlan }) => {

  const { control, watch, reset } = useForm({
    defaultValues: optionState.sum_insureds.reduce((total, elem) => {
      const finalObj = { ...total };
      finalObj[String(elem.flex_id)] = { label: elem.sum_insured, value: elem.sum_insured };
      return finalObj;
    }, {})
  })
  const ExtractedDetail = ExtractDataModal(details, topup_detail, parent_detail, optionState.relation_ids);
  const [members, setMembers] = useState(ExtractedDetail.allowed_relations.sort(function (a, b) {
    return a?.relation_id - b?.relation_id;
  }));

  const [members_selected, set_members_selected] = useState(sortRelation(optionState.relation_ids, members, (isSinglePlan ? details[0].PolicyCoverages : [])));

  useEffect(() => {
    if (ExtractedDetail?.allowed_relations?.length &&
      optionState?.relation_ids?.length &&
      optionState?.relation_ids.some(({ id }) =>
        !ExtractedDetail?.allowed_relations.some(({ relation_id }) => +relation_id === +id))
    ) {
      setOptionState(prev => ({
        ...prev,
        relation_ids: ExtractedDetail?.allowed_relations.map(({ relation_id }) => ({ id: relation_id, selected: true })),
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ExtractedDetail?.allowed_relations, optionState?.relation_ids])

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const data = watch() || {};

  useEffect(() => {
    if (lgShow) {
      reset(optionState.sum_insureds.reduce((total, elem) => {
        const finalObj = { ...total };
        finalObj[String(elem.flex_id)] = { label: elem.sum_insured || data[elem.flex_id]?.value, value: elem.sum_insured || data[elem.flex_id]?.value };
        return finalObj;
      }, {}))
      set_members_selected(sortRelation(optionState.relation_ids, members, (isSinglePlan ? details[0].PolicyCoverages : [])))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgShow])

  const onSubmit = () => {

    for (let { flex_id } of optionState.sum_insureds) {
      if (data[flex_id]?.value && typeof (data[flex_id]?.value) !== 'string') {
        const planDetail = [...details, ...topup_detail,
        ...parent_detail].find(item => item.id === flex_id);
        if (planDetail &&
          !planDetail.allowed_relations.some(({ relation_id }) =>
            members_selected.some(({ id, selected }) => id === relation_id && selected)
          )) {
          const relationsString = planDetail.allowed_relations.reduce((total, { relation }, index) => total ? total + (index + 1 === planDetail.allowed_relations.length ? '& ' : ', ') + relation : relation, '')
          return swal(`${planDetail.plan_name}: To add this policy select atleast one relation (${relationsString})`, '', 'info')
        }
      }
    }

    setOptionState(prev => ({
      sum_insureds: prev.sum_insureds.map(elem => ({
        ...elem,
        sum_insured: data[elem.flex_id]?.value || elem.sum_insured
      })),
      relation_ids: members_selected,
      step: prev.step + 1
    }))
    // setTimeout(() => {
    // setPremiumUpdated(prev => prev === 0 ? 1 : prev)
    // }, 1000)
    onHide()
    swal('Record Updated Successfully', '', 'success')
  }

  const Check = ({ labelName, id, index, is_only_topup, is_only_parent, is_only_base }) => {
    return (
      <div className="col-12 col-xl-6">
        <div className="row justify-content-center">
          <div className="col-11">
            <FormControlLabel
              control={
                <Checkbox
                  {...label}
                  disabled={disableAction({
                    id, members_selected, index, ExtractedDetail,
                    is_only_topup, is_only_parent, is_only_base,
                    /* selected_si, */
                    // topup_selected_si, parent_selected_si,
                    topup_selected_si: data[optionState.sum_insureds.find(({ type, flex_id }) => type === 2 && data[flex_id]?.value)?.flex_id],
                    parent_selected_si: data[optionState.sum_insureds.find(({ type, flex_id }) => type === 3 && data[flex_id]?.value)?.flex_id],
                    set_members_selected, isChecked: members_selected[index]?.selected,
                    PolicyCoverages: isSinglePlan ? details[0].PolicyCoverages : []
                  })}
                  style={{ color: globalTheme?.Tab?.color }}
                  checked={!!members_selected[index]?.selected}
                  onChange={(e) => {
                    set_members_selected(prev => {
                      const prevCopy = [...prev];
                      prevCopy[index] = {
                        id,
                        selected: e.target.checked
                      };
                      return prevCopy;
                    });
                    return e
                  }}
                />
              }
              label={labelName}
              name={`relation_id.${index}`}
            />
          </div>
          {false && <div className="col-6 col-sm-4">
            {/* <TextField
                placeholder="Enter Age"
                id="standard-basic"
                variant="standard"
              /> */}
            <Autocomplete
              style={{ marginTop: "-12px" }}
              // {...defaultProps}
              id="disable-close-on-select"
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField {...params} maxLength='3' label="Select Age" variant="standard" />
              )}
            />
          </div>}
        </div>
      </div>
    );
  };

  return (
    <Modal
      size="lg"
      show={!!lgShow}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      backdrop={'static'}
      keyboard={false}
      className="special_modalasdsa_flex">
      <Modal.Body>
        <div
          className={`px-3 py-3 d-flex justify-content-between ${classesone.borderDashed}`}>
          <div>
            <p className="h5">Select Your Policy & Family Details</p>
          </div>
          {lgShow !== 1 && <div onClick={() => {
            const getCalculatedRelations = sortRelation(optionState.relation_ids, members, (isSinglePlan ? details[0].PolicyCoverages : []));
            if (!_.isEqual(getCalculatedRelations, optionState.relation_ids)) {
              setOptionState(prev => ({
                ...prev,
                relation_ids: getCalculatedRelations,
                step: prev.step + 1
              }))
            }
            setPremiumUpdated(prev => prev === 0 ? 1 : prev);
            set_members_selected(getCalculatedRelations);
            onHide()
          }} style={{ color: globalTheme?.Tab?.color }} className={classesone.redColor}>
            <i className="fas fa-times"></i>
          </div>}
        </div>
        <Row
          className={`px-3 py-3 d-flex justify-content-between ${classesone.borderDashed}`}>
          {optionState.sum_insureds.map((elem) => {
            const current_suminsured = watch(String(elem.flex_id)) || {};
            const currentPlanDetail = [...details, ...topup_detail, ...parent_detail].find(({ id }) => elem.flex_id === id)
            let shouldDisabled = false
            for (let topupPolicyDetail of (elem.top_up_policy_ids || [])) {
              const DependendPolicy = optionState.sum_insureds
                .filter(({ top_up_policy_ids, flex_id }) => top_up_policy_ids?.length && flex_id !== elem.flex_id)
                .find(({ policy_id }) => topupPolicyDetail.top_up_policy_id === policy_id);

              if (DependendPolicy && DependendPolicy.type === elem.type && data[DependendPolicy.flex_id]?.value && typeof (data[DependendPolicy.flex_id]?.value) !== 'string') {
                shouldDisabled = true
              }
            }

            return <Col xl={4} lg={4} md={6} sm={12} className="mx-auto">
              <Controller
                as={
                  <SelectComponent
                    label={elem.plan_name}
                    placeholder="Select Sum Insured"
                    {...{
                      ...elem.type === 1 && {
                        labelProps: currentPlanDetail.flex_suminsured.length === 1 ? { background: 'linear-gradient(#ffffff, #f2f2f2)' } : false,
                        disabled: currentPlanDetail.flex_suminsured.length === 1,
                        required: true
                      },
                      ...(elem.type === 2 || elem.type === 3) && {
                        labelProps: { ...elem.plan_name.length > 28 ? { style: { whiteSpace: 'normal' } } : {}, ...shouldDisabled && { background: 'linear-gradient(#ffffff, #f2f2f2)' } },
                        spanProps: elem.plan_name.length > 28 ? { style: { top: '-27px' } } : undefined,
                        disabled: shouldDisabled,
                        isClearable: current_suminsured.value !== 'Select Sum Insured'
                      }
                    }}
                    options={[...elem.type !== 1 ? [{ sum_insured: 'Select Sum Insured' }] : [], ...(CoverAction(currentPlanDetail.flex_suminsured, currentPlanDetail.cover_actions, +elem.sum_insured, employeePolicies, currentPlanDetail))]?.map(({ sum_insured }) => (
                      {
                        value: sum_insured,
                        label: sum_insured,
                      }
                    )) || []}
                  />
                }
                onChange={([e]) => (e || { value: 'Select Sum Insured', label: 'Select Sum Insured' })}
                name={String(elem.flex_id)}
                control={control}
                defaultValue={{
                  value: elem.sum_insured,
                  label: elem.sum_insured,
                }}
              />
            </Col>
          })}
        </Row>
        <div className="p-3 row justify-content-between w-100">
          {members.map(({ relation_id, relation, is_only_topup, is_only_parent, is_only_base }, index) => (
            <Check key={index + 'member'} index={index} id={relation_id}
              is_only_topup={is_only_topup} is_only_parent={is_only_parent} is_only_base={is_only_base}
              // labelName={<div className="d-flex align-items-center">
              //   <div style={{ minWidth: '110px' }}>{relation}</div>
              //   {' '}{(is_only_base || is_only_topup || is_only_parent) &&
              //     <Badge variant="dark" className="font-weight-normal">
              //       {is_only_base && 'Base'}
              //       {is_only_base && is_only_topup && is_only_parent && ', '}
              //       {is_only_base && ((is_only_topup && !is_only_parent) || (is_only_parent && !is_only_topup)) && ' & '}
              //       {is_only_topup && 'Topup'}
              //       {is_only_topup && is_only_parent && ' & '}
              //       {is_only_parent && 'Parent'}
              //       {' '}Policy</Badge>}
              // </div>}
              labelName={relation}
            />
          ))}
        </div>
        {(ExtractedDetail.no_of_childs > 1 || !!ExtractedDetail.no_of_siblings) && <div
          className={`row mx-3 my-1 p-2 justify-content-center align-items-center ${classesone.borderRadius}`}
          style={{ background: globalTheme?.Tab?.color + '14' }}>
          {members.filter(({ relation_id }) => relation_id === 4).length < ExtractedDetail.no_of_childs &&
            <div onClick={() => setMembers(members => [...members, members.find(({ relation_id }) => relation_id === 4)])} className={`col-12 col-lg-4 mb-2 mb-lg-0 mt-2 text-center ${classesone.colorAddTab} ${classesone.borderLeftRight}`}>
              <p className="h5">
                Add Son <i className={`fas fa-plus-circle`}></i>
              </p>
            </div>}
          {members.filter(({ relation_id }) => relation_id === 3).length < ExtractedDetail.no_of_childs &&
            <div onClick={() => setMembers(members => [...members, members.find(({ relation_id }) => relation_id === 3)])} className={`col-12 col-lg-4 mb-2 mb-lg-0 mt-2 text-center ${classesone.colorAddTab} ${classesone.borderLeftRight}`}>
              <p className="h5">
                Add Daughter <i className={`fas fa-plus-circle`}></i>
              </p>
            </div>}
          {members.filter(({ relation_id }) => relation_id === 9).length < ExtractedDetail.no_of_siblings &&
            <div onClick={() => setMembers(members => [...members, members.find(({ relation_id }) => relation_id === 9)])} className={`col-12 col-lg-4 mb-2 mb-lg-0 mt-2 text-center ${classesone.colorAddTab} ${classesone.borderLeftRight}`}>
              <p className="h5">
                Add Sibling <i className={`fas fa-plus-circle`}></i>
              </p>
            </div>}
        </div>}
        <div onClick={onSubmit} className={`d-flex justify-content-center align-items-center ${classesone.borderDashedTop}`}>
          <div style={{ background: globalTheme?.Tab?.color }} className={`py-3 px-5 mt-3 rounded-lg ${classesone.bigButton}`}>
            <h5 className="mb-0">Submit</h5>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FlexModal;

export const ExtractDataModal = (details, topup_detail = [], parent_detail = [], selectedRelations) => {


  // const group_sum_insureds = details.reduce((sum_ins, { flex_suminsured }) =>
  //   [...sum_ins, ...flex_suminsured?.reduce((si, { sum_insured }) => [...si, sum_insured], []) || []],
  //   []);
  // const topup_sum_insureds = topup_detail.reduce((sum_ins, { flex_suminsured }) =>
  //   [...sum_ins, ...flex_suminsured?.reduce((si, { sum_insured }) => [...si, sum_insured], []) || []],
  //   []);
  // const parent_sum_insureds = parent_detail.reduce((sum_ins, { flex_suminsured }) =>
  //   [...sum_ins, ...flex_suminsured?.reduce((si, { sum_insured }) => [...si, sum_insured], []) || []],
  //   []);
  let allowed_relations = [
    ...topup_detail/* .map(elem => ({ ...elem, allowed_relations: elem.allowed_relations.map(elem2 => ({ ...elem2, is_only_topup: true })) })) */,
    ...parent_detail/* .map(elem => ({ ...elem, allowed_relations: elem.allowed_relations.map(elem2 => ({ ...elem2, is_only_parent: true })) })) */,
    ...details,
  ].reduce((sum_ins, { allowed_relations, NoPolicyCoverages }) =>
    [...sum_ins, ...NoPolicyCoverages?.length ? allowed_relations.filter(({ relation_id }) => !NoPolicyCoverages?.some(id => id === relation_id)) : allowed_relations]
    , []);


  allowed_relations = [...new Map(allowed_relations.map(item =>
    [item['relation_id'], item])).values()]

  const no_of_siblings = details.reduce((max_value, { no_of_siblings }) =>
    max_value < no_of_siblings ? no_of_siblings : max_value,
    0);
  const no_of_childs = details.reduce((max_value, { no_of_childs }) =>
    max_value < no_of_childs ? no_of_childs : max_value,
    0);
  const max_parents = [...details, ...topup_detail, ...parent_detail].reduce((max_value, { max_parents }) =>
    max_value < max_parents ? max_parents : max_value,
    0);

  const has_parent_cross_selection = [
    ...topup_detail,
    ...parent_detail,
    ...details,
  ].some(({ has_parent_cross_selection }) => !!has_parent_cross_selection)

  if (selectedRelations.some(({ id }) => [3, 4].includes(id)) || allowed_relations.some(({ relation_id }) => [3, 4].includes(relation_id))) {
    const noOfDaughterSelectedRelation = selectedRelations.filter(({ id }) => [3].includes(id)).length;
    const noOfDaughterAllowedRelation = allowed_relations.filter(({ relation_id }) => [3].includes(relation_id)).length;
    const noOfSonSelectedRelation = selectedRelations.filter(({ id }) => [4].includes(id)).length;
    const noOfSonAllowedRelation = allowed_relations.filter(({ relation_id }) => [4].includes(relation_id)).length;

    if (noOfDaughterSelectedRelation > noOfDaughterAllowedRelation) {
      const daughterData = allowed_relations.find(({ relation_id }) => [3].includes(relation_id));
      for (let i = 0; i < (noOfDaughterSelectedRelation - noOfDaughterAllowedRelation); ++i) {
        allowed_relations.push(daughterData)
      }
    }
    if (noOfSonSelectedRelation > noOfSonAllowedRelation) {
      const sonData = allowed_relations.find(({ relation_id }) => [4].includes(relation_id));
      for (let i = 0; i < (noOfSonSelectedRelation - noOfSonAllowedRelation); ++i) {
        allowed_relations.push(sonData)
      }
    }
  }

  return {
    // group_sum_insureds: [...new Set(group_sum_insureds)],
    // topup_sum_insureds: [...new Set(topup_sum_insureds)],
    // parent_sum_insureds: [...new Set(parent_sum_insureds)],
    allowed_relations: allowed_relations.map(elem => {
      return ({
        ...elem,
        is_only_base: (topup_detail.length || parent_detail.length) ? details.some(elem3 => elem3.allowed_relations.some(elem2 => +elem.relation_id === +elem2.relation_id)) : false,
        is_only_topup: (details.length || parent_detail.length) ? topup_detail.some(elem3 => elem3.allowed_relations.some(elem2 => +elem.relation_id === +elem2.relation_id)) : false,
        is_only_parent: (topup_detail.length || details.length) ? parent_detail.some(elem3 => elem3.allowed_relations.some(elem2 => +elem.relation_id === +elem2.relation_id)) : false
      })
    }),
    no_of_siblings, no_of_childs, max_parents, has_parent_cross_selection
  }
}

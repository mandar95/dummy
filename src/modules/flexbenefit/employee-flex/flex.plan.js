import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";

import { Row, Col, Accordion, OverlayTrigger, Tooltip } from "react-bootstrap";
import { RFQButton } from "../../../components";
import "./flex.css"
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";
import { StyledButton } from "modules/RFQ/data-upload/style.js";
import FlexModal/* , { BenefitDetail, CalculatePR, CalculateSI } */ from "./FlexSummaryModal";
import { NumberInd } from "../../../utils";
import { getSiPr, tempStorage } from "./employee-flex.action";
import FamilyMemberModal, { Relation_Name } from "./FamilyMemberModal";
import { OptionInput } from "modules/flexbenefit/style.js";
import { useForm } from "react-hook-form";
import { TopupFlexPlan } from "./topup.flex.plan";
import { AddOnFlexPlan } from "./addon.flex.plan";
import { BaseFlexPlan, NewBasePremium } from "./base.flex.plan";
// import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomNames } from "../flex-config/BenefitModal";
import { isString } from "lodash";
import swal from "sweetalert";
import { CoverType } from "../../policies/steps/additional-details/additional-cover";
import { AnchorTag2 } from "../../core/form/style";
import { FilterPolicyFeature, giveInstalment } from "./helper";
import { useSelector } from "react-redux";
import FlexSummaryModal, { BenefitDetail, CalculatePR, CalculateSI } from "./FlexSummaryModal";
import { ModuleControl } from "../../../config/module-control";
import { subDays } from "date-fns";


const ContextAwareToggle2 = ({ eventKey, callback, globalTheme }) => {
	const currentEventKey = useContext(AccordionContext);
	const decoratedOnClick = useAccordionToggle(
		eventKey,
		() => callback && callback(eventKey)
	);
	const isCurrentEventKey = currentEventKey === eventKey;
	return (
		<StyledButton
			color='#60c385'
			variant="link"
			className="open-button"
			onClick={decoratedOnClick}
			relative={'relative'}>
			{isCurrentEventKey ? (<i
				style={{
					color: globalTheme?.Tab?.color || '#41807f',
					fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
					marginLeft: '-12px'
				}}
				className=" far fa-minus-square"></i>) :
				(<i style={{
					color: globalTheme?.Tab?.color || '#41807f',
					fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
					marginLeft: '-12px'
				}} className=" far fa-plus-square"></i>
				)}
		</StyledButton>
	);
};


export const getURL = {
	"GMC": "/assets/images/flex-plan/Vectors_GMC.png",
	"GPA": "/assets/images/flex-plan/Vectors_GPA.png",
	"GTL": "/assets/images/flex-plan/Vectors_GTL.png",
}

const FilterRelation = (details, topup_detail, parent_detail) => {
	if ((details[0]?.endrosed_relations?.length || topup_detail[0]?.endrosed_relations?.length) || parent_detail[0]?.endrosed_relations?.length) {
		const mergeRelations = [...details[0]?.endrosed_relations?.length ? details[0]?.endrosed_relations : [],
		...topup_detail[0]?.endrosed_relations?.length ? topup_detail[0]?.endrosed_relations : [],
		...parent_detail[0]?.endrosed_relations?.length ? parent_detail[0]?.endrosed_relations : []];

		if (mergeRelations.length) {
			const filteredRelations = [];
			mergeRelations.forEach(id => (!filteredRelations.includes(id) || (filteredRelations.filter(elem => elem === id).length < (details[0]?.members?.filter(({ relation_id }) => relation_id === id).length || topup_detail[0]?.members?.filter(({ relation_id }) => relation_id === id).length || parent_detail[0]?.members?.filter(({ relation_id }) => relation_id === id).length))) && filteredRelations.push(id))
			return (filteredRelations
				.map(id => ({ id, selected: true })))
		}
	}

	return []
}

const FlexPlan = ({
	type, details, topup_detail, parent_detail, oldBenefits, title,
	dispatch, reducerdetails, show, setShow, /* setUseTempData, useTempData, */
	globalTheme, sticky, hasOtherPlans, setTab, nextTo, isLastPlan, tempData,
	base_product_id, premiumUpdated, setPremiumUpdated, employeePolicies }) => {

	const tempDataDetail = /* useTempData[base_product_id - 1] && */ tempData?.flex_details?.find(({ product_id, is_parent_plan }) => base_product_id === product_id && !is_parent_plan)
	// const tempDataDetailTopup = /* useTempData[base_product_id - 1] && */ tempData?.flex_details?.find(({ product_id, is_parent_plan }) => (base_product_id + 3) === product_id && !is_parent_plan)
	// const tempDataDetailParent = /* useTempData[base_product_id - 1] && */ tempData?.flex_details?.find(({ product_id, is_parent_plan }) => base_product_id === product_id && is_parent_plan)


	const ExtractedDetail = ExtractData(details, tempData)
	const [lgShow, setLgShow] = useState(false);
	const { currentUser } = useSelector((state) => state.login);

	const [planWidth, setPlanWidth] = useState(300);

	const [optionState, setOptionState] = useState({
		sum_insureds: [
			...details.map((elem) => {
				const temp_sum = tempData?.flex_details?.find(({ plan_id }) => plan_id === elem.id)?.policy_suminsured || elem.current_suminsured || elem.intial_suminsured;
				const sum_ins = elem.flex_suminsured.some(({ sum_insured }) =>
					sum_insured ===
					(temp_sum)) ? temp_sum : elem.flex_suminsured[0]?.sum_insured;;
				return ({
					sum_insured: sum_ins || 0,
					flex_id: elem.id,
					plan_name: elem.plan_name,
					type: 1
				})
			}),
			...topup_detail.map((elem) => {
				return ({
					sum_insured: tempData?.flex_details?.find(({ plan_id }) => plan_id === elem.id)?.policy_suminsured || elem.current_suminsured || 'Select Sum Insured',
					flex_id: elem.id,
					plan_name: elem.plan_name,
					policy_id: elem.policy_id,
					top_up_policy_ids: elem.topup_compulsion_flag === 3 ? elem.top_up_policy_ids : [],
					type: 2
				})
			}),
			...parent_detail.map((elem) => {
				return ({
					sum_insured: tempData?.flex_details?.find(({ plan_id }) => plan_id === elem.id)?.policy_suminsured || elem.current_suminsured || 'Select Sum Insured',
					flex_id: elem.id,
					plan_name: elem.plan_name,
					type: 3
				})
			})],
		relation_ids: (tempDataDetail?.allRelations?.length && tempDataDetail?.allRelations) ||
			(FilterRelation(details, topup_detail, parent_detail)) ||
			[{ id: 1, selected: true }],
		step: 1
	});

	const allRelations = optionState.relation_ids.filter(elem => elem && elem.selected);

	const { watch, register, setValue } = useForm();

	useEffect(() => {
		if (!sticky) {
			const intervalId = setInterval(() => {
				setPlanWidth(
					document.getElementById('first-col')?.clientWidth +
					details.reduce((total, { id }) => total + document.getElementById(id + 'card')?.clientWidth, 0) +
					details.reduce((total, _, index) => total + (index > 2 ? (index === 3 ? 60 : 20) : 0), 0))
			}, 0)
			return () => {
				clearInterval(intervalId)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		oldBenefits?.length &&
			oldBenefits.forEach(({ benefit }) => setValue(`benefits.${benefit}`, benefit))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oldBenefits])

	useEffect(() => {
		getSiPr(dispatch, [...details, ...topup_detail, ...parent_detail].map(({ product_id, policy_id, suminsured, flex_suminsured, id, is_parent_policy, allowed_relations, ...item }) => {

			let sum_insured = optionState.sum_insureds.find(({ flex_id }) => flex_id === id)?.sum_insured || suminsured || 0;
			const NoOfTimeSalary = (item?.no_of_times_salary?.length) ? item?.no_of_times_salary[item?.policy_suminsureds?.findIndex(si => +si === +sum_insured)] : false
			// if (flex_suminsured.every((elem) => Number(elem.sum_insured) !== Number(sum_insured))) {
			// 	if ((!is_parent_policy && product_id <= 3)) {
			// 		sum_insured = flex_suminsured[0]?.sum_insured
			// 	} else {
			// 		sum_insured = 0
			// 	}
			// }

			return ({
				plan_id: id,
				policy_id: policy_id,
				...NoOfTimeSalary && { number_of_time_salary: Number(NoOfTimeSalary) },
				sum_insured: sum_insured,
				relation_ids: allRelations.filter(({ id }) => allowed_relations.some(({ relation_id }) => Number(id) === relation_id)).map(({ id }) => id)
			})
		}), reducerdetails, { setPremiumUpdated, isSinglePlan })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [optionState])

	const selectedBenefit = watch('benefits');

	const selectedTopup = watch('topup');
	const selectedTopupBenefit = watch('benefitsTopup')

	const selectedParent = watch('parent');
	const selectedParentBenefit = watch('benefitsParent')

	const choosedTopup = topup_detail?.filter(({ id }) => Array.isArray(selectedTopup) ? selectedTopup?.some(item => +item === id) : Number(selectedTopup) === id);
	const choosedParent = parent_detail?.filter(({ id }) => Array.isArray(selectedParent) ? selectedParent?.some(item => +item === id) : Number(selectedParent) === id);
	const AddOnFlex = watch('flex');

	const isSinglePlan = details?.length === 1;

	const onSubmit = (item, procceed) => {

		if ([...details, ...topup_detail, ...parent_detail].some((elem) =>
			elem.topup_compulsion_flag === 3 && elem.employee_eligibility === 2 &&
			employeePolicies.some(({ policy_sub_type_id, policy_end_date }) => policy_sub_type_id === elem.product_id &&
				// previous policy end date is between 30 days of current policy start date
				(new Date(policy_end_date).setHours(0, 0, 0, 0) <= new Date(elem.policy_start_date).setHours(0, 0, 0, 0) &&
					new Date(policy_end_date).setHours(0, 0, 0, 0) >= subDays(new Date(elem.policy_start_date), 31).setHours(0, 0, 0, 0))
			))) {
			const allOptionalMandatoryPolicies = [...details, ...topup_detail, ...parent_detail].filter((elem) => elem.topup_compulsion_flag === 3 && elem.employee_eligibility === 2);
			const allSelectedPolicies = [item, ...choosedTopup, ...choosedParent]
			const MandatoryNotSelected = allOptionalMandatoryPolicies.filter(elem => !allSelectedPolicies.some(({ topup_master_policy_id }) => topup_master_policy_id === elem.topup_master_policy_id))
			if (MandatoryNotSelected.length) {
				if (MandatoryNotSelected.every(({ topup_master_policy_id }) => topup_master_policy_id === MandatoryNotSelected[0].topup_master_policy_id)) {
					swal(MandatoryNotSelected.reduce((total, elem) => total ? (total + ' or ' + elem.plan_name) : elem.plan_name, '') + ' is mandatory')
					return null;
				} else {
					swal(MandatoryNotSelected.reduce((total, elem) => total ? (total + ' and ' + elem.plan_name) : elem.plan_name, '') + ' is mandatory')
					return null;
				}
			}

		}

		if (isSinglePlan &&
			!item.NoPolicyCoverages.some(relation_id => optionState.relation_ids.some(({ id, selected }) => +id === +relation_id && selected) && item.allowed_relations.some((elem) => +elem.relation_id === +relation_id)) &&
			!item.PolicyCoverages.every(relation_id => optionState.relation_ids.some(({ id, selected }) => +id === +relation_id && selected) || !item.allowed_relations.some((elem) => +elem.relation_id === +relation_id))) {
			swal('Alert', 'Please Update Relation before moving forward', 'info').then(() => {
				setShow(1);
			})
			return null;
		}
		//check mandatory
		let allMandatoryRelationTaken = [];
		const MandatoryPlan = [/* ...details, */ ...topup_detail, ...parent_detail]
			.find(({ id, PolicyCoverages, product_id, is_parent_policy, allowed_relations }) => {

				if ([1, 2, 3].includes(product_id) && is_parent_policy && !choosedParent.some(elem => elem.id === id) && PolicyCoverages?.length) {
					return true
				}
				if ([4, 5, 6].includes(product_id) && !choosedTopup.some(elem => elem.id === id) && PolicyCoverages?.length) {
					return true
				}

				allMandatoryRelationTaken = PolicyCoverages.filter(relation_id => optionState.relation_ids.some(({ id, selected }) => +id === +relation_id && !selected))
				if ([1, 2, 3].includes(product_id) && is_parent_policy && choosedParent.some(elem => elem.id === id) &&
					allMandatoryRelationTaken.length
					// !PolicyCoverages.every(relation_id => optionState.relation_ids.some(({ id, selected }) => +id === +relation_id && selected) || !allowed_relations.some((elem) => +elem.relation_id === +relation_id))
				) {
					// allMandatoryRelationTaken = PolicyCoverages.filter(relation_id => optionState.relation_ids.some(({ id, selected }) => +id === +relation_id && !selected))
					return true
				}
				if ([4, 5, 6].includes(product_id) && choosedTopup.some(elem => elem.id === id) &&
					allMandatoryRelationTaken.length
					// !PolicyCoverages.every(relation_id => optionState.relation_ids.some(({ id, selected }) => +id === +relation_id && selected) || !allowed_relations.some((elem) => +elem.relation_id === +relation_id))
				) {
					// allMandatoryRelationTaken = PolicyCoverages.filter(relation_id => optionState.relation_ids.some(({ id, selected }) => +id === +relation_id && !selected))
					return true
				}

				return false

			});
		if (MandatoryPlan) {
			(allMandatoryRelationTaken.length ?
				swal(MandatoryPlan.plan_name, allMandatoryRelationTaken
					.reduce((total, id, index) => total ? total + (allMandatoryRelationTaken.length === index + 1 ? ' & ' : ', ') + Relation_Name[id] : Relation_Name[id], '') + ' is Mandatory', 'info')
				: swal('Alert', MandatoryPlan.plan_name + ' is Mandatory', 'info'))
				.then(() => {
					setShow(1);
				})
			return null;
		}

		const parentBenefitSelected = item.plan_benefits.some(({ benefit_feature_details, benefit_name }) => (benefit_feature_details.some(({ has_capping_data }) => has_capping_data) && selectedBenefit && selectedBenefit[benefit_name]));

		const choosedBenefits = item.plan_benefits?.filter(({ benefit_name, benefit_feature_details, min_enchance_si_limit }) => selectedBenefit[benefit_name] && item.suminsured >= min_enchance_si_limit && benefit_feature_details
			.some(({ min_enchance_si_limit }) => item.suminsured >= min_enchance_si_limit))
			.map(({ benefit_feature_details, ...rest }) => ({ ...rest, benefit_feature_details: benefit_feature_details.filter(({ id }) => +id === +AddOnFlex[item.id][rest.benefit_name]) })) || [];
		const choosedTopupBenefits = choosedTopup
			.filter(elem => elem.suminsured && elem.topup_master_policy_id === item.policy_id)
			.map((itemTopup) => itemTopup.plan_benefits?.filter(({ benefit_name, benefit_feature_details, min_enchance_si_limit }) =>
				(itemTopup.plan_benefits.some(({ mandatory_if_not_selected_benefit_ids }) => mandatory_if_not_selected_benefit_ids) ? selectedTopupBenefit[itemTopup.id] && selectedTopupBenefit[itemTopup.id] === benefit_name : selectedTopupBenefit[benefit_name])
				&& itemTopup.suminsured >= min_enchance_si_limit && benefit_feature_details
					.some(({ min_enchance_si_limit }) => itemTopup.suminsured >= min_enchance_si_limit))
				.map(({ benefit_feature_details, ...rest }) => ({ ...rest, benefit_feature_details: benefit_feature_details.filter(({ id }) => +id === +AddOnFlex[itemTopup.id][rest.benefit_name]) })) || []);
		const choosedParentBenefits = choosedParent
			.filter(elem => elem.suminsured && elem.parent_base_policy_id === item.policy_id)
			.map((itemParent) => itemParent.plan_benefits?.filter(({ benefit_name, benefit_feature_details, min_enchance_si_limit }) =>
				(itemParent.plan_benefits.some(({ mandatory_if_not_selected_benefit_ids }) => mandatory_if_not_selected_benefit_ids) ? selectedParentBenefit[itemParent.id] && selectedParentBenefit[itemParent.id] === benefit_name : selectedParentBenefit[benefit_name])
				&& itemParent.suminsured >= min_enchance_si_limit && benefit_feature_details
					.some(({ min_enchance_si_limit }) => itemParent.suminsured >= min_enchance_si_limit))
				.map(({ benefit_feature_details, ...rest }) => ({ ...rest, benefit_feature_details: benefit_feature_details.filter(({ id }) => +id === +AddOnFlex[itemParent.id][rest.benefit_name]) })) || []);


		const benefitDetailsGMC = BenefitDetail(choosedBenefits, item, AddOnFlex, { no_of_parents: allRelations.filter(({ id }) => [5, 6].includes(+id))?.length || 0, no_of_parent_in_laws: allRelations.filter(({ id }) => [7, 8].includes(+id))?.length || 0 }, item.pro_rate_percentage_calculation);
		const benefitDetailsTopupGMC = choosedTopup.filter(elem => elem.suminsured && elem.topup_master_policy_id === item.policy_id)
			.map((itemTopup, index) => BenefitDetail(choosedTopupBenefits[index], itemTopup, AddOnFlex, { no_of_parents: allRelations.filter(({ id }) => [5, 6].includes(+id))?.length || 0, no_of_parent_in_laws: allRelations.filter(({ id }) => [7, 8].includes(+id))?.length || 0 }, itemTopup.pro_rate_percentage_calculation));
		const benefitDetailsParentGMC = choosedParent.filter(elem => elem.suminsured && elem.parent_base_policy_id === item.policy_id)
			.map((itemParent, index) => BenefitDetail(choosedParentBenefits[index], itemParent, AddOnFlex, { no_of_parents: allRelations.filter(({ id }) => [5, 6].includes(+id))?.length || 0, no_of_parent_in_laws: allRelations.filter(({ id }) => [7, 8].includes(+id))?.length || 0 }, itemParent.pro_rate_percentage_calculation));

		const tempDataFilter = tempData?.flex_details?.filter(({ plan_id, product_id, parent_product_id }) => {
			if (product_id === item.product_id) return false;
			if (parent_product_id === item.product_id) return false;
			if (!plan_id) return false;
			if (!reducerdetails.reduce((total, elem) => [...total, elem, ...(elem.topup_policies || []), ...(elem.parent_policies || [])], []).some(({ id }) => +id === +plan_id)) return false;
			return true
		})

		// setUseTempData(prev => {
		// 	let prevCopy = [...prev];
		// 	prevCopy[base_product_id - 1] = true
		// 	return prevCopy
		// })

		tempStorage(dispatch, {
			flex_details: [
				...(tempDataFilter || []),
				{
					plan_id: item.id,
					policy_id: item.policy_id,
					policy_suminsured: item.suminsured,
					policy_premium: (parentBenefitSelected ? NewBasePremium(item) : item.employee_premium) + item.employer_premium + Number(MemberFeature ? CalculatePR({ ...MemberFeature, premium_by: 1 }) : 0),
					employee_premium: (parentBenefitSelected ? NewBasePremium(item) : item.employee_premium) + Number((MemberFeature && (MemberFeature?.is_optional ? watch('member_feature')?.[MemberFeature.id] : true)) ? CalculatePR({ ...MemberFeature, premium_by: 1 }, 1, undefined, undefined, item.pro_rate_percentage_calculation) : 0),
					employer_premium: item.employer_premium,
					premium: item.premium,
					plan_name: item.plan_name,
					policy_name: item.policy_name,
					product_id: item.product_id,
					members: item.members,
					pro_rate_percentage_calculation: item.pro_rate_percentage_calculation,
					...item.no_of_times_salary?.length && { no_of_time_salary: item.no_of_times_salary[item.policy_suminsureds.indexOf(Number(item.suminsured))] },

					relations: allRelations.filter(({ id }) => (item.allowed_relations || []).some(({ relation_id }) => Number(id) === relation_id)).map(({ id }) => (item.allowed_relations || []).find(({ relation_id }) => Number(id) === relation_id)),
					member_feature: (MemberFeature?.is_optional ? watch('member_feature')?.[MemberFeature.id] : true) && { ...MemberFeature, premium: CalculatePR({ ...MemberFeature, premium_by: 1 }, 1, undefined, undefined, item.pro_rate_percentage_calculation) },

					allRelations: optionState.relation_ids,

					...benefitDetailsGMC,
					choosedBenefits,
					relation_wise: item.relation_wise,
					installments: giveInstalment(item)
				}, ...(choosedTopup.length ? choosedTopup.filter(elem => elem.suminsured && elem.topup_master_policy_id === item.policy_id).map((elem, index) => ({
					plan_id: elem.id,
					policy_id: elem.policy_id,
					policy_suminsured: elem.suminsured,
					policy_premium: elem.premium,
					employee_premium: elem.employee_premium,
					employer_premium: elem.employer_premium,
					premium: elem.premium,
					plan_name: elem.plan_name,
					policy_name: elem.policy_name,
					product_id: elem.product_id,
					parent_product_id: item.product_id,
					sum_with_base_policy: elem?.sum_with_base_policy,
					members: elem?.members || [],

					relations: allRelations.filter(({ id }) => (elem.relation_wise || []).some(({ relation_id }) => Number(id) === relation_id)).map(({ id }) => (elem.relation_wise || []).find(({ relation_id }) => Number(id) === relation_id)),

					...benefitDetailsTopupGMC[index],
					choosedBenefits: choosedTopupBenefits[index],
					relation_wise: elem.relation_wise,
					installments: giveInstalment(elem)
				})) : []),
				...(choosedParent.length ? choosedParent.filter(elem => elem.suminsured && elem.parent_base_policy_id === item.policy_id).map((elem, index) => ({
					plan_id: elem.id,
					policy_id: elem.policy_id,
					policy_suminsured: elem.suminsured,
					policy_premium: elem.premium,
					employee_premium: elem.employee_premium,
					employer_premium: elem.employer_premium,
					premium: elem.premium,
					plan_name: elem.plan_name,
					policy_name: elem.policy_name,
					product_id: elem.product_id,
					is_parent_plan: 1,
					parent_product_id: item.product_id,
					relation_wise: elem.relation_wise,
					members: elem?.members || [],

					relations: allRelations.filter(({ id }) => (elem.relation_wise || []).some(({ relation_id }) => Number(id) === relation_id)).map(({ id }) => (elem.relation_wise || []).find(({ relation_id }) => Number(id) === relation_id)),

					...benefitDetailsParentGMC[index],
					choosedBenefits: choosedParentBenefits[index],
					installments: giveInstalment(elem)
				})) : [])
			]
		}, !isLastPlan ? { setTab, nextTo } : {})

		procceed && setLgShow({ allRelations });
		setPremiumUpdated(1)
	}

	const removePolicyFromTemp = () => {
		const tempDataFilter = tempData?.flex_details?.filter(({ plan_id, product_id, parent_product_id }) => {
			if (product_id === details[0].product_id) return false;
			if (parent_product_id === details[0].product_id) return false;
			if (!plan_id) return false;
			if (!reducerdetails.some(({ id }) => +id === +plan_id)) return false;
			return true
		});

		if (!tempDataFilter.length)
			((hasOtherPlans && !isLastPlan) ? tempStorage(dispatch, { flex_details: [1] }, { setTab, nextTo }) : swal('No Plan Selected', '', 'info'))
		else {
			if (!(hasOtherPlans && !isLastPlan)) {
				setLgShow({ allRelations })
			}
			tempStorage(dispatch, { flex_details: tempDataFilter }, !isLastPlan ? { setTab, nextTo } : {});
		}
		setPremiumUpdated(1);
	}

	const MemberFeature = ExtractedDetail.member_feature_name?.length && ExtractedDetail.member_feature_name.find(({ relation_ids }) => !allRelations.some(({ id }) => relation_ids.map(Number).includes(id)))

	return (
		<>
			<Row style={{
				position: 'sticky',
				top: '0',
				zIndex: '1020',
				background: 'white',
			}} className="flex-nowrap align-items-center mt-5">
				<Col id='first-col' xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>
					<div style={{ textAlign: 'center' }}>
						<img src={getURL[type]} alt={type} style={{
							height: '250px',
							maxHeight: '250px'
						}} />
					</div>
				</Col>
				<Col xl={9} lg={8} md={12} sm={12} style={{ marginTop: '25px' }}>
					<Row className="flex-nowrap">
						{details.map((item) => <BaseFlexPlan
							setPremiumUpdated={setPremiumUpdated}
							isSinglePlan={isSinglePlan} premiumUpdated={premiumUpdated} setShow={setShow}
							MemberFeature={MemberFeature?.plan_id === item.id && MemberFeature}
							watchMemberFeature={watch('member_feature')?.[MemberFeature.id]}
							key={item.id + 'card'} dispatch={dispatch} reducerdetails={reducerdetails}
							item={item} selectedBenefit={selectedBenefit}
							selectedTopupBenefit={selectedTopupBenefit}
							selectedParentBenefit={selectedParentBenefit}
							AddOnFlex={AddOnFlex}
							globalTheme={globalTheme} allRelations={allRelations}
							choosedTopup={((choosedTopup.some(({ topup_master_policy_id }) => topup_master_policy_id === item.policy_id)) && (choosedTopup.filter(({ topup_master_policy_id }) => topup_master_policy_id === item.policy_id))) || []}
							choosedParent={((choosedParent.some(({ parent_base_policy_id }) => parent_base_policy_id === item.policy_id)) && (choosedParent.filter(({ parent_base_policy_id }) => parent_base_policy_id === item.policy_id))) || []}
							setOptionState={setOptionState} sumInsured={optionState.sum_insureds.find(({ flex_id }) => flex_id === item.id)?.sum_insured || 0}
						/>)}
					</Row>
				</Col>
			</Row >

			{/* Member Features */}
			{
				!!MemberFeature && <Row className="flex-nowrap align-items-center mt-4 mx-0">
					<Accordion defaultActiveKey={1} style={{
						width: '100%',
					}}>

						<Accordion.Toggle
							style={{
								width: sticky ? '100%' : planWidth + 90 + 'px',
								border: 'none',
								borderTopLeftRadius: '20px',
								borderTopRightRadius: '20px',
								background: globalTheme?.Tab?.color + '1f',
								padding: '10px 10px 10px 25px'

							}}
							eventKey={1} className='d-flex justify-content-between align-items-center'>
							<div style={{
								fontWeight: '500',
								fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
								letterSpacing: '1px',
								color: globalTheme?.Tab?.color,

							}}>{`Additional Feature`}</div>
							<ContextAwareToggle2 globalTheme={globalTheme} eventKey={1} />
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={1}>
							<>
								{[MemberFeature].map(({ description, premium_type, premium, is_optional, cover_type, cover, id }) =>
									<Row className="flex-nowrap" key={description + 'member_rela'}>
										<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>

											<Row className="d-flex" style={{
												flexDirection: 'column',
												fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
												fontWeight: '500',
												color: 'black',
												letterSpacing: '1px',
												paddingLeft: '40px'
											}}>
												<OptionInput width='auto' small single className="d-flex mt-6px" notAllowed={!is_optional ?? true}>
													<input
														name={`member_feature.${id}`}
														type={"checkbox"}
														ref={register}
														value={true}
														onClick={(e) => { setPremiumUpdated(prev => prev ? prev + 1 : prev); return e; }}
														disabled={!is_optional ?? true}
														defaultChecked={tempData.flex_details?.some(({ member_feature }) => member_feature?.id === id) || (!is_optional ?? true)} />
													<span style={{ top: '-7px' }}></span>
													<div className='label_name' style={{ marginTop: '-8px' }}>
														{description}

													</div>
												</OptionInput>
											</Row>
										</Col>
										<Col xl={9} lg={8} md={12} sm={12}>
											<Row className="flex-nowrap">
												{details.map((item, index) =>

													<FeatureDiv key={index + 'detail-0721'} className="my-auto" >
														<Row className="d-flex align-items-center" style={{
															flexDirection: 'column',
															fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
															fontWeight: '500',
															color: '#6e6e6e',
															letterSpacing: '0.8px'
														}}>
															{MemberFeature.plan_id === item.id ?
																<div className="_src_styles_module__cardPrice" style={{ background: globalTheme?.Tab?.color + '12', width: '100%' }}>
																	<div className="d-flex p-2 justify-content-center align-items-baseline" style={{ color: globalTheme?.Tab?.color }}>
																		<div className="_src_styles_module__bold">
																			{cover > 0 && <><small className="_src_styles_module__bold">{CoverType.find(({ id }) => +cover_type === id)?.name || ''} Sum Insured of {NumberInd(cover)}</small><br /></>}
																			<small className="_src_styles_module__bold">Flex {premium_type === 1 ? 'Credit' : 'Debit'} of {NumberInd(CalculatePR({ ...MemberFeature, premium_by: 1 }, 1, undefined, undefined, item.pro_rate_percentage_calculation))}</small>
																			<sub> (Incl GST)</sub>
																		</div>
																	</div>
																</div>
																: 'Not Covered'}
														</Row>
													</FeatureDiv>

												)}
											</Row>
										</Col>
									</Row>
								)}
							</>
						</Accordion.Collapse>
					</Accordion>
				</Row >
			}

			{/* coverage */}
			{
				!!ExtractedDetail.plan_benefits_name.length && <Row className="flex-nowrap align-items-center mt-4 mx-0">
					<Accordion defaultActiveKey={1} style={{
						width: '100%',
					}}>

						<Accordion.Toggle
							style={{
								width: sticky ? '100%' : planWidth + 90 + 'px',
								border: 'none',
								borderTopLeftRadius: '20px',
								borderTopRightRadius: '20px',
								background: globalTheme?.Tab?.color + '1f',
								padding: '10px 10px 10px 25px'

							}}
							eventKey={1} className='d-flex justify-content-between align-items-center'>
							<div style={{
								fontWeight: '500',
								fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
								letterSpacing: '1px',
								color: globalTheme?.Tab?.color,

							}}>{`Add on Coverages`}</div>
							<ContextAwareToggle2 globalTheme={globalTheme} eventKey={1} />
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={1}>
							<>
								{ExtractedDetail.plan_benefits_name.map(ben_name => {
									let benefit_name = ben_name;
									const parent_enhancement = ben_name.includes(': there is parent data here xoxo');
									const parentRelation = { no_of_parents: allRelations.filter(({ id, selected }) => [5, 6].includes(+id) && selected)?.length || 0, no_of_parent_in_laws: allRelations.filter(({ id, selected }) => [7, 8].includes(+id) && selected)?.length || 0 }
									if (parent_enhancement) {
										benefit_name = benefit_name.replace(': there is parent data here xoxo', '')
										if (!parentRelation.no_of_parents && !parentRelation.no_of_parent_in_laws && selectedBenefit?.[benefit_name]) {
											setValue(`benefits.${benefit_name}`, '');
											swal(`${benefit_name} Removed because no Parent or Parent In Law is added into policy`)
										}
									}

									const findDescription = details.map(({ plan_benefits }) => plan_benefits.find((elem) => elem.benefit_name === benefit_name)?.benefit_description || '')?.[0] || ''

									return (<Row className="flex-nowrap" key={ben_name + 'yes'}>
										<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>

											<Row className="d-flex" style={{
												flexDirection: 'column',
												fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
												fontWeight: '500',
												color: 'black',
												letterSpacing: '1px',
												paddingLeft: '40px'
											}}>
												<OptionInput width='auto' small single notAllowed={parent_enhancement} className="d-flex mt-6px">
													<input
														name={`benefits.${benefit_name}`}
														type={"checkbox"}
														ref={register}
														{...parent_enhancement && ((parentRelation.no_of_parents || parentRelation.no_of_parent_in_laws)) && { checked: true }}
														value={(parent_enhancement ? ((parentRelation.no_of_parents || parentRelation.no_of_parent_in_laws) && benefit_name) : benefit_name)}
														disabled={(parent_enhancement ? true : false)}
														defaultChecked={tempData?.flex_details?.some(({ benefits_features }) => benefits_features?.some(({ benefit_feature_name }) => {
															if (benefit_feature_name.includes(' : ')) {
																benefit_feature_name = benefit_feature_name.slice(0, benefit_feature_name.indexOf(' : '))
															}
															return benefit_feature_name === benefit_name
														})) || false} />
													<span style={{ top: '-7px' }}></span>
													<div className='label_name' style={{ marginTop: '-8px' }}>
														{benefit_name}
														{!!findDescription && <OverlayTrigger
															key={"home-india"}
															placement={"top"}
															overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{findDescription}</Tooltip>}>
															<svg
																className="icon icon-info cursor-help"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 35 35"
																fill="#8D9194">
																<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
																<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
																<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
															</svg>
														</OverlayTrigger>}
													</div>
												</OptionInput>
											</Row>
										</Col>
										<Col xl={9} lg={8} md={12} sm={12}>
											<Row className="flex-nowrap">
												{details.map(item => <AddOnFlexPlan
													isSinglePlan={isSinglePlan}
													setPremiumUpdated={setPremiumUpdated}
													oldBenefits={oldBenefits}
													selectedBenefit={selectedBenefit} allRelations={parentRelation} parent_enhancement={parent_enhancement} key={item.id + 'desc1' + benefit_name} setValue={setValue}
													item={item} ben_name={benefit_name} globalTheme={globalTheme} register={register} tempData={tempData} />)}
											</Row>
										</Col>
									</Row>)
								}
								)}
							</>
						</Accordion.Collapse>
					</Accordion>
				</Row>
			}

			{/* Parent */}
			{
				!!parent_detail?.length &&
				<Row className="flex-nowrap align-items-center mt-4 mx-0">
					<Accordion defaultActiveKey={1} style={{
						width: '100%',
					}}>
						<Accordion.Toggle
							style={{
								width: sticky ? '100%' : planWidth + 90 + 'px',
								border: 'none',
								borderTopLeftRadius: '20px',
								borderTopRightRadius: '20px',
								background: globalTheme?.Tab?.color + '1f',
								padding: '10px 10px 10px 25px'

							}}
							eventKey={1} className='d-flex justify-content-between align-items-center'>
							<div style={{
								fontWeight: '500',
								fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
								letterSpacing: '1px',
								color: globalTheme?.Tab?.color,

							}}>{(parent_detail?.length === 1) ? parent_detail[0].plan_name : `Parent Plan`}</div>
							<ContextAwareToggle2 globalTheme={globalTheme} eventKey={1} />
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={1}>
							<>
								{parent_detail.map((elem) =>
									<>
										<Row className="flex-nowrap" key={elem.policy_name + 'yes'}>
											<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>
												<Row className="d-flex" style={{
													flexDirection: 'column',
													fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
													fontWeight: '500',
													color: 'black',
													letterSpacing: '1px',
													paddingLeft: '40px'
												}}>
													<OptionInput width='auto' small single className="d-flex mt-6px">
														<input
															name={'parent'}
															type={parent_detail.some(({ top_up_policy_ids }) => top_up_policy_ids?.length) ? "radio" : 'checkbox'}
															ref={register}
															value={elem.id}
															checked={optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && sum_insured && !isString(sum_insured))}
															onClick={() => {
																if (optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && (!sum_insured || isString(sum_insured)))) {
																	setShow(true)
																	return ''
																}
																setOptionState(prev => ({
																	...prev,
																	sum_insureds: prev.sum_insureds.map(elem1 => ({
																		...elem1,
																		...elem1.flex_id === elem.id && { sum_insured: 'Select Sum Insured' }
																	})),
																	// step: prev.step + 1
																}))
																return (Number(selectedParent) === elem.id) ? setValue('parent', '') : ''
															}}
														/* defaultChecked={true} */
														/>
														<span style={{ top: '-7px' }}></span>
														<div className='label_name' style={{ marginTop: '-8px' }}>
															{elem.plan_name}
															{!!elem.plan_description && <OverlayTrigger
																key={"home-india"}
																placement={"top"}
																overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{elem.plan_description}</Tooltip>}>
																<svg
																	className="icon icon-info cursor-help"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 35 35"
																	fill="#8D9194">
																	<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
																	<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
																	<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
																</svg>
															</OverlayTrigger>}
														</div>
													</OptionInput>
												</Row>


											</Col>
											<Col xl={9} lg={8} md={12} sm={12}>
												<Row className="flex-nowrap">
													{details.map(item =>
														<TopupFlexPlan
															key={item.id + 'desc3' + elem.policy_name}
															item={item.parent_policies.find(({ secret_uuid }) => elem.secret_uuid === secret_uuid)}
															setShow={setShow}
															shouldShowPlan={item.parent_policies.some(({ secret_uuid }) => elem.secret_uuid === secret_uuid) && optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && sum_insured && !isString(sum_insured))}
															// parent_detail={parent_detail} 
															globalTheme={globalTheme}
															// optionState={optionState} dispatch={dispatch}
															// allRelations={allRelations} reducerdetails={reducerdetails}
															policyRelations={allRelations.filter(({ id }) => (elem.relation_wise || []).some(({ relation_id }) => Number(id) === relation_id)).map(({ id }) => (elem.relation_wise || []).find(({ relation_id }) => Number(id) === relation_id))}
														/>
													)}
												</Row>
											</Col>
										</Row>
										{/* Parent addons */}
										{optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && sum_insured && !isString(sum_insured)) &&
											elem.plan_benefits.map(({ benefit_name, benefit_description }, index) => {

												const mandatoryBenefitIsThere = elem.plan_benefits.some(({ mandatory_if_not_selected_benefit_ids }) => mandatory_if_not_selected_benefit_ids);

												return (<Row className="flex-nowrap" key={benefit_name + 'yes'}>
													<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>

														<Row className="d-flex" style={{
															flexDirection: 'column',
															fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
															fontWeight: '500',
															color: 'black',
															letterSpacing: '1px',
															paddingLeft: '40px'
														}}>
															<OptionInput style={{ marginLeft: '60px' }} width='auto' small single className="d-flex mt-6px">
																<input
																	type={mandatoryBenefitIsThere ? "radio" : 'checkbox'}
																	value={benefit_name}
																	name={`benefitsParent.${mandatoryBenefitIsThere ? elem.id : benefit_name}`}
																	ref={register}
																	defaultChecked={tempData?.flex_details?.some(({ benefits_features }) => benefits_features?.some(({ benefit_feature_name }) => {
																		if (benefit_feature_name?.includes(' : ')) {
																			benefit_feature_name = benefit_feature_name.slice(0, benefit_feature_name.indexOf(' : '))
																		}
																		return benefit_feature_name === benefit_name
																	})) || (mandatoryBenefitIsThere && index === 0) || false} />
																<span style={{ top: '-7px' }}></span>
																<div className='label_name' style={{ marginTop: '-8px' }}>
																	{benefit_name}
																	{!!benefit_description && <OverlayTrigger
																		key={"home-india"}
																		placement={"top"}
																		overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{benefit_description}</Tooltip>}>
																		<svg
																			className="icon icon-info cursor-help"
																			xmlns="http://www.w3.org/2000/svg"
																			viewBox="0 0 35 35"
																			fill="#8D9194">
																			<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
																			<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
																			<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
																		</svg>
																	</OverlayTrigger>}
																</div>
															</OptionInput>
														</Row>
													</Col>
													<Col xl={9} lg={8} md={12} sm={12}>
														<Row className="flex-nowrap">
															{details.map(item => <AddOnFlexPlan
																isSinglePlan={isSinglePlan}
																setPremiumUpdated={setPremiumUpdated}
																oldBenefits={oldBenefits}
																checkById={mandatoryBenefitIsThere && elem.id}
																selectedBenefit={selectedParentBenefit} key={item.id + 'desc1' + benefit_name} setValue={setValue}
																item={item.parent_policies.find(({ secret_uuid }) => elem.secret_uuid === secret_uuid)} ben_name={benefit_name} globalTheme={globalTheme} register={register} tempData={tempData} />)}
														</Row>
													</Col>
												</Row>)
											})}
									</>
								)}
							</>
						</Accordion.Collapse>
					</Accordion>
				</Row>
			}

			{/* Topup */}
			{
				!!topup_detail?.length &&
				<Row className="flex-nowrap align-items-center mt-4 mx-0">
					<Accordion defaultActiveKey={1} style={{
						width: '100%',
					}}>
						<Accordion.Toggle
							style={{
								width: sticky ? '100%' : planWidth + 90 + 'px',
								border: 'none',
								borderTopLeftRadius: '20px',
								borderTopRightRadius: '20px',
								background: globalTheme?.Tab?.color + '1f',
								padding: '10px 10px 10px 25px'

							}}
							eventKey={1} className='d-flex justify-content-between align-items-center'>
							<div style={{
								fontWeight: '500',
								fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
								letterSpacing: '1px',
								color: globalTheme?.Tab?.color,

							}}>{(topup_detail?.length === 1) ? topup_detail[0].plan_name : `Top Up`}</div>
							<ContextAwareToggle2 globalTheme={globalTheme} eventKey={1} />
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={1}>
							<>
								{topup_detail.map((elem) =>
									<>
										<Row className="flex-nowrap" key={elem.policy_name + 'yes'}>
											<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>
												<Row className="d-flex" style={{
													flexDirection: 'column',
													fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
													fontWeight: '500',
													color: 'black',
													letterSpacing: '1px',
													paddingLeft: '40px'
												}}>
													<OptionInput width='auto' small single className="d-flex mt-6px">
														<input
															name={'topup'}
															type={topup_detail.some(({ top_up_policy_ids }) => top_up_policy_ids?.length) ? "radio" : 'checkbox'}
															ref={register}
															value={elem.id}
															checked={optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && sum_insured && !isString(sum_insured))}
															onClick={() => {
																if (optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && (!sum_insured || isString(sum_insured)))) {
																	setShow(true)
																	return ''
																}
																setOptionState(prev => ({
																	...prev,
																	sum_insureds: prev.sum_insureds.map(elem1 => ({
																		...elem1,
																		...elem1.flex_id === elem.id && { sum_insured: 'Select Sum Insured' }
																	})),
																	// step: prev.step + 1
																}))
																return (Number(selectedTopup) === elem.id) ? setValue('topup', '') : ''
															}}
														/* defaultChecked={true} */
														/>
														<span style={{ top: '-7px' }}></span>
														<div className='label_name' style={{ marginTop: '-8px' }}>
															{elem.plan_name}
															{!!elem.plan_description && <OverlayTrigger
																key={"home-india"}
																placement={"top"}
																overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{elem.plan_description}</Tooltip>}>
																<svg
																	className="icon icon-info cursor-help"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 35 35"
																	fill="#8D9194">
																	<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
																	<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
																	<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
																</svg>
															</OverlayTrigger>}
														</div>
													</OptionInput>
												</Row>


											</Col>
											<Col xl={9} lg={8} md={12} sm={12}>
												<Row className="flex-nowrap">
													{details.map(item =>
														<TopupFlexPlan
															key={item.id + 'desc3' + elem.policy_name}
															item={item.topup_policies.find(({ secret_uuid }) => elem.secret_uuid === secret_uuid)}
															setShow={setShow}
															shouldShowPlan={item.topup_policies.some(({ secret_uuid }) => elem.secret_uuid === secret_uuid) && optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && sum_insured && !isString(sum_insured))}
															// topup_detail={topup_detail} 
															globalTheme={globalTheme}
															// optionState={optionState} dispatch={dispatch}
															// allRelations={allRelations} reducerdetails={reducerdetails}
															policyRelations={allRelations.filter(({ id }) => (elem.relation_wise || []).some(({ relation_id }) => Number(id) === relation_id)).map(({ id }) => (elem.relation_wise || []).find(({ relation_id }) => Number(id) === relation_id))}
														/>
													)}
												</Row>
											</Col>
										</Row>
										{/* topup addons */}
										{optionState.sum_insureds.some(({ sum_insured, flex_id }) => flex_id === elem.id && sum_insured && !isString(sum_insured)) &&
											elem.plan_benefits.map(({ benefit_name, benefit_description }, index) => {

												const mandatoryBenefitIsThere = elem.plan_benefits.some(({ mandatory_if_not_selected_benefit_ids }) => mandatory_if_not_selected_benefit_ids);

												return (<Row className="flex-nowrap" key={benefit_name + 'yes'}>
													<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>

														<Row className="d-flex" style={{
															flexDirection: 'column',
															fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
															fontWeight: '500',
															color: 'black',
															letterSpacing: '1px',
															paddingLeft: '40px'
														}}>
															<OptionInput style={{ marginLeft: '60px' }} width='auto' small single className="d-flex mt-6px">
																<input
																	// name={`benefitsTopup.${benefit_name}`}
																	// type={"checkbox"}
																	type={mandatoryBenefitIsThere ? "radio" : 'checkbox'}
																	value={benefit_name}
																	name={`benefitsTopup.${mandatoryBenefitIsThere ? elem.id : benefit_name}`}
																	ref={register}
																	defaultChecked={tempData?.flex_details?.some(({ benefits_features }) => benefits_features?.some(({ benefit_feature_name }) => {
																		if (benefit_feature_name?.includes(' : ')) {
																			benefit_feature_name = benefit_feature_name.slice(0, benefit_feature_name.indexOf(' : '))
																		}
																		return benefit_feature_name === benefit_name
																	})) || (mandatoryBenefitIsThere && index === 0) || false} />
																<span style={{ top: '-7px' }}></span>
																<div className='label_name' style={{ marginTop: '-8px' }}>
																	{benefit_name}
																	{!!benefit_description && <OverlayTrigger
																		key={"home-india"}
																		placement={"top"}
																		overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{benefit_description}</Tooltip>}>
																		<svg
																			className="icon icon-info cursor-help"
																			xmlns="http://www.w3.org/2000/svg"
																			viewBox="0 0 35 35"
																			fill="#8D9194">
																			<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
																			<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
																			<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
																		</svg>
																	</OverlayTrigger>}
																</div>
															</OptionInput>
														</Row>
													</Col>
													<Col xl={9} lg={8} md={12} sm={12}>
														<Row className="flex-nowrap">
															{details.map(item => <AddOnFlexPlan
																isSinglePlan={isSinglePlan}
																setPremiumUpdated={setPremiumUpdated}
																oldBenefits={oldBenefits}
																checkById={mandatoryBenefitIsThere && elem.id}
																selectedBenefit={selectedTopupBenefit} key={item.id + 'desc1' + benefit_name} setValue={setValue}
																item={item.topup_policies.find(({ secret_uuid }) => elem.secret_uuid === secret_uuid)} ben_name={benefit_name} globalTheme={globalTheme} register={register} tempData={tempData} />)}
														</Row>
													</Col>
												</Row>)
											})}
									</>
								)}
							</>
						</Accordion.Collapse>
					</Accordion>
				</Row>
			}

			{/* Product Feature */}
			{
				!!ExtractedDetail.product_fetaure_name.length && <Row className="flex-nowrap align-items-center mt-4 mx-0">
					<Accordion
						defaultActiveKey={(!MemberFeature && !ExtractedDetail.plan_benefits_name.length &&
							!topup_detail?.some(({ topup_master_policy_id }) => details?.some(({ policy_id }) => policy_id === topup_master_policy_id)) &&
							!parent_detail?.some(({ parent_base_policy_id }) => details?.some(({ policy_id }) => policy_id === parent_base_policy_id))) ? 1 : 0}
						style={{
							width: '100%',
						}}>

						<Accordion.Toggle
							style={{
								width: sticky ? '100%' : planWidth + 90 + 'px',
								border: 'none',
								borderTopLeftRadius: '20px',
								borderTopRightRadius: '20px',
								background: globalTheme?.Tab?.color + '1f',
								padding: '10px 10px 10px 25px'

							}}
							eventKey={1} className='d-flex justify-content-between align-items-center'>
							<div style={{
								fontWeight: '500',
								fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
								letterSpacing: '1px',
								color: globalTheme?.Tab?.color,

							}}>{`Product Feature`}</div>
							<ContextAwareToggle2 globalTheme={globalTheme} eventKey={1} />
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={1}>
							<>
								{ExtractedDetail.product_fetaure_name.map(feat_name =>

									<Row className="flex-nowrap" key={feat_name + 'ben'}>
										<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>
											<Row className="d-flex" style={{
												flexDirection: 'column',
												fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
												fontWeight: '500',
												color: 'black',
												letterSpacing: '1px',
												paddingLeft: '40px'
											}}>
												<div>{feat_name}</div>
											</Row>
										</Col>
										<Col xl={9} lg={8} md={12} sm={12}>
											<Row className="flex-nowrap">
												{details.map(item => {
													const NoOfTimeSalary = item?.no_of_times_salary?.length ? item?.no_of_times_salary[item?.policy_suminsureds?.findIndex(si => +si === +item.suminsured)] : false
													const thisPlanBenefits = (!!item.allPolicyFeatures?.length &&
														FilterPolicyFeature(item.allPolicyFeatures, { policy_suminsured: item.suminsured, policy_no_of_times_of_salary: NoOfTimeSalary, employeee_grade: currentUser.employeee_grade })) || [];

													return <FeatureDiv className="my-auto" key={item.id + 'desc' + feat_name}>
														<Row className="d-flex align-items-center" style={{
															flexDirection: 'column',
															fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
															fontWeight: '500',
															color: '#6e6e6e',
															letterSpacing: '1px'
														}}>
															<div>{thisPlanBenefits.find(({ title }) => title === feat_name)?.content || 'Not Covered'}</div>
														</Row>
													</FeatureDiv>
												})}
											</Row>
										</Col>
									</Row>
								)}
							</>
						</Accordion.Collapse>
					</Accordion>

				</Row>
			}

			{/* whats not covered */}
			{
				!!ExtractedDetail.uncovered_benefits_name.length && <Row className="flex-nowrap align-items-center mt-4 mx-0">
					<Accordion defaultActiveKey={1} style={{
						width: '100%',
					}}>

						<Accordion.Toggle
							style={{
								width: sticky ? '100%' : planWidth + 90 + 'px',
								border: 'none',
								borderTopLeftRadius: '20px',
								borderTopRightRadius: '20px',
								background: globalTheme?.Tab?.color + '1f',
								padding: '10px 10px 10px 25px'

							}}
							eventKey={1} className='d-flex justify-content-between align-items-center'>
							<div style={{
								fontWeight: '500',
								fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
								letterSpacing: '1px',
								color: globalTheme?.Tab?.color,

							}}>{`What's not covered`}</div>
							<ContextAwareToggle2 globalTheme={globalTheme} eventKey={1} />
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={1}>
							<>
								{ExtractedDetail.uncovered_benefits_name.map(ben_name =>

									<Row className="flex-nowrap" key={ben_name + 'no'}>
										<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>
											<Row className="d-flex" style={{
												flexDirection: 'column',
												fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
												fontWeight: '500',
												color: 'black',
												letterSpacing: '1px',
												paddingLeft: '40px'
											}}>
												<div>{ben_name}</div>
											</Row>
										</Col>
										<Col xl={9} lg={8} md={12} sm={12}>
											<Row className="flex-nowrap">
												{details.map(item =>
													<FeatureDiv className="my-auto" key={item.id + 'desc2' + ben_name}>
														<Row className="d-flex align-items-center" style={{
															flexDirection: 'column',
															fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
															fontWeight: '500',
															color: '#6e6e6e',
															letterSpacing: '1px'
														}}>
															<div>{item.uncovered_benefits.find(({ benefit_name }) => benefit_name === ben_name)?.benefit_description || '-'}</div>

														</Row>
													</FeatureDiv>
												)}
											</Row>
										</Col>
									</Row>
								)}
							</>
						</Accordion.Collapse>
					</Accordion>
				</Row>
			}

			{/* button */}
			<Row className="flex-nowrap align-items-center mt-4 mx-0">
				<Accordion defaultActiveKey={1} style={{
					width: '100%',
				}}>

					<Accordion.Toggle
						eventKey={1} className='d-none'>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey={1}>

						<Row className="flex-nowrap">
							<Col className="d-flex align-items-center" xl={3} lg={4} md={6} sm={8} style={{ minWidth: "150px", maxWidth: '400px' }}>
								<Row className="d-flex" style={{
									flexDirection: 'column',
									fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
									fontWeight: '500',
									color: 'black',
									letterSpacing: '1px',
									paddingLeft: '40px'
								}}>
									<div></div>
								</Row>
							</Col>
							<Col xl={9} lg={8} md={12} sm={12}>
								<Row className="flex-nowrap">

									{details.map(item =>
										<FeatureDiv className="my-auto" key={item.id + 'proceed'}>
											<Row className="d-flex align-items-center" style={{
												flexDirection: 'column',
												fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
												fontWeight: '500',
												color: '#6e6e6e',
												letterSpacing: '1px'
											}}>
												{(hasOtherPlans && !isLastPlan) ?
													<RFQButton variant={tempData.flex_details?.some(({ plan_id }) => plan_id === item.id) ? 'theme' : "default"} fontSize="16px" height="50px" onClick={() => onSubmit(item)}>
														{tempData.flex_details?.some(({ plan_id }) => plan_id === item.id) ? 'Selected' : 'Select'}
														{/* <i className="fa fa-check" aria-hidden="true" /> */}
													</RFQButton>
													:
													<RFQButton variant="theme" fontSize="16px" height="50px" onClick={() => onSubmit(item, true)}>
														Proceed
														<i className="fa fa-long-arrow-right" aria-hidden="true" />
													</RFQButton>
												}
												{isSinglePlan && !details[0]?.has_been_endrosed && !details[0]?.members.length && <Row className="justify-content-between">
													<AnchorTag2 fontSizeCustom={'14px'} className="p-0 m-0" onClick={removePolicyFromTemp}>
														<label>{'SKIP >'}</label>
													</AnchorTag2>
												</Row>}
											</Row>
										</FeatureDiv>
									)}
								</Row>
							</Col>
						</Row>
					</Accordion.Collapse>
				</Accordion >

			</Row >

			<FamilyMemberModal
				setOptionState={setOptionState}
				isSinglePlan={isSinglePlan}
				employeePolicies={employeePolicies}
				optionState={optionState}
				setPremiumUpdated={setPremiumUpdated}
				details={details || []}
				topup_detail={topup_detail}
				parent_detail={parent_detail}
				globalTheme={globalTheme}
				lgShow={show} onHide={() => setShow(false)} />


			{
				lgShow && (
					ModuleControl.NewFlexProceedDesign ?
						<FlexSummaryModal
							title={title}
							allRelations={allRelations}
							AddOnFlex={AddOnFlex}
							selectedBenefit={selectedBenefit}
							choosedTopup={choosedTopup}
							choosedParent={choosedParent}
							globalTheme={globalTheme}
							policyDetails={tempData.flex_details}
							reducerdetails={reducerdetails}
							tempData={tempData}
							dispatch={dispatch} lgShow={lgShow} onHide={() => setLgShow(false)} /> :
						<FlexModal
							title={title}
							allRelations={allRelations}
							AddOnFlex={AddOnFlex}
							selectedBenefit={selectedBenefit}
							choosedTopup={choosedTopup}
							choosedParent={choosedParent}
							globalTheme={globalTheme}
							policyDetails={tempData.flex_details}
							reducerdetails={reducerdetails}
							tempData={tempData}
							dispatch={dispatch} lgShow={lgShow} onHide={() => setLgShow(false)} />)
			}
		</>
	)
}

export default FlexPlan;

const ExtractData = (details, tempData) => {
	const plan_benefits_name = details.reduce((benefits, { plan_benefits }) =>
		[...benefits, ...plan_benefits?.reduce((names, { benefit_name, benefit_feature_details }) => [...names, benefit_name + ((benefit_feature_details.some(({ has_capping_data }) => has_capping_data)) ? (': there is parent data here xoxo') : '')], []) || []],
		[])
	const uncovered_benefits_name = details.reduce((benefits, { uncovered_benefits }) =>
		[...benefits, ...uncovered_benefits?.reduce((names, { benefit_name }) => [...names, benefit_name], []) || []],
		[])
	const product_fetaure_name = details.reduce((benefits, { allPolicyFeatures }) =>
		[...benefits, ...allPolicyFeatures?.reduce((names, { title }) => [...names, title], []) || []],
		[])

	const member_feature_name = details.reduce((benefits, { relation_wise_calculation, id }) =>
		[...benefits, ...relation_wise_calculation?.reduce((names, elem) => [...names, { ...elem, plan_id: id }], []) || []],
		[])

	const GMCData = tempData?.flex_details?.find(({ product_id, is_parent_policy }) => 1 === product_id && !is_parent_policy)
	return ({
		plan_benefits_name: [...new Set(plan_benefits_name)],
		uncovered_benefits_name: [...new Set(uncovered_benefits_name)],
		product_fetaure_name: [...new Set(product_fetaure_name)],
		member_feature_name: member_feature_name
			.filter(({ cover, relation_ids }) => cover > 0 ?
				relation_ids.every(id => GMCData?.relations?.some(({ relation_id }) => +relation_id === +id)) : true),
		// [
		// 	{ title: 'No Dependents Enrolled', premium_type: 1, relations: [2, 3, 4, 5, 6, 7, 8], premium: 4000 },
		// 	{ title: 'No Parent Enrolled', premium_type: 1, relations: [5, 6, 7, 8], premium: 2500 }
		// ],
		details
	})
}

export const GetSumInsuredType = {
	1: 'Including', // Including
	2: 'Additional', // Additional
	3: '' // No Cover
}

export const GetPremiumType = {
	1: 'Discount',//Discount
	2: 'To Pay',//Loading
	3: ''// No Premium
}
export const BenefitText = (benefit_feature_details = {}, premium, globalTheme, benefit_name, suminsured) => {
	/* 
cover_by      1: value 2: % 
cover_type    1: inc   2: add    3: no cover

premium_by    1: value 2: % 
premium_type  1: disc  2: load   3: no prem
*/

	const SI = CalculateSI(benefit_feature_details, suminsured);

	return (<>

		<span style={{ color: globalTheme ? '#000' : '#fff', cursor: 'pointer' }}>

			{!SI && !!benefit_feature_details.SIText && (`${GetSumInsuredType[benefit_feature_details.cover_type]} ${CustomNames.includes(benefit_name?.toLowerCase()) ? benefit_name : 'Sum Insured'} ₹${NumberInd(benefit_feature_details.SIText) || 0}`)}
			{!!SI && (`${GetSumInsuredType[benefit_feature_details.has_capping_data ? 1 : benefit_feature_details.cover_type]} ${CustomNames.includes(benefit_name?.toLowerCase()) ? benefit_name : 'Sum Insured'} ₹${NumberInd(SI) || 0}`)}
			{!!(((!SI && !!benefit_feature_details.SIText) || SI) && premium) && <br />}
			{!!premium && <span style={{ color: globalTheme?.Tab?.color, cursor: 'pointer' }}>
				{`Annual ${premium < 0 ? 'Amount' : 'Premium'} ₹${NumberInd(Math.abs(premium)) || 0} ${premium < 0 ? '(Credit)' : ''}`}
			</span>}

		</span>

	</>)
}

export const FeatureDiv = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
height: 100%;
padding: 10px 20px;
margin:0px 20px;
max-width: min-content;
position: relative;
text-align: center;
min-width: 280px;
`

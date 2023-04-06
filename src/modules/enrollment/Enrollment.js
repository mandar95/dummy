import React, { useEffect, useState } from "react";
import styled from "styled-components";
import swal from "@sweetalert/with-react";
import _ from 'lodash';

import { useHistory, useLocation } from "react-router-dom";
import { Button, Loader } from "components";
import { Rows } from "./style";
import { Col } from "react-bootstrap";
import { PolicyId } from "./models/PolicyId";
import Prototype from "modules/announcements/prototype.js";

import {
	editUser,
	enrollConfirmation,
	loadSummary,
	enrollment,
	validateFlexAmtAll,
	loadConfirmtion, //step 5
	clearView,
	isTopupThere, loadAllSummary, isNomineeThere,
	salary_deduction,
	have_flex_policy,
	loadAllNomineeSummary,
	// loadDeclaration
} from "./enrollment.slice";
import { loadRelationMaster } from "modules/policies/policy-config.slice";
import { useDispatch, useSelector } from "react-redux";

import { getFlexPolicy } from "../flexbenefit/flexbenefit.slice";
import CustomizedSteppers from "./stepper";


export const Enrollment = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const _policyId = query.get("policy_id");
	const _plan_id = query.get("plan_id");
	const { summary, loading, policies, topup, flex_plan_data,
		flex, nominee_present, flex_balance } = useSelector(enrollment);
	const { FlexPolicies } = useSelector((state) => state.flexbenefit);
	const { currentUser } = useSelector((state) => state.login);
	const [modal, setModal] = useState(true);
	const [pId, setPId] = useState("");
	const [policyId, setPolicyId] = useState("");
	const [policyIds, setPolicyIds] = useState([]);
	const flexPolicy = FlexPolicies?.find((elem) => elem.id === Number(policyId))
	const policy = _policyId ? { ...flexPolicy, name: flexPolicy?.policy_name }
		: policies.find((elem) => elem.id === Number(policyId));

	useEffect(() => {
		if (_policyId)
			dispatch(getFlexPolicy())

		return (() => {
			salary_deduction(0)
			dispatch(have_flex_policy(false));
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (_policyId && FlexPolicies.length > 0) {
			setPolicyId(_policyId);
			setModal(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_policyId, FlexPolicies])

	useEffect(() => {
		if ((Number(policyId) || policyIds.length) && currentUser.id) {
			if (!_policyId && !policyIds.length) {
				dispatch(loadSummary(policyId));
			}
			dispatch(loadRelationMaster());

			// topup exist ?
			dispatch(isTopupThere(policyIds))
			dispatch(validateFlexAmtAll({ policy_ids: policyIds.map(({ id }) => id) }))

			// nominee exist ?
			dispatch(isNomineeThere(policyIds, currentUser.employer_id))

			// all summary
			dispatch(loadAllSummary(policyIds));
			dispatch(loadAllNomineeSummary(policyIds));

			// step 5
			dispatch(loadConfirmtion())
			// dispatch(loadDeclaration({
			// 	master_system_trigger_id: 25,
			// 	employer_id: currentUser.employer_id,
			// 	broker_id: currentUser.broker_id,
			// 	policy_id: pId
			// }))
		}
		return () => { dispatch(clearView()) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyId, _policyId, currentUser, policyIds]);

	useEffect(() => {
		if (_plan_id && (!flex_plan_data.totalSumInsured && !flex_plan_data.totalPremium)) {
			history.replace('flex-benefits')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (modal === false && (!policyId && !policyIds.length)) {
			history.replace("/home");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modal]);

	const top_present = !!topup.length;

	let summaryTitle = [];
	(() => {
		if (_.isPlainObject(summary))
			for (const key in summary) {
				summaryTitle.push(key);
			}
	})();

	const onSave = ({ data, formId }) => {
		if (formId === "personal-details-form" || formId === "step0") {
			dispatch(editUser({ ...data, user_type_name: 'Employee' }));
			return null;
		}
		if (formId === "confirmation" && policyId && data?.confirm) {
			dispatch(
				enrollConfirmation({
					policy_id: policyId,
					confirmation_flag: data.confirm,
					employer_has_flex_policies: flex?.employer_has_flex_policies
				})
			);
			return null;
		}

	};

	const selectPolicy = (id, is_topup_enrolment) => {

		const { policy_sub_type_id: selected_policy_sub_type_id } = policies.find(({ id: policy_id, topup_enrolment }) => policy_id === id && (is_topup_enrolment ? topup_enrolment : true));

		const filteredPolicy = policies
			.filter(({ enrollement_status, policy_sub_type_id, topup_enrolment }) =>
				policy_sub_type_id === selected_policy_sub_type_id && (policy_sub_type_id <= 3 || topup_enrolment) &&
				(enrollement_status === 1 || topup_enrolment))
			.map(({ id, enrollement_start_date, enrollement_end_date, policy_name,
				topup_enrolment,
				enrollement_confirmed, enrollement_status }) => {
				if (enrollement_status === 1 && !topup_enrolment) {
					return ({
						id,
						enrollement_confirmed,
						enrollement_status,
						enrollement_start_date, enrollement_end_date, policy_name,
						baseEnrolmentStatus: true
					})
				}
				if (topup_enrolment) {
					return ({
						id,
						enrollement_confirmed,
						enrollement_status,
						enrollement_start_date, enrollement_end_date, policy_name,
						baseEnrolmentStatus: false
					})
				}
				return ({
					id,
					enrollement_confirmed,
					enrollement_status,
					enrollement_start_date, enrollement_end_date, policy_name,
					baseEnrolmentStatus: true
				})
			}
			);

		const uniquePolciies = [];
		filteredPolicy.forEach(elem => !uniquePolciies.some(item => item.id === elem.id) && uniquePolciies.push(elem));

		setPolicyIds(uniquePolciies)

		swal(<div className='d-flex flex-wrap'>
			{uniquePolciies.map(({ enrollement_start_date, enrollement_end_date, policy_name, id }) =>
				<p key={id + '_swal'}>{policy_name} : Enrolment window is open from <span className="text-nowrap">{enrollement_start_date}</span> till <span className="text-nowrap">{enrollement_end_date}</span> </p>)}
		</div>)
	};

	const _renderPolicyConfig = () => {
		return (
			<>
				{location.pathname.includes('enrollment-view') && <Prototype
					position='Top'
					url={['', 'employee', 'policy-flexible-benefits']}
				/>}
				<Rows modal={modal ? 1 : undefined} className={'d-flex flex-wrap w-100'}>
					{modal ? (
						<PolicyId
							loading={loading}
							show={modal}
							onHide={() => setModal(false)}
							policyId={selectPolicy}
							setPolicyId={setPolicyId}
							setPId={setPId}
						/>
					) : (
						<>
							{!_policyId &&
								<Col
									md={12}
									lg={12}
									xl={12}
									sm={12}
								>
									<ButtonTag
										buttonStyle="outline-secondary"
										type="button"
										onClick={() => setModal(true)}
										hex1="#20d2a3"
										hex2="#20d2a3"
									>
										<span
											style={{ fontWeight: "600", whiteSpace: "nowrap" }}
										>{`< Back To List View`}</span>
									</ButtonTag>
								</Col>
							}

							<Col md={12} lg={12} xl={12} sm={12}>
								<CustomizedSteppers
									data={{
										policy_ids: policyIds,
										policy_name: policy?.name || "",
										employer_has_flex_policies: flex?.employer_has_flex_policies,
										policyIds: policyIds,
										flex_balance

									}}
									onSave={onSave}
									top_present={top_present}
									summary={summary}
									nominee_present={nominee_present}
									policy_ids={policyIds}
									pId={pId}
									selectPolicy={selectPolicy}
								/>
							</Col>
						</>
					)}
				</Rows>
				{loading && <Loader />}
				{location.pathname.includes('enrollment-view') && <Prototype
					position='Bottom'
					url={['', 'employee', 'policy-flexible-benefits']}
				/>}
			</>
		);
	};

	return _renderPolicyConfig();
};

const ButtonTag = styled(Button)`
	margin: 20px 30px;
	@media (max-width: 767px) {
	  margin: 15px 10px;
	}
`;

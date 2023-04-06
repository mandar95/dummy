import React, { useEffect, useState } from "react";
import { Card, Button } from "components";
import Dependancy from "./dependancy";
import Nominee from "./nominee";
import Topup from './topup';
import { useSelector, useDispatch } from "react-redux";
import {
	clear, loadFlex, loadMember, loadNominees,
	loadTopup, loadRelations, clearView, loadNomineeDeclarationFormHandler
} from "../enrollment.slice";
import swal from "sweetalert";
import { useParams } from "react-router";
import { Decrypt } from "../../../utils";
import { EditMember } from "../Steps/Dependency/EditMember";
import { Loader } from "../../../components";
import { Cols } from "../style";
import { getPolicyCoverage } from "../NewDesignComponents/enrolment.action";
import { ModuleControl } from "../../../config/module-control";
import { DeclarationButton } from "../NewDesignComponents/ThirdStep";

const View = () => {

	const { id } = useParams();
	const policy_id = Decrypt(id)

	const dispatch = useDispatch();
	const { currentUser } = useSelector(state => state.login);
	let { error, topup, member_option, nominees, relations, flex, loading, success, viewLoading } = useSelector((state) => state.enrollment);
	const [editModal, setEditModal] = useState(false);

	const [policyNotCoverages, setNotPolicyCoverages] = useState([]);

	const showTopupPolicyName = ModuleControl.isHowden && (currentUser?.company_name || '').toLowerCase().startsWith('pearson');

	useEffect(() => {
		dispatch(loadFlex(policy_id))
		dispatch(loadMember(policy_id, undefined, true));
		dispatch(loadNominees({ policy_id }));
		dispatch(loadTopup(policy_id));
		policy_id && dispatch(loadRelations(policy_id));
		getPolicyCoverage(null, setNotPolicyCoverages, [{ id: policy_id }], 1)

		return () => dispatch(clearView())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policy_id]);


	useEffect(() => {
		if (!loading && error) {
			swal("Alert", error, "warning");
		};
		if (!loading && success) {
			swal('Success', success, "success");
			dispatch(loadMember(policy_id));
		};

		return () => { dispatch(clear()) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, error, loading]);

	relations = relations.filter(({ id }) => ((flex?.is_midterm_enrollement_allowed_for_spouse && [2].includes(id)) ||
		(flex?.is_midterm_enrollement_allowed_for_partner && [10].includes(id)) ||
		(flex?.is_midterm_enrollement_allowed_for_kids && [3, 4].includes(id))) && !policyNotCoverages?.[0]?.includes(id))

	const nomineeDeclarationFormHandler = () => {
		dispatch(loadNomineeDeclarationFormHandler({
			policy_id: policy_id,
			employee_id: currentUser?.employee_id
		}));
	}

	return viewLoading ? <Loader /> : (
		!member_option.length ? <Cols xl={12} lg={12} md={12} sm={12}>
			<h1 className='display-4 text-center'>No Member Enrolled</h1>
		</Cols> :
			<>
				<Card title={<div className="d-flex justify-content-between">
					{/* <span>Dependant</span> */}
					<span>Insured Member</span>
					{!!((flex?.is_midterm_enrollement_allowed_for_spouse ||
						flex?.is_midterm_enrollement_allowed_for_partner ||
						flex?.is_midterm_enrollement_allowed_for_kids) && relations.length) && <Button type="button" onClick={() => {
							setEditModal(true)
						}} buttonStyle="outline-secondary">
							Add Dependant +
						</Button>}
				</div>}>
					<Dependancy policy_sub_type_id={flex?.policy_sub_type_id} member_option={member_option} />
				</Card>
				{!!nominees.length && <Card title={<div className="d-flex justify-content-between align-items-center">
					<span>Nominee</span>
					<DeclarationButton onClick={nomineeDeclarationFormHandler} className="btn btn-sm btn-primary">
						Declaration Form
					</DeclarationButton>
				</div>}>
					<Nominee nominees={nominees} />
				</Card>}
				{!!topup.length && topup.some(({ top_up_added }) => top_up_added) && <Card title={showTopupPolicyName ? topup[0].policy_name : "Top up cover"}>
					<Topup topup={topup} showTopupPolicyName={showTopupPolicyName} />
				</Card>}
				{!!editModal &&
					<EditMember
						relations={relations}
						midTerm
						policy_id={policy_id}
						flex={flex}
						topup={topup}
						// Data={editModal}
						show={!!editModal}
						member_option={member_option}
						onHide={() => setEditModal(false)}
					/>}
				{loading && <Loader />}
			</>
	);
};

export default View;

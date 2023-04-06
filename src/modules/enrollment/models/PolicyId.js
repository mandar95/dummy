import React, { useEffect } from "react";
// import styled from "styled-components";
// import { Button } from "components";
import { loadPolicyId, enrollment, loadNomineeText } from "../enrollment.slice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Cols } from "../style";
import { Encrypt, randomString } from "../../../utils";
import { EnrolmentCard } from "./EnrolmentCard";

export const PolicyId = (props) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { policies } = useSelector(enrollment);
	const { onHide, policyId, setPolicyId, loading, setPId } = props;
	const policy = policies?.filter(
		(elem) =>
			elem?.policy_sub_type_id <= 3 || elem.topup_enrolment
	);

	const onSubmit = (
		id,
		enrollement_confirmed,
		enrollement_status,
		enrollement_start_date,
		enrollement_end_date,
		topup_enrolment,
	) => {
		if (id && enrollement_status === 1) {
			policyId(id, topup_enrolment);
			setPId(id)
			onHide()
		} else {
			history.push(`enrollment-view/${randomString()}/${Encrypt(id)}/${randomString()}`);
		}
	};

	useEffect(() => {
		dispatch(loadPolicyId());
		dispatch(loadNomineeText());
		setPolicyId("")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return policy?.length ? ((policy || []).map(
		({
			policy_number,
			name,
			id,
			enrollement_end_date,
			enrollement_start_date,
			enrollement_status,
			policy_sub_type_id,
			topup_enrolment,
			enrollment_midterm_window_is_set,
			enrollment_window_is_set
		}, index) => (
			<div className="col-12 col-lg-6" key={'policies' + index}>
				<EnrolmentCard
					key={'policies' + id}
					policy_number={policy_number}
					policyType={policy_sub_type_id}
					name={name}
					id={id}
					onSubmit={onSubmit}
					enrollement_end_date={enrollement_end_date}
					enrollement_start_date={enrollement_start_date}
					enrollement_status={enrollement_status}
					topup_enrolment={topup_enrolment}
					enrollment_midterm_window_is_set={enrollment_midterm_window_is_set}
					enrollment_window_is_set={enrollment_window_is_set}
				/>
			</div>
		))) : (!loading &&
			<Cols xl={12} lg={12} md={12} sm={12}>
				<h1 className='display-4 text-center'>No Policy Available</h1>
			</Cols>)
};

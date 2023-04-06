import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./Filters";
import CDcard from "./CDcard";
import { useParams } from "react-router";
import {
	// selectPolicyNumber,
	selectPolicyDetails,
	cdBalanceDetails,
	employeeCount as resetEmployeeCount
} from "./CDB.Slice.js";
import { Container, FilterContainer, SecondContainer } from "./style";
import { loadPolicy, clearPolicyData } from "../policies/approve-policy/approve-policy.slice";

const CD_balance_broker = () => {

	const dispatch = useDispatch();
	const { userType } = useParams();
	// const PolicyTypeNumber = useSelector(selectPolicyNumber);
	const PolicyDetails = useSelector(selectPolicyDetails);
	const { employeeCount } = useSelector(state => state.cdBalancebroker)

	//states
	const [policyNoId, setPolicyNoId] = useState(null);
	//Api call for employer Id
	useEffect(() => {

		return () => {
			dispatch(resetEmployeeCount(''));
			dispatch(clearPolicyData());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPolicyNumberId = (e) => {
		if (e.target.value) {
			setPolicyNoId(e.target.value);
			//Api Call for Cd balance details
			const data = { policy_id: e.target.value };
			dispatch(cdBalanceDetails(data));
			dispatch(loadPolicy(e.target.value));
		}
	};

	return (
		<Container>
			<FilterContainer>
				<Filters
					getPolicyNumberId={getPolicyNumberId}
					policyNoId={policyNoId}
					userType={userType}
				/>
			</FilterContainer>
			<SecondContainer>
				<CDcard
					policyDetails={PolicyDetails?.data?.data}
					policyNoId={policyNoId}
					employeeCount={employeeCount}
				/>
			</SecondContainer>
		</Container>
	);
};

export default CD_balance_broker;

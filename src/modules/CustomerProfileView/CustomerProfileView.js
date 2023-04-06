import React, { useState } from "react";
import styled from "styled-components";
import ShowCompanyDetails from "./companyDetails/ShowCompanyDetails";
import ShowMemberDetails from "./companyDetails/ShowMemberDetails";
import { TabWrapper, Tab } from "../../components";
import { useSelector } from "react-redux";

const CustomerProfileView = () => {
	let [tab, setTab] = useState(true);
	// const smallerThan420 = useMediaPredicate("(max-width: 420px)");
	const { userType } = useSelector((state) => state.login);

	return (
		<ProfileviewBox>
			<TabWrapper width="max-content">
				<Tab isActive={tab} onClick={() => setTab(true)}>
					Company Details
				</Tab>

				<Tab isActive={!tab} onClick={() => setTab(false)}>
					Team Details
				</Tab>
			</TabWrapper>
			<Container>
				{/* company details */}
				{tab && <ShowCompanyDetails userType={userType} />}

				{/*Member Details */}
				{!tab && <ShowMemberDetails />}
			</Container>
		</ProfileviewBox>
	);
};

export default CustomerProfileView;

let ProfileviewBox = styled.div`
	background-color: #f3f8fb;
	min-height: 100vh;
	background: url("/assets/images/bg-4.png") no-repeat bottom right;
`;

let Container = styled.div`
	padding: 1rem;
	min-width: 200px;
`;

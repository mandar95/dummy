import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddNominee from "./add-nominee2";
import BulkMember from "./bulkMember";
import { Container } from "./style";
import { policyTypeId, selectPolicies } from "./addMember.slice.js";
import { getErrorSheetData } from "modules/EndorsementRequest/EndorsementRequest.slice.js";
import { TabWrapper, Tab, CardBlue } from "components";
import { DataTable } from "modules/user-management";
import { ErrorSheetTableData } from 'modules/EndorsementRequest/helper';

const AddMember2 = ({ myModule }) => {

	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.login);
	const { ErrorSheetData } = useSelector((state) => state.endorsementRequest);
	const policiesResp = useSelector(selectPolicies);

	const [tab, setTab] = useState("add-nominee");
	const [empID, setEmpID] = useState(null);
	// Api Calls ---------------------------

	useEffect(() => {
		if (currentUser?.employer_id) {
			dispatch(getErrorSheetData({ employer_id: currentUser?.employer_id, is_super_hr: currentUser.is_super_hr }));
			const intervalId = setInterval(() => dispatch(getErrorSheetData({ employer_id: currentUser?.employer_id, is_super_hr: currentUser.is_super_hr })), 15000);
			return () => { clearInterval(intervalId); }
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser])


	useEffect(() => {
		if (empID) {
			dispatch(policyTypeId(empID));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [empID]);
	//--------------------------------------

	//getemployee id -----
	const getemployee = (e) => {
		if (e) {
			setEmpID(e);
		}
	};
	//--------------------

	return (
		<Container>
			<TabWrapper width="max-content">
				<Tab
					isActive={Boolean(tab === "add-nominee")}
					onClick={() => setTab("add-nominee")}
				>
					Add Nominee
				</Tab>
				<Tab
					isActive={Boolean(tab === "add-member")}
					onClick={() => setTab("add-member")}
				>
					Member Bulk Upload
				</Tab>
			</TabWrapper>
			{/* <ScreenContainer> */}
			{tab === "add-nominee" && (
				<AddNominee policiesResp={policiesResp} getemployee={getemployee} />
			)}
			{tab === "add-member" && (
				<>
					<BulkMember myModule={myModule} employerId={currentUser?.employer_id} />
					{!!ErrorSheetData.length && <CardBlue title={`Endorsement Documents`}>
						<DataTable
							columns={
								ErrorSheetTableData(currentUser.is_super_hr) ||
								[]
							}
							data={ErrorSheetData}
							noStatus={true}
							pageState={{ pageIndex: 0, pageSize: 5 }}
							pageSizeOptions={[5, 10]}
							rowStyle
							autoResetPage={false}
						/>
					</CardBlue>}
				</>
			)}
			{/* </ScreenContainer> */}
		</Container>
	);
};

export default AddMember2;

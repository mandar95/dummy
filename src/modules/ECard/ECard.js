import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import HealthCard from "./HealthCard";
import { Row, Col } from "react-bootstrap";
// import { Container } from "./style";
import {
	getEmployerName,
	selectEmployerName,
	getPolicySubtypeData,
	selectPolicyTypeData,
	getEmployeeData,
	selectEmployeeName,
	getMemberData,
	selectMemberName,
	selectCardData,
	loadBroker,
	clearMemberDataDetail,
	setPageData,
	getCardDetails,
	loadEmployeePolicies,
	getEmployerNameDetails,
	getPolicySubTypeDetails,
	getEmployeeDataDetails,
	getMemberDataDetails
} from "./ECard.slice";

import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import _ from "lodash";
import { downloadFile } from "../../utils";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { ProgressBar } from "../EndorsementRequest/progressbar";
import { Prefill } from "../../custom-hooks/prefill";
import { ModuleControl } from "../../config/module-control";

const ECard = () => {

	const { userType } = useParams();
	const dispatch = useDispatch();
	const { userType: userTypeName, currentUser } = useSelector((state) => state.login);
	const CardResponse = useSelector(selectCardData);
	const EmployerNameResponse = useSelector(selectEmployerName);
	const PolicyTypes = useSelector(selectPolicyTypeData);
	const EmployeeNameResponse = useSelector(selectEmployeeName);
	const MemberNameResponse = useSelector(selectMemberName);
	const { broker, firstPage, lastPage, loading } = useSelector((state) => state.eCard);
	//states
	const [cardData, setCardData] = useState([]);

	//states for responses
	const [EmployeeResponse, setEmployeeResponse] = useState([]);
	const [PolicyResponse, setPolicyResponse] = useState([]);
	const [MemberResponse, setMemberResponse] = useState([]);

	const { control, setValue, watch } = useForm();

	const employerId = watch('employer_id')?.value || currentUser?.employer_id;
	const policyId = watch('policy_id')?.value;
	const employeeId = watch('employee_id')?.value || currentUser?.employee_id;

	useEffect(() => {
		if (['employee'].includes(userType)) {
			dispatch(loadEmployeePolicies());
		}
		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1,
			}))
			dispatch(getEmployerNameDetails({ data: [], isNew: true }))
			dispatch(getPolicySubTypeDetails({}))
			dispatch(getEmployeeDataDetails({}))
			dispatch(getMemberDataDetails({}))
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (userType === "admin" && userTypeName) {
			dispatch(loadBroker(userTypeName));
		}

		return () => {
			setCardData([]);
			setPolicyResponse([]);
			setEmployeeResponse([]);
			setMemberResponse([]);
			dispatch(clearMemberDataDetail());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userTypeName]);

	useEffect(() => {
		if (["admin", 'broker'].includes(userType) && currentUser?.broker_id) {
			if (lastPage >= firstPage) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				// dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
				dispatch(getEmployerName({ broker_id: currentUser?.broker_id }, firstPage));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstPage, currentUser]);


	useEffect(() => {
		if (employerId) {
			setValue([
				{ employee_id: undefined },
				{ policy_id: undefined },
				{ member_id: undefined }
			])
			setCardData([]);
			setEmployeeResponse([]);
			setPolicyResponse([]);
			dispatch(getPolicySubtypeData({ employer_id: employerId, user_type_name: userTypeName }, userType === 'employee'));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employerId])

	useEffect(() => {
		if (policyId && userType !== 'employee') {
			setValue([
				{ employee_id: undefined },
				{ member_id: undefined }
			])

			setCardData([]);
			setEmployeeResponse([]);
			setMemberResponse([]);
			dispatch(getEmployeeData({ employer_id: employerId, policy_id: policyId }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policyId])

	useEffect(() => {
		if (employeeId && policyId) {
			setValue([
				{ member_id: undefined }
			])
			dispatch(getMemberData({ employee_id: employeeId, policy_id: policyId }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, userType === 'employee' ? [policyId] : [employeeId])

	// const getFromEmployeeCode = () => {
	// 	if (!policyId) {
	// 		return swal('Validation', 'Policy Name Required', 'info')
	// 	}
	// 	if (!EMPID && !employee_code) {
	// 		return swal('Validation', `Employee Name OR Employee Code Required`, 'info')
	// 	}
	// 	setMemberResponse([]);
	// 	setCardData([]);
	// 	const data = {
	// 		...(employee_code ? {
	// 			employee_code: employee_code
	// 		} : {
	// 			employee_id: EMPID,
	// 		}),
	// 		//employee_code: employee_code ? employee_code : EMPID,
	// 		policy_id: policyId,
	// 	};
	// 	dispatch(getMemberData(data, true));
	// }

	//Selective member Data --------------------------
	const getMemberDetails = ([e]) => {
		setCardData([]);
		if (e?.value) {
			var MemberDetails = MemberNameResponse?.data?.data.filter(function (item) {
				return item.member_id === e.value * 1;
			});
			//policysubtype api
			if (MemberDetails[0] !== undefined) {
				const data = [
					{
						name: MemberDetails[0].name,
						relation_name: MemberDetails[0]?.relation_name,
						ecard_url: MemberDetails[0]?.ecard_url,
						start_date: MemberDetails[0]?.start_date,
						end_date: MemberDetails[0]?.end_date,
						member_id: MemberDetails[0]?.member_id,
						policy_no: MemberDetails[0]?.policy_no,
						emp_code: MemberDetails[0]?.emp_code,
						tpa_member_id: MemberDetails[0]?.tpa_member_id,
						tpa_member_name: MemberDetails[0]?.tpa_member_name,
					},
				];
				setCardData(data);
			}
		} else {
			setCardData(MemberNameResponse?.data?.data);
		}
		return e;
	};
	//-------------------------------------------

	//Bulk Member Data -----------------------
	useEffect(() => {
		if (MemberNameResponse?.data?.data) {
			setCardData(MemberNameResponse?.data?.data);
		}
	}, [MemberNameResponse]);
	//------------------------------------------

	//Download Ecard If E_url =null---------------------------
	useEffect(() => {
		if (!_.isEmpty(CardResponse.data) && CardResponse.data) {
			if (CardResponse?.data?.ecardURL) {
				downloadFile(CardResponse?.data?.ecardURL, null, true)
				// const link = document.createElement("a");
				// link.setAttribute(
				// 	"href",
				// 	"data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8," +
				// 	encodeURIComponent(CardResponse?.data?.ecardURL)
				// );
				// link.href = CardResponse?.data?.ecardURL;
				// document.body.appendChild(link);
				// link.click();
				// document.body.removeChild(link);
			} else {
				swal(ModuleControl.isHowden ? 'E-cards would be available post issuance of the policy' : "E-card not available", "", "warning");
			}
		}
		return () => {
			dispatch(getCardDetails({}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [CardResponse.data]);
	//--------------------------------------------------------

	//Resetting DropDowns on update -----------------------------------
	useEffect(() => {
		if (MemberNameResponse !== undefined)
			setMemberResponse(MemberNameResponse?.data?.data);
	}, [MemberNameResponse]);

	useEffect(() => {
		if (EmployeeNameResponse !== undefined)
			setEmployeeResponse(EmployeeNameResponse?.data?.data);
	}, [EmployeeNameResponse]);

	useEffect(() => {
		if (PolicyTypes !== undefined) setPolicyResponse(userType === 'employee' ? PolicyTypes?.data?.data.map(item => (
			{
				...item,
				policy_no: `${item.policy_name}:${item.policy_number}`,
			})) : PolicyTypes?.data?.data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [PolicyTypes]);
	//--------------------------------------------------------

	// Prefill 
	Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : EmployerNameResponse, setValue, 'employer_id')
	Prefill(PolicyResponse, setValue, 'policy_id', 'policy_no', 'policy_id')

	useEffect(() => {
		if (EmployeeResponse?.length === 1)
			setValue('employee_id', { id: EmployeeResponse[0].employee_id, label: EmployeeResponse[0].employee_name + ' : ' + EmployeeResponse[0].employee_code, value: EmployeeResponse[0].employee_id })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [EmployeeResponse])

	const getAdminEmployer = ([e]) => {
		setCardData([]);
		if (e?.value) {
			dispatch(getEmployerName({ broker_id: e.value }, 1, 50000));
			setValue([
				{ employer_id: undefined },
				{ policy_id: undefined },
				{ employee_id: undefined },
				{ member_id: undefined }
			])
		}
		return e;
	};

	return (
		<>
			<Filters
				Employerdata={EmployerNameResponse}
				// getEmployerId={getEmployerId}
				PolicyType={PolicyResponse}
				// getPolicyTypeId={getPolicyTypeId}
				EmployeeData={EmployeeResponse}
				// getEmployeeId={getEmployeeId}
				MemberData={MemberResponse}
				getMemberDetails={getMemberDetails}
				getAdminEmployer={getAdminEmployer}
				userType={userType}
				broker={broker}
				currentUser={currentUser}
				control={control}
			/>
			<Row className="m-0">
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<HealthCard
						cardData={cardData}
						Policyid={policyId}
					/>
				</Col>
			</Row>
			{loading && <ProgressBar text='Fetching Employer Data...' />}
		</>
	);
};

export default ECard;

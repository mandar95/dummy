import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ControlledTabs from "./tabs";
import { Row, Col } from "react-bootstrap";
import { CardBlue, /* Select,  */SelectComponent } from "../../components";
import { useForm, Controller } from 'react-hook-form';
// import SelectPolicyType from "./SelectPolicyType";
// import SelectPolicyNumber from "./SelectPolicyNumber";
// import _ from "lodash";
import { TabContainer, Spacer } from "./style";
import {
	getPolicySubTypeData,
	selectPolicySubType,
	getPolicyNumberData,
	selectPolicyNumber,
	// getSumInsured,
	// selectSumInsured,
} from "./addMember.slice";
import { Prefill } from "../../custom-hooks/prefill";
// import { sumInsuredEndorseSplit } from "../EndorsementRequest/helper";

const BulkMember = (props) => {
	//selectors
	const { control, reset, setValue, watch } = useForm();
	const dispatch = useDispatch();
	const PolicyTypeResponse = useSelector(selectPolicySubType);
	const PolicyNumberResponse = useSelector(selectPolicyNumber);

	const employerId = watch('employer_id')?.value || props.employerId || '';
	const policytype = watch('policytype')?.value || '';
	const policyno = watch('policyno')?.value || '';


	// const sumInsuredResp = useSelector(selectSumInsured);
	//states
	const { userType: userTypeName, currentUser } = useSelector((state) => state.login);


	useEffect(() => {
		if (employerId) {
			getEmployerId(employerId)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employerId])

	useEffect(() => {
		if (policytype)
			getPolicyId(policytype)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policytype])


	// Prefill 
	Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : [], setValue, 'employer_id')
	Prefill(PolicyTypeResponse?.data?.data, setValue, 'policytype',)
	Prefill(PolicyNumberResponse?.data?.data, setValue, 'policyno', 'number')


	//selected value (policysubtypeid)------------------
	const getPolicyId = (e) => {
		setValue('policyno', undefined)
		if (e) {
			dispatch(getPolicyNumberData({
				employer_id: employerId || props.employerId,
				policy_sub_type_id: e,
				user_type_name: userTypeName
			}));
		}
		return e
	};
	//---------------------------------

	const getEmployerId = (e) => {
		setValue([
			{ 'policytype': undefined },
			{ 'policyno': undefined }])
		if (e) {
			// api call for Policy subtype
			dispatch(getPolicySubTypeData({ employer_id: e }));
		}
		return e
	};

	//Sum Insured Display----------
	// useEffect(() => {
	// 	if (!_.isEmpty(getPolicyNumberObject)) {
	// 		const data = getPolicyNumberObject?.id;
	// 		dispatch(getSumInsured(data));
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [getPolicyNumberObject]);
	//-----------------------------

	return (
		<CardBlue title="Bulk Operations" round>
			<TabContainer>
				<Row >

					{!!(currentUser.is_super_hr && currentUser.child_entities.length) && (
						<Col xl={4} lg={4} md={6} sm={12}>
							<Controller
								as={
									<SelectComponent
										label="Employer"
										placeholder='Select Employer'
										options={currentUser.child_entities.map(item => (
											{
												id: item.id,
												label: item.name,
												value: item.id
											}
										)) || []}
										id="employer_id"
										required
									/>
								}
								defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
								name="employer_id"
								control={control}
							/>
						</Col>
					)}
					<Col xl={4} lg={4} md={6} sm={12}>
						<Controller
							as={
								<SelectComponent
									label="Policy Type"
									placeholder="Select Policy Type"
									required
									options={PolicyTypeResponse?.data?.data?.map(item => (
										{
											id: item.id,
											label: item.name,
											value: item.id
										}
									)) || []}
								/>
							}
							control={control}
							name="policytype"
						/>
					</Col>
					<Col xl={4} lg={4} md={6} sm={12}>
						<Controller
							as={
								<SelectComponent
									label="Policy Number"
									placeholder="Select Policy Number"
									required
									options={PolicyNumberResponse?.data?.data?.map(item => (
										{
											id: item.id,
											label: item.number,
											value: item.id
										}
									)) || []}
								/>
							}
							control={control}
							name="policyno"
						/>
					</Col>
				</Row>
				{/* {((sumInsuredResp?.data?.suminsured) ||
					sumInsuredResp?.data?.opd_suminsured) && (
						<Row xs={1} sm={1} md={1} lg={1} xl={1}>
							<div
								style={{
									border: "1px solid #6334e3",
									justifyContent: "center",
									alignItems: " center",
									display: "flex",
									borderRadius: "12px",
									width: "min-content",
									flexDirection: "column",
									textAlign: 'center'
								}}
							>
								{sumInsuredResp?.data?.suminsured && (
									<p
										style={
											sumInsuredResp?.data?.opd_suminsured
												? { padding: "10px 10px 0px 10px" }
												: { padding: "10px" }
										}
										className="m-0"
									>
										The above selected policy type is flat sum insured (SI),
										please refer to the following SI values while submitting the Insured data via excel sheet as{" "}
										{sumInsuredEndorseSplit(sumInsuredResp?.data?.suminsured)}
									</p>
								)}
								<br />
								{sumInsuredResp?.data?.opd_suminsured && (
									<p
										style={
											sumInsuredResp?.data?.suminsured
												? { padding: "0px 10px 10px 10px" }
												: { padding: "10px" }
										}
										className="m-0"
									>
										The above selected policy type is flat sum insured (SI-OPD),
										please refer to the following SI values while submitting the Insured data via excel sheet as{' '}
										{sumInsuredEndorseSplit(sumInsuredResp?.data?.opd_suminsured)}
									</p>
								)}
							</div>
						</Row>
					)} */}
				<Spacer>
					<ControlledTabs
						reset={reset}
						policyno={policyno}
						employerId={employerId || props.employerId}
						myModule={props.myModule}
					/>
				</Spacer>
			</TabContainer>
		</CardBlue>
	);
};

export default BulkMember;

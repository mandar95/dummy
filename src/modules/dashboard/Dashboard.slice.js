import { createSlice } from "@reduxjs/toolkit";
import { getEmployDashboard, EmployeeMemberDetails, EmployeeImageUpload } from './Dashboard.service';
import SecureLS from "secure-ls";
import { getFlexBalanceAll, getMembers, getNominees, getSummary } from "../enrollment/enrollment.service";
import swal from "sweetalert";
import _ from "lodash"
import { ModuleControl } from "../../config/module-control";


const ls = new SecureLS();

export const dashboard = createSlice({
	name: "dashboard",
	initialState: {
		loading: false,
		employeeDashboard: {
			policies: {
				voluntary_cover: [],
				group_cover: []
			},
			memberdetails: [],
			policyDetail: {}
		},
		employerDashboard: {},
		brokerDashboard: {},
		userType: "",
		employeeDashboardSummary: [],
		// summaryPremium: 0,
		summaryFlex: [],
		nomineeSummary: [],
		flex_balance: {}
	},

	//reducers
	reducers: {
		loading: (state, { payload = true }) => {
			state.loading = payload;
		},
		getEmployeeDashboard: (state, { payload }) => {
			state.loading = false;
			state.userType = payload.userType;
			state.employeeDashboard.policies.group_cover = payload.group_cover;
			state.employeeDashboard.policies.voluntary_cover = payload.voluntary_cover;
		},
		getEmployeeMemberDetails: (state, { payload }) => {
			state.employeeDashboard.memberdetails = payload;
		},
		nullifyEmployMemberDetails: (state) => {
			state.employeeDashboard.memberdetails = [];
		},
		setpolicyDetail: (state, { payload }) => {
			state.policyDetail = payload
		},
		setEmployeeDashboardSummary: (state, { payload }) => {
			state.employeeDashboardSummary = payload.summary;
			// state.summaryPremium = payload.summaryPremium;
			state.summaryFlex = payload.summaryFlex;

		},
		setNomineeSummary: (state, { payload }) => {
			state.nomineeSummary = payload
		},
		flex_balance: (state, { payload }) => {
			state.flex_balance = payload
		}
	},
});


export const {
	loading, getEmployeeDashboard,
	getEmployeeMemberDetails,
	nullifyEmployMemberDetails, flex_balance,
	setpolicyDetail, setEmployeeDashboardSummary, setNomineeSummary
} = dashboard.actions;

//action Creators

const getFlexPremium = (flex_benefit_features = []) => {
	const filterFlexBenefit = flex_benefit_features.filter(({ benefit/* , benefit_name */ }) => !((benefit || /* benefit_name || */ '')?.toLowerCase()).includes('opd'));

	const totalPremium = filterFlexBenefit.reduce((total, { premium }) => total + Number(premium), 0)

	return totalPremium || 0
}

export const employeeDashboard = (currentUser) => {
	let userType = ls.get('userType');
	return async (dispatch) => {
		dispatch(loading());
		const { data } = await getEmployDashboard();
		if (data?.status) {

			const UdaanLogicActivate = ModuleControl.isHowden &&
				((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('robin software development') ||
					(currentUser?.company_name || '').toLowerCase().startsWith('rakuten'));


			let flexPremium = [];
			let responseData = data?.data?.filter(({ members }) => !!members?.length)
				.map(({ premium, ...rest }, index) => {
					const calculatePremium = (((UdaanLogicActivate) && (Number(rest.number_of_time_salary) === (UdaanLogicActivate ? 3 : 2) && rest.policy_sub_type_id !== 1)) ? 0 : premium) + Number(rest.enhance_employee_premium || 0) + getFlexPremium(rest.flex_benefit_features) + getFlexPremium(rest.flex_details)
					flexPremium[index] = (calculatePremium || 0)
					return ({ ...rest, premium: calculatePremium })
				});


			if ((UdaanLogicActivate) && responseData?.some(({ suminsured_subtype_id }) => [2, 5].includes(suminsured_subtype_id))) {
				const policy_id = responseData?.find(({ suminsured_subtype_id }) => suminsured_subtype_id === 5)?.policy_id
				const { data: udaanResponse } = await getMembers(policy_id, currentUser?.employee_id);
				responseData = responseData?.map(({ premium, ...rest }, index) => {
					const finalPremium = (policy_id === rest.policy_id &&
						Number(udaanResponse?.data?.[0]?.number_of_time_salary) === 3 &&
						udaanResponse?.data?.[0]?.policy_sub_type_id !== 1) ?
						Number(rest.enhance_employee_premium || 0) + getFlexPremium(rest.flex_benefit_features) + getFlexPremium(rest.flex_details) : premium
					flexPremium[index] = finalPremium;

					return {
						...rest,
						premium: finalPremium
					}
				})
			}

			let group_cover = [];
			let voluntary_cover = [];
			group_cover = responseData?.filter(({ premium, display_in_benefit_summary }) => (display_in_benefit_summary === 0 || !display_in_benefit_summary) ? !premium : display_in_benefit_summary === 1);
			voluntary_cover = responseData?.filter(({ premium, display_in_benefit_summary }) => (display_in_benefit_summary === 0 || !display_in_benefit_summary) ? !!premium : display_in_benefit_summary === 2);
			dispatch(getEmployeeDashboard({ group_cover, voluntary_cover, userType }));

			if (responseData?.length) {
				let filterData = null;
				if (ModuleControl.isHowden && (currentUser?.company_name || '').toLowerCase().startsWith('persistent')) {
					filterData = responseData.filter(data => [1, 2, 3].includes(Number(data.policy_sub_type_id)) || Number(data.policy_id) === 119);
				} else {
					filterData = responseData.filter(data => [1, 2, 3].includes(Number(data.policy_sub_type_id)));
				}
				let response = await Promise.all(filterData.map(({ policy_id }) => getSummary(policy_id)));
				const flexResponse = await getFlexBalanceAll({ policy_ids: filterData.map(({ policy_id }) => policy_id) });
				if (flexResponse.data.data) {
					dispatch(flex_balance(flexResponse.data.data))
				}

				const responseNominee = await Promise.all(filterData.map(({ policy_id }) => getNominees({ policy_id })));
				if (response.length /* && responseNominee.length */) {
					response = response
						.filter((elem) => elem?.data.data)
						.map(({ data }) => data.data);

					if (ModuleControl.isHowden && (currentUser?.company_name || '').toLowerCase().startsWith('persistent')) {
						let _data = []
						response.forEach((item) => {
							if (Object.keys(item).length > 1) {
								if (item['Personal Accident Top Up'] && item['Personal Accident Top Up'].every((item) => item.relation_id === 2)) {
									let _obj = _.omit(item, 'Group Personal Accident');
									_data.push(_obj)
								} else {
									_data.push(item)
								}
							}
							else {
								_data.push(item)
							}
						})
						response = _data.length ? _data : response
					}
					// const summaryPremium = response.reduce((total, summary) =>
					// 	total + Object.entries(summary).reduce((summaryTotal, [key, members]) =>
					// 		summaryTotal + members.reduce((membersTotal, { employee_premium, number_of_time_salary }) =>
					// 			membersTotal + ((UdaanLogicActivate && Number(number_of_time_salary) === 3) ? 0 : Number(employee_premium))
					// 			, 0)
					// 		, 0)
					// 	, 0);

					const summaryFlex = responseData.reduce((total, { policy_start_date, flex_benefit_features, flex_details }) =>
						[...total, ...flex_benefit_features.filter(({ benefit }) => !((benefit || '')?.toLowerCase()).includes('opd')).map(elem => ({ ...elem, policy_start_date })),
						...flex_details ? flex_details.map(elem => ({ ...elem, policy_start_date })) : []], [])

					dispatch(setEmployeeDashboardSummary({
						summary: response,
						summaryFlex,
						// summaryPremium: flexPremium.reduce((total, value) => total + Number(value), 0)
					}));
					responseNominee && dispatch(setNomineeSummary(responseNominee
						.map((elem) => elem?.success ? elem?.data.data : [])));
				}
			}
		} else {
			dispatch(loading(false))
		}
	};
};

export const employeeMemberDetails = (policyId) => {
	return async (dispatch) => {
		dispatch(nullifyEmployMemberDetails())
		const response = await EmployeeMemberDetails({ policy_id: policyId });
		if (response.data?.status) {
			let members = response.data?.data[0]?.members
			let membersWithRequiredDetails = [];
			members.forEach((v, i) => {
				let memberWithDetails = {
					member_id: v.tpa_member_id || '-',
					emp_code: v.emp_code || '-',
					member_name: v.first_name + " " + v.last_name,
					member_dob: v.dob,
					member_relation: v.relation,
					suminsured: v.suminsured,
					enhance_suminsured: v.enhance_suminsured,
					opd_suminsured: v.opd_suminsured,
					member_status: v.enrollement_status,
					member_healthecard: v.ecard_url,
					cover_start_date: v.cover_start_date,
					cover_end_date: v.cover_end_date,
					id: v.member_id,
					relation_id: v.relation_id,
					gender: v.gender,
					image_url: v.image_url
				};
				membersWithRequiredDetails.push(memberWithDetails);
			})
			dispatch(getEmployeeMemberDetails(membersWithRequiredDetails));
			const { policy_id, policy_sub_type_id, policy_sub_type_name } = response.data?.data[0]
			dispatch(setpolicyDetail({ policy_id, policy_sub_type_id, policy_sub_type_name }))
		} else {
		}
	};
};
export const employeeImageUpload = (payload, policyId) => {
	return async (dispatch) => {
		try {
			dispatch(loading(true))
			const { data, message, errors } = await EmployeeImageUpload(payload);
			if (data?.status) {
				dispatch(loading(false))
				dispatch(employeeMemberDetails(policyId));
				swal("Success", message, "success");
			} else {
				dispatch(loading(false))
				console.error(errors);
				swal("Alert", errors, "alert");
			}
		} catch (err) {
			dispatch(loading(false))
			console.error(err);
			swal("Alert", err, "alert");
		}
	};
};
// selectors
export const getEmployeePolicies = (state) => state?.dashboard?.employeeDashboard?.policies;
export const getMemberDetails = (state) => state?.dashboard?.employeeDashboard?.memberdetails;
export const getUserType = (state) => state?.dashboard?.userType;
export const getloading = (state) => state?.dashboard.loading;
export const getPolicyDetail = (state) => state?.dashboard.policyDetail;
//reducer export
export default dashboard.reducer;

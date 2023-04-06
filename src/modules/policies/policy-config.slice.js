import { createSlice } from "@reduxjs/toolkit";
import service from './policy-config.service';
import { FormConfig } from "./models/form-config";
import { formIds } from "./helper";
import { serializeError } from "utils";
import { findIndex } from "lodash";
import swal from "sweetalert";
import { loadBrokerBranches } from "../broker-branches/broker-branches.service";

const refactorLeadData = (data) => {
	return {
		...data,
		policy_type: data.policy_type_id,
		policy_sub_type: data.policy_sub_type_id,
		// insurer
		no_of_member: data.family_construct.length,
		ages: data.family_construct.map(item => ({
			no_limit: item.min_age ? false : true,
			relation_id: item.relation_id,

			// additional_premium: 0,
			is_opd_contribution: 0,
			// is_special_member_allowed: false,
			// special_member_employee_contribution: 0,
			// special_member_employer_contribution: 0,
		})),
		premium_type: 1,
		si_sub_type: 1,
		si_type: 1,
		policy_rater_type_id: 1,
		// sum_insured: [data.selected_plan?.sum_insured || '500000'],
		// premium: [{
		// 	tax: '18',
		// 	amount: Number(data.selected_plan?.sum_insured) / 18,
		// 	total_premium: data.selected_plan?.sum_insured
		// }]
	}
}

const policyConfigSlice = createSlice({
	name: "policyConfig",
	initialState: {
		loading: false,
		listLoading: true,
		error: null,
		formConfigs: [],
		policyConfigs: {},
		familyLabels: [],
		brokerId: null,
		stepSaved: null,
		policyData: {},
		validEmployerPolicy: true,
		changeEnrollmentMessage: null,
		completeConfig: false,
		masterPolicy: [],
		ipdPolicies: [],
		policyDeleteSucess: null,
		policyDeleteError: null,
		// benefits: [],
		// cdBalance: '0',
		// thresholdBalance: '0',
		renew_type: 1,
		lastPage: 1,
		firstPage: 1,
		policies: [],
		SI: [],
		SIType: null,
		success: null,
		featureData: [],
		suminsuredData: [],
		// ipd_error: ''
		// ipd_error: '',
		ComminicationTriggersData: [],
		MasterCommunicationsData: [],
		Rater: [],
		RaterType: null,
		EmployerUserForContactDetails: [],
		employerInstallment: [],
		brokerBranches: []
	},
	reducers: {
		setSuminsured(state, payload) {
			state.suminsuredData = payload.map((data, i) => {
				return {
					id: (i + 1),
					name: (data.suminsured),
					...data
				}
			});
			state.loading = null;
		},
		getFormConfigs(state) {
			state.loading = true;
			state.error = null;
		},
		getFormConfigsSuccess(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.formConfigs = action.payload;
		},
		getFormConfigsError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
		},

		getPolicyConfigs(state) {
			state.loading = true;
			state.error = null;
		},
		getPolicyConfigsSuccess(state, { payload }) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.policyConfigs = payload.data;
			state.brokerId = payload.data.broker_id;
			if (!payload.PolicyGenerate)
				state.policyData = payload.flag ? {} : (payload.leadData ? refactorLeadData(payload.leadData) : payload.data.config);
		},
		getPolicyConfigsError(state, action) {
			state.loading = true;
			state.error = action.payload || "";
		},

		getFamilyLabels(state) {
			state.loading = true;
			state.error = null;
		},
		getFamilyLabelsSuccess(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.familyLabels = action.payload;
		},
		getFamilyLabelsError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
		},

		createTempPolicy(state, action) {
			state.loading = true;
			state.error = null;
			state.policyData = { ...state.policyData, ...action.payload };
		},
		createTempPolicySuccess(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.stepSaved = action.payload;
		},
		createTempPolicyError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
		},

		clearSavedStep(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.stepSaved = null;
		},

		removeTempPolicy(state) {
			state.loading = true;
			state.error = null;
			state.policyDeleted = false;
			state.policyConfigs = {};
		},
		removeTempPolicySuccess(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.policyDeleted = true;
		},
		removeTempPolicyError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
		},

		createPolicy(state) {
			state.loading = true;
			state.error = null;
		},
		createPolicySuccess(state, action) {

			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.stepSaved = action.payload;
			state.completeConfig = true;
		},
		createPolicyError(state, { payload }) {
			let message = " "
			if (typeof payload === 'string')
				message = payload;
			else if (typeof payload === 'object') {
				for (const property in payload) {
					message = `${message}
          ${payload[property][0]}`;
				}
			}

			state.loading = null;
			state.loading = null;
			state.submitError = message;
		},
		clearPolicyError(state) {
			state.loading = null;
			state.loading = null;
			state.submitError = null;
		},
		validatePolicyExists(state) {
			state.loading = false;
			state.listLoading = false;
			state.loading = null;
			state.error = null;
		},
		validatePolicyExistsSuccess(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.validEmployerPolicy = action.payload;
		},
		validatePolicyExistsError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
		},

		getPolicies(state) {
			state.listLoading = true;
			state.error = null;
			state.policies = [];
		},
		getPoliciesSuccess(state, action) {
			state.error = null;
			// state.f=state.policies;
			state.policies = [...state.policies, ...action.payload];
			state.loading = false;
			state.listLoading = false;
		},
		getPoliciesError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
			state.lastPage = 1;
			state.firstPage = 2;
		},
		clearPolicies: (state) => {
			state.policies = [];
		},
		changeEnrollmentDate(state) {
			state.loading = true;
			state.error = null;
		},
		changeEnrollmentDateSuccess(state, action) {
			const formData = action.payload?.formData;
			const selectedIndex = findIndex(state.policies, item => item.id === formData.policy_id);
			if (selectedIndex !== -1) {
				const selectedRow = state.policies[selectedIndex];
				selectedRow.enrollement_start_date = formData.start_date;
				selectedRow.enrollement_end_date = formData.end_date;
				state.policies[selectedIndex] = selectedRow;
			}
			state.loading = false;
			state.listLoading = false;
			state.changeEnrollmentMessage = action.payload?.message;
		},
		changeEnrollmentDateError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
			state.changeEnrollmentMessage = null;
		},
		clearEnrollmentDate(state) {
			state.changeEnrollmentMessage = null;
		},
		downloadPolicy(state) {
			state.loading = true;
			state.listLoading = true;
			state.error = null;
			state.policyURL = null;
		},
		downloadPolicySuccess(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.policyURL = action.payload;
		},
		clearDownloadPolicySuccess(state) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.policyURL = null;
		},
		downloadPolicyError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
		},

		downloadSample(state) {
			state.loading = true;
			state.error = null;
			state.policyURL = null;
		},
		downloadSampleSuccess(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.sampleURL = action.payload;
		},
		clearDownloadSampleSuccess(state) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.sampleURL = null;
		},
		downloadSampleError(state, action) {
			state.loading = false;
			state.listLoading = false;
			state.error = action.payload;
		},
		clearCompleteFlag(state) {
			state.loading = false;
			state.listLoading = false;
			state.error = null;
			state.completeConfig = false;
		},
		check_topup(state, { payload }) {
			state.loading = false;
			state.listLoading = false;
			state.check_topup = payload;
		},
		clear_check_topup(state, { payload }) {
			state.loading = false;
			state.listLoading = false;
			state.check_topup = null;
		},
		masterPolicy(state, { payload }) {
			state.loading = false;
			state.listLoading = false;
			state.masterPolicy = payload;
		},
		ipdPolicies(state, { payload }) {
			state.loading = false;
			state.listLoading = false;
			state.ipdPolicies = payload;
		},
		// ipdError(state, { payload }) {
		// 	state.ipd_error = payload
		// },
		clear_masterPolicy(state, { payload }) {
			state.loading = false;
			state.listLoading = false;
			state.masterPolicy = [];
		},
		loading(state) {
			state.loading = true
		},
		policyDeleteSucess(state, { payload }) {
			state.loading = false;
			state.listLoading = false;
			state.policyDeleteSucess = payload;
		},
		clearPolicyDeleteSucess(state) {
			state.loading = false;
			state.listLoading = false;
			state.policyDeleteSucess = null;
		},
		policyDeleteError(state, { payload }) {
			let message = " "
			if (typeof payload === 'string')
				message = payload;
			else if (typeof payload === 'object') {
				for (const property in payload) {
					message = `${message}
          ${payload[property][0]}`;
				}
			}
			state.loading = false;
			state.listLoading = false;
			state.policyDeleteError = message;
		},
		clearPolicyDeleteError(state) {
			state.loading = false;
			state.listLoading = false;
			state.policyDeleteError = null;
		},
		// setBenefits: (state, { payload }) => {
		// 	state.benefits = payload;
		// },
		// setCdBalance: (state, { payload }) => {
		// 	state.cdBalance = payload;
		// },
		// setThresholdBalance: (state, { payload }) => {
		// 	state.thresholdBalance = payload;
		// },
		setRenewType: (state, { payload }) => {
			state.renew_type = payload;
		},
		setPageData: (state, { payload }) => {
			state.firstPage = payload.firstPage;
			state.lastPage = payload.lastPage;
		},
		listLoading: (state, { payload }) => {
			state.listLoading = payload;
		},
		success: (state, { payload }) => {
			state.loading = null;
			state.error = null;
			state.success = payload;
		},
		error: (state, { payload }) => {
			let message = " "
			if (typeof payload === 'string')
				message = payload;
			else if (typeof payload === 'object') {
				for (const property in payload) {
					message = `${message}
	  ${payload[property][0]}`;
				}
			}

			state.loading = null;
			state.error = message !== ' ' ? message : 'Unable to connect to the server, please check your internet connection.';
			state.success = null;
		},
		clear: (state, { payload }) => {
			state.error = null;
			state.success = null;
			switch (payload) {
				case "triggerData":
					state.ComminicationTriggersData = [];
					state.MasterCommunicationsData = []
					break;
				default:
					break;
			}
		},
		setFeature: (state, { payload }) => {
			state.featureData = payload;
			state.loading = null;
		},
		setSI: (state, { payload }) => {
			state.SI = getSITypeData(payload.SIType, payload?.SI)
			state.SIType = payload.SIType

			// if (payload.SIType === "flat") {
			// 	let v = payload?.SI.map((data, i) => {
			// 		return {
			// 			id: (i + 1),
			// 			name: (data)
			// 		}
			// 	})
			// 	state.SI = v;
			// 	state.SIType = payload.SIType
			// }
			// if (payload.SIType === "age") {
			// 	let v = payload?.SI.map((data, i) => {
			// 		return {
			// 			id: (i + 1),
			// 			name: data.suminsured,
			// 			value: (i + 1)
			// 		}
			// 	})
			// 	state.SI = v;
			// 	state.SIType = payload.SIType
			// }
			// if (payload.SIType === "grade") {
			// 	let v = payload?.SI.map((data, i) => {
			// 		return {
			// 			id: (i + 1),
			// 			name: (data.suminsured)
			// 		}
			// 	})
			// 	state.SI = v;
			// 	state.SIType = payload.SIType
			// }
			// if (payload.SIType === "designation") {
			// 	let v = payload?.SI.map((data, i) => {
			// 		return {
			// 			id: (i + 1),
			// 			name: (data.suminsured)
			// 		}
			// 	})
			// 	state.SI = v;
			// 	state.SIType = payload.SIType
			// }
			// if (payload.SIType === "salary") {
			// 	let v = payload?.SI.map((data, i) => {
			// 		return {
			// 			id: (i + 1),
			// 			name: (data.no_of_times_of_salary)
			// 		}
			// 	})
			// 	state.SI = v;
			// 	state.SIType = payload.SIType
			// }


		},
		setRater: (state, { payload }) => {
			state.Rater = payload?.Rater
			state.RaterType = payload.RaterType
		},
		setComminicationTriggers: (state, { payload }) => {
			state.ComminicationTriggersData = payload;
			state.loading = null;
		},
		setMasterCommunication: (state, { payload }) => {
			state.MasterCommunicationsData = payload;
			state.loading = null;
		},
		setEmployerUserForContactDetails: (state, { payload }) => {
			state.EmployerUserForContactDetails = payload.filter(item => (item.email && item.id) !== null)
			state.loading = null;
		},
		employerInstallment: (state, { payload }) => {
			state.employerInstallment = payload;
		},
		brokerBranches: (state, { payload = [] }) => {
			state.brokerBranches = payload
		}
	}
});

export const {
	getFormConfigs, getFormConfigsSuccess, getFormConfigsError,
	getPolicyConfigs, getPolicyConfigsSuccess, getPolicyConfigsError,
	getFamilyLabels, getFamilyLabelsSuccess, getFamilyLabelsError,
	createTempPolicy, createTempPolicySuccess, createTempPolicyError,
	clearSavedStep, clearCompleteFlag,
	removeTempPolicy, removeTempPolicySuccess, removeTempPolicyError,
	createPolicy, createPolicySuccess, createPolicyError,
	validatePolicyExists, validatePolicyExistsSuccess, validatePolicyExistsError,
	policyDeleteSucess, clearPolicyDeleteSucess,
	policyDeleteError, clearPolicyDeleteError, clearPolicies,


	getPolicies, getPoliciesSuccess, getPoliciesError,
	changeEnrollmentDate, changeEnrollmentDateSuccess, changeEnrollmentDateError,
	clearEnrollmentDate, clearDownloadPolicySuccess, clearDownloadSampleSuccess,
	downloadPolicy, downloadPolicySuccess, downloadPolicyError,
	downloadSample, downloadSampleSuccess, downloadSampleError,
	clearPolicyError, check_topup, clear_check_topup, masterPolicy,
	clear_masterPolicy, loading, ipdPolicies,
	// ipdError,
	listLoading,
	// setBenefits, setCdBalance, setThresholdBalance, 
	setRenewType,
	setPageData,
	setSI,
	success,
	error,
	clear,
	setFeature,
	setComminicationTriggers,
	setMasterCommunication,
	setSuminsured,
	setRater,
	setEmployerUserForContactDetails,
	employerInstallment,
	brokerBranches
} = policyConfigSlice.actions;

export default policyConfigSlice.reducer;

// Action creators
export const loadFormConfigs = () => {
	return async dispatch => {
		try {
			dispatch(getFormConfigs());
			const { data } = await service.loadFormConfigs();
			const configs = (data.data || []).map((item, index) => {
				const config = new FormConfig(item, formIds[index]);
				return config;
			});

			dispatch(getFormConfigsSuccess([...configs]));





			// } else {
			// 	dispatch(getFormConfigsError(data?.message));
			// }
		} catch (err) {
			dispatch(getFormConfigsError(serializeError(err)));
		}
	}
};

export const validateTopup = (payload) => {
	return async dispatch => {
		try {
			const { data } = await service.checkTopup(payload);
			if (data && data.status === false) {
				dispatch(check_topup(data?.message));
			} else if (data && data.status) {
				dispatch(masterPolicy(data?.data || []))
			}
		} catch (err) {
			console.error((err))
		}
	}
};

export const loadIpdPolicies = (payload) => {
	return async dispatch => {
		try {
			const { data } = await service.ipdPolicies(payload);
			if (data && data.data) {
				dispatch(ipdPolicies(data.data));
			} else {
				// dispatch(ipdError(message))
			}
		} catch (err) {
			console.error(err)
		}
	}
};

export const loadTopPoliciesByBase = async (payload, setUpdate) => {
	try {
		let response = await Promise.all(payload.filter(({ policy_id }) => policy_id).map(({ policy_id }) => service.loadTopPoliciesByBase({ base_policy_id: policy_id })));
		setUpdate(response.reduce((total, { data }) => {
			let result = [];
			if (data?.data?.length) result = data.data;
			return [...total, ...result]
		}, []).map(elem => ({
			id: elem.id, value: elem.id,
			label: `${elem.policy_name} : ${elem.policy_number}`
		})) || []);
	} catch (err) {
		console.error(err)
	}
}

export const loadPolicyConfigs = (id, flag, enquiry_id, ic_plan_id, PolicyGenerate) => {
	return async dispatch => {
		try {
			dispatch(getPolicyConfigs());
			const { data } = await service.loadPolicyConfigs(id);
			let leadData = null;
			if (enquiry_id) {
				const { data: data2 } = await service.loadLeadData({ enquiry_id });
				const { data: data3 } = await service.loadRfq(ic_plan_id);
				leadData = { ...data2.data && data2.data[0], ...data3.data && data3.data[0] }
			}
			if (data) {
				dispatch(getPolicyConfigsSuccess({ data, flag, leadData, PolicyGenerate }));
			} else {
				dispatch(getPolicyConfigsError(data?.message));
			}
		} catch (err) {
			dispatch(getPolicyConfigsError(serializeError(err)));
		}
	}
};

export const loadBrokerBranch = broker_id => {
	return async dispatch => {
		try {
			const { data: brokerBranchesData } = await loadBrokerBranches(broker_id);
			dispatch(brokerBranches(brokerBranchesData?.data || []));
		} catch (err) {
			// dispatch(getFamilyLabelsError(serializeError(err)));
		}
	}
};

export const loadFamilyLabels = payload => {
	return async dispatch => {
		try {
			dispatch(getFamilyLabels());
			const { data } = await service.loadFamilyLabels(payload);
			if (data) {
				dispatch(getFamilyLabelsSuccess(data));
			} else {
				dispatch(getFamilyLabelsError(data?.message));
			}
		} catch (err) {
			dispatch(getFamilyLabelsError(serializeError(err)));
		}
	}
};

export const loadRelationMaster = (should_include_self) => {
	return async dispatch => {
		try {
			dispatch(getFamilyLabels());
			const { data } = await service.loadRelationMaster();
			if (data.data) {
				dispatch(getFamilyLabelsSuccess(data.data.filter((elem) => should_include_self || elem.name !== 'Self')));
			} else {
				dispatch(getFamilyLabelsError(data?.message));
			}
		} catch (err) {
			dispatch(getFamilyLabelsError(serializeError(err)));
		}
	}
};



export const saveTempPolicy = (payload, id) => {
	return async dispatch => {
		try {
			dispatch(createTempPolicy({ ...payload.data }));
			const { data } = await service.saveTempPolicy(payload.data, id);
			if (data) {
				dispatch(createTempPolicySuccess(payload.formId));
			} else {
				dispatch(createTempPolicyError(data?.message));
			}
		} catch (err) {
			dispatch(createTempPolicyError(serializeError(err)));
		}
	}
};

export const deleteTempPolicy = id => {
	return async dispatch => {
		try {
			dispatch(removeTempPolicy());
			const { data } = await service.deleteTempPolicy(id);

			if (data) {
				dispatch(removeTempPolicySuccess());
			} else {
				dispatch(removeTempPolicyError(data?.message));
			}
		} catch (err) {
			dispatch(removeTempPolicyError(serializeError(err)));
		}
	}
};

export const deletePolicy = payload => {
	return async dispatch => {
		try {
			dispatch(listLoading(true))
			const { data } = await service.deletePolicy(payload);
			if (data && data.status) {
				dispatch(policyDeleteSucess(data.message));
				dispatch(setPageData({
					firstPage: 1,
					lastPage: 1,
				}))
			} else {
				if (data?.errors)
					dispatch(policyDeleteError(serializeError(data.errors)));
				if (data?.message)
					dispatch(policyDeleteError(data.message));
			}
		} catch (err) {
			if (err?.errors)
				dispatch(policyDeleteError(serializeError(err.errors)));
			if (err?.message)
				dispatch(policyDeleteError(err.message));
		}
	}
};

export const savePolicy = (payload, formId, renwalData) => {
	return async dispatch => {
		try {
			dispatch(createPolicy(payload));
			const { data } = await service.savePolicy(payload);
			if (data && data?.status) {
				dispatch(createPolicySuccess(formId));
				if (data.policy_id && renwalData) {
					const { data: renewData } = await service.renewType({
						...renwalData,
						policy_id: data.policy_id
					});
					renewData && dispatch(setRenewType(1))
				}
			} else {
				if (data?.errors)
					dispatch(createPolicyError(serializeError(data.errors)));
				if (data?.message)
					dispatch(createPolicyError(serializeError(data.message)));
			}
		} catch (err) {
			dispatch(createPolicyError('Unable to connect to the server, please check your internet connection.'));
		}
	}
};

export const validateEmployerPolicyExists = payload => {
	return async dispatch => {
		try {
			dispatch(validatePolicyExists());
			const result = await service.validateEmployerPolicyExists(payload);
			const { data } = result;
			if (data && data.status) {
				dispatch(validatePolicyExistsSuccess(data.status));
			} else {
				dispatch(validatePolicyExistsError(data?.message));
			}
		} catch (err) {
			dispatch(validatePolicyExistsError(err));
		}
	}
};

export const loadPolicies = (payload, userType, pageNo, cancelTokenSource, is_super_hr, type, employer_id) => {
	return async dispatch => {
		try {
			(!pageNo || pageNo === 1) && dispatch(getPolicies());
			const { data } = await service.loadAllPolicies(payload, userType, pageNo, cancelTokenSource, is_super_hr, employer_id);
			if (data.data) {
				dispatch(getPoliciesSuccess(type ? data.data.filter(({ policy_status, end_date }) => {
					if (type === 'active') {
						return policy_status === 'Active' && (new Date(end_date) >= new Date())
					}
					if (type === 'inactive') {
						return policy_status !== 'Active' || (new Date(end_date) < new Date())
					}
					return false
				}) : data.data));
				dispatch(setPageData({
					firstPage: data.current_page + 1,
					lastPage: data.last_page,
				}))
			} else {
				dispatch(getPoliciesError(serializeError(data?.errors || data?.message)));
			}
		} catch (err) {
			// dispatch(getPoliciesError(serializeError(err)));
			console.error(err)
		}
	}
};

export const updateEnrollmentDate = payload => {
	return async dispatch => {
		try {
			dispatch(changeEnrollmentDate());
			const { data, errors } = await service.updateEnrollmentDate(payload);
			if (data && data.status) {
				dispatch(changeEnrollmentDateSuccess({ formData: payload, message: data?.message }));
			} else {
				dispatch(changeEnrollmentDateError(serializeError(errors || data?.message)));
			}
		} catch (err) {
			dispatch(changeEnrollmentDateError(serializeError(err)));
		}
	}
};

export const exportPolicy = payload => {
	return async dispatch => {
		try {
			dispatch(downloadPolicy());
			const { data, errors } = await service.downloadPolicy(payload);
			if (data && data.status) {
				dispatch(downloadPolicySuccess(data?.data?.url));
			} else {
				dispatch(downloadPolicyError(serializeError(errors || data?.message)));
			}
		} catch (err) {
			dispatch(downloadPolicyError(serializeError(err)));
		}
	}
};

export const downloadSampleFile = payload => {
	return async dispatch => {
		try {
			dispatch(downloadSample());
			const { data } = await service.downloadSample(payload);
			if (data && data.status && data.data.length) {
				dispatch(downloadSampleSuccess(data?.data[0].upload_path));
			} else {
				swal('Message', 'No Document Found', 'info')
				dispatch(downloadSampleError(serializeError(null)));
			}
		} catch (err) {
			// dispatch(downloadSampleError(serializeError(err)));
		}
	}
}

export const getSI = payload => {
	return async dispatch => {
		try {
			const { data } = await service.getSI(payload);
			dispatch(setSI({
				SI: [],
				SIType: null
			}));
			if (data && data.data) {
				dispatch(setSI({
					SI: data.data,
					SIType: data.si_type
				}));
			} else {
				// dispatch(ipdError(message))
			}
		} catch (err) {
			console.error(err)
		}
	}
};

export const getRater = payload => {
	return async dispatch => {
		try {
			const { data } = await service.getRater(payload);
			dispatch(setSI({
				SI: [],
				SIType: null
			}));
			if (data.rater_type_id) {
				if (data.rater_type_id !== 3) {
					dispatch(getSI({
						policy_id: payload.policy_id,
						rater_type_id: data.rater_type_id
					}))
				}
				dispatch(setRater({
					Rater: data.data ? data.data : [],
					RaterType: data.rater_type_id
				}));
			} else {
				// dispatch(ipdError(message))
			}
		} catch (err) {
			console.error(err)
		}
	}
};

export const postFeatureData = payload => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.postFeatureData(payload);
			if (data.status) {
				dispatch(success(message));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const getSuminsured = payload => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors, status } = await service.getSuminsured(payload);
			if (status) {
				dispatch(setSuminsured(data.data));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const getFeatures = payload => {
	return async dispatch => {
		try {
			if (payload.status !== "Processing") {
				dispatch(loading());
			}
			const { data, message, errors } = await service.getFeatures({ policy_id: payload.policy_id });
			if (data.status) {
				dispatch(setFeature(data.data));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const deleteFeature = (id) => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.deleteFeature(id);
			if (data.status) {
				dispatch(success(message));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const updateFeature = (id, payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.updateFeature(
				id,
				payload
			);
			if (data.status) {
				dispatch(success(message));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

// comminication-trigger
export const getMasterCommunication = (id) => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.getMasterCommunication(id);
			if (data.status) {
				dispatch(setMasterCommunication(data.data));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const getComminicationTriggers = payload => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.getComminicationTriggers(payload);
			if (data.status) {
				dispatch(setComminicationTriggers(data.data));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const deleteComminicationTriggers = (id, policyid) => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.deleteComminicationTriggers(id, policyid);
			if (data.status) {
				dispatch(success(message));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const createComminicationTriggers = (id, payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.createComminicationTriggers(
				id,
				payload
			);
			if (data.status) {
				dispatch(success(message));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getComminicationTriggersEmployer = payload => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.getComminicationTriggersEmployer(payload);
			if (data.status) {
				dispatch(setComminicationTriggers(data.data));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const deleteComminicationTriggersEmployer = (id) => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.deleteComminicationTriggersEmployer(id);
			if (data.status) {
				dispatch(success(message));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const createComminicationTriggersEmployer = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.createComminicationTriggersEmployer(
				payload
			);
			if (data.status) {
				dispatch(success(message));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};
export async function FetchSumInsured(payload, setSumInsuredDataTwo) {
	try {
		const { data } = await service.fetchSumInsured(payload)
		let temp = data.data[0].suminsured.split(",");
		const a = temp.map((data, i) => {
			return {
				id: (i + 1),
				name: data,
				...data
			}
		})
		setSumInsuredDataTwo(a)

	} catch (err) {
		console.error(err.message);
		// reducerDispatch({ type: "ON_ERROR" });
	}
}

export const getEmployerUserForContactDetails = payload => {
	return async dispatch => {
		try {
			dispatch(loading());
			const { data, message, errors } = await service.getEmployerUserForContactDetails(payload);
			if (data.status) {
				dispatch(setEmployerUserForContactDetails(data.data));
			}
			else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

export const checkEmployerInstallment = (payload, id) => {
	return async dispatch => {
		try {
			const { data/* , message, errors */ } = await service.checkEmployerInstallment(payload);
			if (data.status) {
				dispatch(employerInstallment(data.data.filter((elem) => elem.policy_id !== id)));
			}
			else {
				// dispatch(error(message || errors));
			}
		} catch (err) {
			// dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}


const getSITypeData = (type, data) => {
	let v = "";
	switch (type) {
		case "family_contruct":
			v = data.map((data, i) => {
				return {
					id: (i + 1),
					name: (data)
				}
			})
			break;
		case "flat":

			v = data.map((data, i) => {
				return {
					id: (i + 1),
					name: (data)
				}
			})
			break;
		case "base":

			v = data.map((data, i) => {
				return {
					id: (i + 1),
					name: (data)
				}
			})
			break;
		case "salary":
			v = data.map((data, i) => {
				return {
					id: (i + 1),
					name: (data.no_of_times_of_salary),
					...data
				}
			})
			break;
		case "grade":
			v = data.map((data, i) => {
				return {
					id: data.grade_id,
					name: (data.grade),
					...data
				}
			})
			break;
		case "grade_with_contruct":
			v = data.map((data, i) => {
				return {
					id: data.grade_id,
					name: (data.grade),
					...data
				}
			})
			break;
		case "age":
			v = data.map((data, i) => {
				return {
					id: data.age,
					name: (data.age),
					...data
				}
			})
			break;
		case "designation":
			v = data.map((data, i) => {
				return {
					id: data.designation_id,
					name: (data.designation),
					...data
				}
			})
			break;
		case "designation_with_construct":
			v = data.map((data, i) => {
				return {
					id: data.designation_id,
					name: (data.designation),
					...data
				}
			})
			break;
		case "state":
			v = data.map((data, i) => {
				return {
					id: data.state_id,
					name: (data.state),
					...data
				}
			})
			break;
		case "member":
			v = data.map((data, i) => {
				return {
					id: (i + 1),
					name: (data)
				}
			})
			break;
		default: v = ""
	}
	return v
}

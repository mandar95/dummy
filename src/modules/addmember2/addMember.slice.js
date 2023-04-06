import { createSlice } from "@reduxjs/toolkit";
import {
	// getEmployee,
	getPolicySubType,
	getPolicyNumber,
	postMemberData,
	sampleFile,
	addNomineeData,
	sumInsured,
	policies,
	getNominee,
	deleteNominee,
	getPolicyType,
	getPolicyId,
	getEmployeesByPolicy,
	postMemberDataNew
} from "./serviceApi";
import { actionStructre, DateFormate, serializeError } from "../../utils";
// import { nullifyEmployMemberDetails } from "modules/dashboard/Dashboard.slice";

export const addMember = createSlice({
	name: "addMember",
	initialState: {
		PolicySubTypeDataResponse: {},
		PolicyNumberDataResponse: {},
		PostDataResponse: {},
		sampleFileResponse: {},
		postNomineeResponse: {},
		getEmployeeDataResponse: {},
		sumInsuredResponse: {},
		policiesResponse: {},
		employees: [],
		error: null,
		policy: [],
		nomineeList: [],
		success: null,
		policy_type: [],
		policy_id: [],
		employee: [],
		loading: false,
		loading1: false,
	},

	//reducers
	reducers: {
		getEmployeeDetails: (state, action) => {
			state.getEmployeeDataResponse = action.payload;
		},
		getPolicySubTypeDetails: (state, action) => {
			state.PolicySubTypeDataResponse = action.payload;
		},
		getPolicyNumberDetails: (state, action) => {
			state.PolicyNumberDataResponse = action.payload;
		},
		postMember: (state, action) => {
			state.loading1 = false;
			state.PostDataResponse = action.payload;
		},
		sampleFileDetails: (state, action) => {
			state.sampleFileResponse = action.payload;
		},
		addNomineeDetails: (state, action) => {
			state.sampleFileResponse = action.payload;
		},
		sumInsuredDetails: (state, action) => {
			state.sumInsuredResponse = action.payload;
		},
		policiesDetails: (state, action) => {
			state.policiesResponse = action.payload;
		},
		getEmployees: (state, { payload }) => {
			state.employees = payload;
		},
		error: (state, { payload }) => {
			state.error = serializeError(payload);
		},
		clear: (state, { payload }) => {
			state.error = null;
			state.success = null;
			switch (payload) {
				case 'policy-type':
					state.PolicyNumberDataResponse = {};
					state.sumInsuredResponse = {}
					break
				case 'policy-no':
					state.sumInsuredResponse = {}
					break
				default:
			}
		},
		getPolicies: (state, { payload }) => {
			state.policy = payload;
		},
		create_nom: (state, { payload }) => {
			state.success = payload;
		},
		nom_list: (state, { payload }) => {
			state.nomineeList = payload.map((elem) => ({ ...elem, guardian_dob: DateFormate(elem.guardian_dob), nominee_dob: DateFormate(elem.nominee_dob) }));
			state.loading = false;
		},
		success: (state, { payload }) => {
			state.success = payload;
		},
		clearList: (state, { payload }) => {
			state.nomineeList = [];
		},
		policy_type: (state, { payload }) => {
			state.policy_type = payload;
		},
		policy_id: (state, { payload }) => {
			state.policy_id = payload;
		},
		employee: (state, { payload }) => {
			state.employee = payload;
		},
		loading: (state, { payload = true }) => {
			state.loading = payload;
		},
		loading1: (state, { payload = true }) => {
			state.loading1 = payload;
		}
	},
});

export const {
	getEmployeeDetails,
	getPolicySubTypeDetails,
	getPolicyNumberDetails,
	postMember,
	sampleFileDetails,
	addNomineeDetails,
	sumInsuredDetails,
	policiesDetails,
	getEmployees,
	clear,
	error,
	getPolicies,
	create_nom,
	nom_list,
	success,
	clearList,
	policy_type,
	policy_id,
	employee,
	loading,
	loading1
} = addMember.actions;

//Action Creators

// export const getEmployeeData = (data) => {
// 	return async (dispatch) => {
// 		const getEmployeeDataResponse = await getEmployee(data);

// 		if (getEmployeeDataResponse.data) {
// 			dispatch(getEmployeeDetails(getEmployeeDataResponse));
// 		} else {
// 			console.error("employee API failed");
// 		}
// 	};
// };

export const getPolicySubTypeData = (data) => {
	return async (dispatch) => {
		dispatch(clear('policy-type'))
		const PolicySubTypeDataResponse = await getPolicySubType(data);
		if (PolicySubTypeDataResponse.data) {
			dispatch(getPolicySubTypeDetails(PolicySubTypeDataResponse));
		} else {
		}
	};
};

export const getPolicyNumberData = (data, url) => {
	return async (dispatch) => {
		dispatch(clear('policy-no'))
		const PolicyNumberDataResponse = await getPolicyNumber(data, url);
		if (PolicyNumberDataResponse.data) {
			dispatch(getPolicyNumberDetails(PolicyNumberDataResponse));
		} else {
		}
	};
};

export const postMemberDetails = (data, is_new) => {
	return async (dispatch) => {
		try {
			dispatch(loading1(true));
			const PostDataResponse = await (is_new ? postMemberDataNew : postMemberData)(data);

			if (PostDataResponse.data) {
				dispatch(postMember(PostDataResponse));
			} else {
			}
		} catch (error) {
			console.error(error)
		}
	}
};
//
export const getSampleFile = (url) => {
	return async (dispatch) => {
		const sampleFileResponse = await sampleFile(url);

		if (sampleFileResponse.data) {
			dispatch(sampleFileDetails(sampleFileResponse));
		} else {
		}
	};
};

export const postNominee = (data) => {
	return async (dispatch) => {
		const postNomineeResponse = await addNomineeData(data);

		if (postNomineeResponse.data) {
			dispatch(addNomineeDetails(postNomineeResponse));
		} else {
			console.error("addNominee API failed");
		}
	};
};

export const getSumInsured = (data) => {
	return async (dispatch) => {
		const sumInsuredResponse = await sumInsured(data);

		if (sumInsuredResponse?.data) {
			dispatch(sumInsuredDetails(sumInsuredResponse));
		} else {
			console.error("sumInsured API failed");
		}
	};
};

export const policyTypeId = (data) => {
	return async (dispatch) => {
		const policiesResponse = await policies(data);

		if (policiesResponse?.data) {
			dispatch(policiesDetails(policiesResponse));
		} else {
			console.error("policiesResponse API failed");
		}
	};
};

//add nominee
// export const Employees = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			actionStructre(dispatch, getEmployees, error, getEmployee, data);
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

//policy type (add nominee)
export const Policies = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getPolicies, error, policies, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//Nominee CRUD
export const createNominee = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, create_nom, error, addNomineeData, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllNominee = (data) => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			actionStructre(dispatch, nom_list, error, getNominee, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const removeNominee = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, deleteNominee, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

// Get Policy Type

export const loadPolicyType = (payload) => {
	return async dispatch => {
		try {
			dispatch(clear());
			const { data, message, errors } = await getPolicyType(payload);
			if (data.data) {
				dispatch(policy_type(data.data));
			} else {
				dispatch(error(message || errors));
				console.error(message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error(err);
		}
	}
};


// Get Policy Id

export const loadPolicyId = (payload) => {
	return async dispatch => {
		try {
			dispatch(clear());
			const { data, message, errors } = await getPolicyId(payload);
			if (data.data) {
				dispatch(policy_id(data.data));
			} else {
				dispatch(error(message || errors));
				console.error(message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error(err);
		}
	}
};

// Get Employee

export const loadEmployee = (payload) => {
	return async dispatch => {
		try {
			dispatch(clear());
			const { data, message, errors } = await getEmployeesByPolicy(payload);
			if (data.data) {
				dispatch(employee(data.data));
			} else {
				dispatch(error(message || errors));
				console.error(message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error(err);
		}
	}
};

//Selectors
export const selectPostResponse = (state) => state?.addMember?.PostDataResponse;
export const selectPolicySubType = (state) =>
	state?.addMember?.PolicySubTypeDataResponse;
export const selectPolicyNumber = (state) =>
	state?.addMember?.PolicyNumberDataResponse;
export const selectSampleFileResponse = (state) =>
	state?.addMember?.sampleFileResponse;
export const selectEmployeeResponse = (state) =>
	state?.addMember?.getEmployeeDataResponse;
export const selectSumInsured = (state) => state?.addMember?.sumInsuredResponse;
export const selectPolicies = (state) =>
	state?.addMember?.policiesResponse?.data?.data?.filter(
		(elem) =>
			elem?.enrollement_confirmed !== 1 &&
			elem?.enrollement_status === 1 &&
			elem?.policy_sub_type_id <= 3
	);

export default addMember.reducer;

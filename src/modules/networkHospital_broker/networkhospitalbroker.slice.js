import { createSlice } from "@reduxjs/toolkit";
import {
	getEmployerNameData,
	getpolicy,
	getPolicySubtype,
	getState,
	getCity,
	getHospital,
	getContact,
	getByName,
	getByPinCode,
	adminGetBroker,
	getLocation,
	PostNetworkHospitalTPA,
	GetErrorSheetData,
	getUncheckPolicy,
	NetworkHospitalDownload,
} from "./serviceApi";
import { getFirstError, actionStructre, serializeError, DateFormate, downloadFile } from "../../utils";

export const networkhospitalbroker = createSlice({
	name: "networkhospitalbroker",
	initialState: {
		EmployerNameResponse: {},
		getPolicySubtypeDataResponse: {},
		getStateDataResponse: {},
		getCityDataResponse: {},
		getHospitalDataResponse: {},
		getContactDataResponse: {},
		getByNameDataResponse: {},
		getByPinCodeDataResponse: {},
		broker: [],
		getHospLoc: {},
		getLocationData: {},
		alert: null,
		error: null,
		success: null,
		brokers: [],
		employers: [],
		policiesST: [],
		policies: [],
		states: [],
		cities: [],
		Hosp: [],
		ErrorSheetDataTPA: [],
		lastPage: 1,
		firstPage: 1,
		loading: false,
		location: {},
		userLocation: {}
	},

	//reducers
	reducers: {
		getEmployerNameDetails: (state, action) => {
			state.EmployerNameResponse = action.payload;
		},
		getPolicyDetails: (state, action) => {
			state.getPolicyResp = action.payload;
		},
		getPolicySubTypeDetails: (state, action) => {
			state.getPolicySubtypeDataResponse = action.payload;
		},
		getStateDetails: (state, action) => {
			state.getStateDataResponse = action.payload;
		},
		getCityDetails: (state, action) => {
			state.getCityDataResponse = action.payload;
		},
		getHospitalDetails: (state, action) => {
			state.getHospitalDataResponse = action.payload;
		},
		clearHospitalDetails: (state) => {
			state.getHospitalDataResponse = {};
		},
		getContactDetails: (state, action) => {
			state.getContactDataResponse = action.payload;
		},
		getByNameDetails: (state, action) => {
			state.getByNameDataResponse = action.payload;
		},
		getByPinCodeDetails: (state, action) => {
			state.getByPinCodeDataResponse = action.payload;
		},
		broker: (state, { payload }) => {
			state.broker = payload;
		},
		getLocDetails: (state, action) => {
			state.getHospLoc = action.payload;
		},
		getLocData: (state, action) => {
			state.getLocationData = action.payload;
		},
		alertMessage: (state, action) => {
			state.alert = action.payload;
		},
		clearAlertMessage: (state, action) => {
			state.alert = null;
		},
		success: (state, { payload }) => {
			state.loading = null;
			state.error = null;
			state.success = payload;
		},
		error: (state, { payload }) => {
			state.loading = false;
			state.error = serializeError(payload);
			state.success = null;
		},
		clear: (state, { payload }) => {
			state.error = null;
			state.success = null;
		},
		getBrokers: (state, { payload }) => {
			state.brokers = payload;
		},
		getEmployers: (state, { payload }) => {
			state.employers = payload.isNew ? payload.data : [...state.employers, ...payload.data];
			state.loading = false;
		},
		getPoliciesST: (state, { payload }) => {
			state.policiesST = payload;
		},
		getPolicies: (state, { payload }) => {
			state.policies = payload;
		},
		State: (state, { payload }) => {
			state.states = payload;
		},
		City: (state, { payload }) => {
			state.cities = payload;
		},
		Hospital: (state, { payload }) => {
			state.Hosp = payload;
		},
		clearDD: (state, { payload }) => {
			switch (payload) {
				case "broker":
					state.brokers = [];
					break;
				case "employer":
					state.employers = [];
					break;
				case "policyST":
					state.policiesST = [];
					break;
				case "policy":
					state.policies = [];
					break;
				case "state":
					state.states = [];
					break;
				case "city":
					state.cities = [];
					break;
				case "Hosp":
					state.Hosp = [];
					break;
				default:
					break;
			}
		},
		payloadLoading: (state, { payload }) => {
			state.loading = payload;
		},
		location: (state, { payload }) => {
			state.location = payload;
		},
		userLocation: (state, { payload }) => {
			state.userLocation = payload;
		},
		ErrorSheetDataTPA: (state, { payload }) => {
			state.ErrorSheetDataTPA = payload.map((elem) => ({
				...elem,
				uploaded_at: DateFormate(elem.uploaded_at, { type: 'withTime' })
			}));
			state.loading = false
		},
		setPageData: (state, { payload }) => {
			state.firstPage = payload.firstPage;
			state.lastPage = payload.lastPage;
		},
	},
});

export const {
	getPolicyDetails,
	getEmployerNameDetails,
	getPolicySubTypeDetails,
	getStateDetails,
	getCityDetails,
	getHospitalDetails,
	getContactDetails,
	getByNameDetails,
	getByPinCodeDetails,
	getLocDetails,
	broker,
	clearHospitalDetails,
	alertMessage,
	clearAlertMessage,
	getLocData,
	clear,
	success,
	error,
	getEmployers,
	getBrokers,
	getPoliciesST,
	getPolicies,
	State,
	City,
	Hospital,
	location, userLocation,
	clearDD,
	ErrorSheetDataTPA,
	setPageData,
	payloadLoading
} = networkhospitalbroker.actions;

//Action Creator
export const getEmployerName = (payload, pageNo) => {
	return async (dispatch) => {
		const { data } = await getEmployerNameData(payload, pageNo);
		if (data.data) {
			dispatch(getEmployerNameDetails({ data: data.data || [], isNew: !pageNo || pageNo === 1 }));
			dispatch(setPageData({
				firstPage: data.current_page + 1,
				lastPage: data.last_page,
			}))
		} else {
		}
	};
};

export const getPolicySubtypeData = (data) => {
	return async (dispatch) => {
		const getPolicySubtypeDataResponse = await getPolicySubtype(data);
		if (getPolicySubtypeDataResponse?.data) {
			dispatch(getPolicySubTypeDetails(getPolicySubtypeDataResponse));
		} else {
		}
	};
};

export const getStateData = (data) => {
	return async (dispatch) => {
		const getStateDataResponse = await getState(data);
		if (getStateDataResponse?.data) {
			dispatch(getStateDetails(getStateDataResponse));
		} else {
		}
	};
};

export const getCityData = (data) => {
	return async (dispatch) => {
		const getCityDataResponse = await getCity(data);
		if (getCityDataResponse?.data) {
			dispatch(getCityDetails(getCityDataResponse));
		} else {
		}
	};
};

export const getHospitalData = (data) => {
	return async (dispatch) => {
		const getHospitalDataResponse = await getHospital(data);
		if (getHospitalDataResponse?.data) {
			dispatch(getHospitalDetails(getHospitalDataResponse));
		} else {
		}
	};
};

export const getContactData = (data) => {
	return async (dispatch) => {
		const getContactDataResponse = await getContact(data);
		if (getContactDataResponse?.data) {
			dispatch(getContactDetails(getContactDataResponse));
		} else {
		}
	};
};

export const getByNameData = (data) => {
	return async (dispatch) => {
		const getByNameDataResponse = await getByName(data);
		if (getByNameDataResponse?.data) {
			dispatch(getByNameDetails(getByNameDataResponse));
		} else {
		}
	};
};

export const getByPinCodeData = (data) => {
	return async (dispatch) => {
		const getByPinCodeDataResponse = await getByPinCode(data);
		if (getByPinCodeDataResponse?.data) {
			dispatch(getByPinCodeDetails(getByPinCodeDataResponse));
		} else {
		}
	};
};

// Admin Get Broker

export const loadBroker = () => {
	return async (dispatch) => {
		try {
			const { data } = await adminGetBroker();
			if (data.data) {
				dispatch(broker(data.data));
			} else {
			}
		} catch (err) {
			// dispatch(error("Something went wrong"));
		}
	};
};

export const getPolicy = (data) => {
	return async (dispatch) => {
		try {
			const getPolicyResp = await getpolicy(data);
			if (getPolicyResp?.data) {
				dispatch(getPolicyDetails(getPolicyResp));
			} else {
				let error =
					getPolicyResp?.data?.errors && getFirstError(getPolicyResp?.data?.errors);
				error = error
					? error
					: getPolicyResp?.data?.message
						? getPolicyResp?.data?.message
						: "Something went wrong";
				dispatch(alertMessage(error));
			}
		} catch (err) {
			dispatch(alertMessage("Something went wrong"));
		}
	};
};

export const hospitaloc = (data) => {
	return async (dispatch) => {
		try {
			const getHospLoc = await getLocation(data);
			if (getHospLoc?.data) {
				dispatch(getLocDetails(getHospLoc));
			} else {
				let error =
					getHospLoc?.data?.errors && getFirstError(getHospLoc?.data?.errors);
				error = error
					? error
					: getHospLoc?.data?.message
						? getHospLoc?.data?.message
						: "Something went wrong";
				dispatch(alertMessage(error));
			}
		} catch (err) {
			dispatch(alertMessage("Something went wrong"));
		}
	};
};

//slice
//brokers
export const fetchBrokers = (payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await adminGetBroker(payload);
			if (data.data || success) {
				dispatch(getBrokers(data.data || message));
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

//employers
export const fetchEmployers = (payload, pageNo) => {
	return async (dispatch) => {
		try {
			const { data, message, errors } = await getEmployerNameData(payload, pageNo);
			if (data.data) {
				dispatch(getEmployers({ data: data.data || [], isNew: !pageNo || pageNo === 1 }));
				dispatch(setPageData({
					firstPage: data.current_page + 1,
					lastPage: data.last_page,
				}))
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

//policiesST
export const fetchPoliciesST = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getPoliciesST, error, getPolicySubtype, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//policies
export const fetchPolicies = (data, noCheck) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getPolicies, error, noCheck ? getUncheckPolicy : getpolicy, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//state
export const fetchStates = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, State, error, getState, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//City
export const fetchCities = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, City, error, getCity, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//getHospital
export const fetchHosp = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, Hospital, error, getHospital, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//getHospital by Name
export const fetchHospByName = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, Hospital, error, getByName, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//getHospital by Zip-Code
export const fetchHospByZip = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, Hospital, error, getByPinCode, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const postNetworkHospitalTPA = (payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors } = await PostNetworkHospitalTPA(payload);
			if (data.status) {
				dispatch(success(data.data || message));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
			// if (PostDataResponse.data) {
			//   //dispatch(postMember(PostDataResponse));
			// } else {
			// }
		} catch (error) {
			console.error(error)
		}
	};
};

export const getErrorSheetData = (payload) => {
	return async (dispatch) => {
		try {
			//dispatch(loading());
			const { data, message, errors } = await GetErrorSheetData(payload);
			if (data.status) {
				dispatch(ErrorSheetDataTPA(data.data));
			}
			else {
				// dispatch(error(message || errors));
				console.error(message, errors);
			}
		} catch (err) {
			// dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
}
export const networkHospitalDownload = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(payloadLoading(true));
			const { data, message, errors } = await NetworkHospitalDownload(payload);
			if (data.status) {
				dispatch(payloadLoading(false));
				downloadFile(data?.data?.download_report);
			}
			else {
				dispatch(payloadLoading(false));
				dispatch(error(message || errors));
				console.error(message, errors);
			}
		} catch (err) {
			dispatch(payloadLoading(false));
			// dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
}

//Selectors
export const selectEmployerName = (state) =>
	state.networkhospitalbroker?.employers;
export const selectPolicyTypeData = (state) =>
	state.networkhospitalbroker?.getPolicySubtypeDataResponse;
export const selectStateData = (state) =>
	state.networkhospitalbroker?.getStateDataResponse;
export const selectCityData = (state) =>
	state.networkhospitalbroker?.getCityDataResponse;
export const selectHospitalData = (state) =>
	state.networkhospitalbroker?.getHospitalDataResponse;
export const selectContactData = (state) =>
	state.networkhospitalbroker?.getContactDataResponse;
export const selectByNameData = (state) =>
	state.networkhospitalbroker?.getByNameDataResponse;
export const selectByPinCodeData = (state) =>
	state.networkhospitalbroker?.getByPinCodeDataResponse;
export const selectPolicy = (state) =>
	state.networkhospitalbroker?.getPolicyResp;
export const selectLoc = (state) => state.networkhospitalbroker?.getHospLoc;
export default networkhospitalbroker.reducer;

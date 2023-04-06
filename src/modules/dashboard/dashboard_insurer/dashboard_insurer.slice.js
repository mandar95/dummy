import { createSlice } from "@reduxjs/toolkit";
import service from "./serviceApi";
import { serializeError, actionStructre } from "../../../utils";

export const insurerDashSlice = createSlice({
	name: "InsDash",
	initialState: {
		loading: false,
		loading1: false,
		loading2: false,
		loading3: false,
		loading4: false,
		error: null,
		success: null,
		widgets: {},
		policywise: {},
		statuswise: {},
		premiumwise: [],
		activitywise: {},
		visitedCustomer: {},
		documentWise: {}
	},
	reducers: {
		loading: (state) => {
			state.loading = true;
			state.error = null;
			state.success = null;
		},
		loading1: (state) => {
			state.loading1 = true;
			state.error = null;
			state.success = null;
		},
		loading2: (state) => {
			state.loading2 = true;
			state.error = null;
			state.success = null;
		},
		loading3: (state) => {
			state.loading3 = true;
			state.error = null;
			state.success = null;
		},
		loading4: (state) => {
			state.loading4 = true;
			state.error = null;
			state.success = null;
		},
		success: (state, { payload }) => {
			state.loading = null;
			state.success = payload;
		},
		error: (state, { payload }) => {
			state.loading = null;
			state.loading1 = null;
			state.loading2 = null;
			state.loading3 = null;
			state.loading4 = null;
			state.error = serializeError(payload);
		},
		clear: (state, { payload }) => {
			state.error = null;
			state.success = null;
			switch (payload) {
				default:
					break;
			}
		},
		widgets: (state, { payload }) => {
			state.widgets = payload;
			state.loading = null;
		},
		policywise: (state, { payload }) => {
			state.policywise = payload;
			state.loading1 = null;
		},
		statuswise: (state, { payload }) => {
			state.statuswise = payload;
			state.loading2 = null;
		},
		premiumwise: (state, { payload }) => {
			state.premiumwise = payload;
		},
		activitywise: (state, { payload }) => {
			state.activitywise = payload;
			state.loading3 = null;
		},
		visitedCustomer: (state, { payload }) => {
			state.visitedCustomer = payload;
			state.loading4 = null;
		},
		documentwise: (state, { payload }) => {
			state.documentWise = payload;
			state.loading1 = null;
		},
	},
});

export const {
	loading,
	success,
	error,
	clear,
	widgets,
	policywise,
	statuswise,
	premiumwise,
	activitywise,
	loading1,
	loading2,
	loading3,
	loading4,
	visitedCustomer,
	documentwise
} = insurerDashSlice.actions;


export const getWidgets = (data) => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const FullResp = await service.widgets(data);
			if (FullResp?.data?.status) {
				dispatch(widgets(FullResp?.data));
			} else {
				dispatch(error(FullResp?.message || FullResp?.errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};


export const LoadGraphData = (data) => {
	return async (dispatch) => {
		try {
			dispatch(loading1())
			dispatch(loading2())
			dispatch(loading3())
			dispatch(PolicyWise(data))
			dispatch(StatusWise(data))
			dispatch(ActivityWise(data))

		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	}
}

//policywise
export const PolicyWise = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading1())
			// actionStructre(dispatch, policywise, error, service.policywise, data);
			const { data, message, errors, success: status } = await service.policywise(
				payload
			);
			if (status && data?.data) {
				dispatch(policywise({
					data: data.data,
					theme: data.theme
				}));
			} else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//statuswise
export const StatusWise = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading2())
			//actionStructre(dispatch, statuswise, error, service.statuswise, data);
			const { data, message, errors, success: status } = await service.statuswise(
				payload
			);
			if (status && data?.data) {
				dispatch(statuswise({
					data: data.data,
					theme: data.theme
				}));
			} else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//premiumwise
export const PremiumWise = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, premiumwise, error, service.premiumwise, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//activitywise
export const ActivityWise = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading3())
			//actionStructre(dispatch, activitywise, error, service.activitywise, data);
			const { data, success: status } = await service.activitywise(
				payload
			);
			if (status && data?.data) {
				dispatch(activitywise({
					data: data.data,
					theme: data.theme
				}));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//visitedcutomer
export const GetVisitedCustomer = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading4())
			//actionStructre(dispatch, activitywise, error, service.activitywise, data);
			const { data, success: status } = await service.GetVisitedCustomer(payload);
			if (status) {
				dispatch(visitedCustomer({
					data: data.data,
				}));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
	// try {
	// 	dispatch(loading4())
	// 	actionStructre(dispatch, visitedCustomer, error, service.GetVisitedCustomer);
	// } catch (err) {

	// }
}

//policywise
export const DocumentWise = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading1())
			// actionStructre(dispatch, policywise, error, service.policywise, data);
			const { data, message, errors, success: status } = await service.documentWise(
				payload
			);
			if (status && data?.data) {
				dispatch(documentwise({
					data: data.data,
					theme: data.theme
				}));
			} else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export default insurerDashSlice.reducer;

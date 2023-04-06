import { createSlice } from "@reduxjs/toolkit";
import service from "./serviceApi";
import { serializeError, actionStructre } from "../../../utils";

export const customerDashSlice = createSlice({
	name: "CustDash",
	initialState: {
		loading: false,
		error: null,
		success: null,
		widgets: {},
		searches: [],
		bought: [],
		quotes: [],
		payment_history: [],
		deficiency: null,
		statuswise: {},
		loading1: null,
		loading2: null,
		loading3: null,
		planlist: [],
		memberwise: {}
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
		success: (state, { payload }) => {
			state.loading = null;
			state.success = payload;
		},
		error: (state, { payload }) => {
			state.loading = null;
			state.loading1 = null;
			state.loading2 = null;
			state.loading3 = null;
			state.error = serializeError(payload);
		},
		clear: (state, { payload }) => {
			state.error = null;
			state.success = null;
			switch (payload) {
				case 'deficiency':
					state.deficiency = null
					break;
				default:
					break;
			}
		},
		widgets: (state, { payload }) => {
			state.widgets = payload;
			state.loading = null;
		},
		searches: (state, { payload }) => {
			state.searches = payload;
			state.loading = null;
		},
		bought: (state, { payload }) => {
			state.bought = payload;
			state.loading = null;
		},
		quotes: (state, { payload }) => {
			state.quotes = payload.slice(0, 5);
			state.loading = null;
		},
		payment_history: (state, { payload }) => {
			state.payment_history = payload;
			state.loading = null;
		},
		deficiency: (state, { payload }) => {
			state.deficiency = payload;
		},
		statuswise: (state, { payload }) => {
			state.statuswise = payload;
			state.loading1 = null;
		},
		planlist: (state, { payload }) => {
			state.planlist = payload.map((item, i) => {
				return {
					...item,
					...(item.plan_name === null && { plan_name: `Lead ${(i + 1)}` })
				}
			})
			state.loading3 = null;
		},
		memberwise: (state, { payload }) => {
			state.memberwise = payload;
			state.loading2 = null;
		},
	},
});

export const {
	loading,
	success,
	error,
	clear,
	widgets,
	searches,
	bought,
	quotes,
	payment_history,
	deficiency,
	statuswise,
	loading1,
	loading2,
	loading3,
	planlist,
	memberwise
} = customerDashSlice.actions;


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

export const Searches = (id) => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			actionStructre(dispatch, searches, error, service.searches, id);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const BoughtPolicies = (id) => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			actionStructre(dispatch, bought, error, service.bought, id);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
}

export const quotesSearches = () => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			actionStructre(dispatch, quotes, error, service.quotesSearches);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const loadPaymentHistory = () => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			actionStructre(dispatch, payment_history, error, service.loadPaymentHistory);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const Deficiency = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.deficiency(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(deficiency(message || data.data));
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

//statuswise
export const getPlanList = () => {
	return async (dispatch) => {
		try {
			dispatch(loading3());
			// actionStructre(dispatch, policywise, error, service.policywise, data);
			const { data, message, errors, success: status } = await service.getPlanList(
			);
			if (status && data?.data) {
				dispatch(planlist(data.data));
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
			dispatch(loading1())
			// actionStructre(dispatch, policywise, error, service.policywise, data);
			const { data, message, errors, success: status } = await service.StatusWise(
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

//plan wise
export const MemberWise = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading2())
			// actionStructre(dispatch, policywise, error, service.policywise, data);
			const { data, message, errors, success: status } = await service.MemberWise(
				payload
			);
			if (status && data?.data) {
				dispatch(memberwise({
					data: data?.data,
					theme: data?.theme
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

export default customerDashSlice.reducer;

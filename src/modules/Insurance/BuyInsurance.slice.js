import { createSlice } from "@reduxjs/toolkit";
import service from "./serviceApi";
import { actionStructre, serializeError } from "../../utils";

export const buyInsurance = createSlice({
	name: "buyInsurance",
	initialState: {
		insurance_link: [],
		insurance: [],
		error: null,
		success: null,
		edit: [],
		update: null,
		loading: null
	},

	//reducers
	reducers: {
		loading: (state, { payload }) => {
			state.loading = payload;
			state.error = null;
			state.success = null;
		},
		insurance_link: (state, { payload }) => {
			state.insurance_link = payload;
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
			state.loading = false;
			state.error = null;
			switch (payload) {
				case "update":
					state.update = null;
					break;
				case "success":
					state.success = null;
					break;
				default:
					break;
			}
		},
		insurance: (state, { payload }) => {
			state.insurance = payload;
		},
		edit: (state, { payload }) => {
			state.edit = payload;
		},
		update: (state, { payload }) => {
			state.update = payload;
		},
	},
});

export const {
	insurance_link,
	success,
	error,
	clear,
	insurance,
	edit,
	update,
	loading
} = buyInsurance.actions;

//Action Creator

export const loadInsuranceLink = (id) => {
	return async (dispatch) => {
		try {
			dispatch(loading(true))
			const { data } = await service.getInsuranceLink(id);
			if (data?.data) {
				dispatch(insurance_link(data.data));
				dispatch(loading(false))
			} else {
				console.error("InsuranceLink API failed");
				dispatch(loading(false))
			}
		} catch (err) {
			console.error("InsuranceLink API failed");
		}
	};
};

//get Insurance
export const getInsurance = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, insurance, null, service.getInsurance, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//create Insurance
export const createInsurance = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createInsurance, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//delete Insurance
export const deleteInsurance = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteInsurance, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//edit Insurance
export const editInsurance = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, edit, error, service.editInsurance, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateInsurance = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors } = await service.updateInsurance(id, payload);
			if (data.status) {
				dispatch(update(message));
			} else {
				dispatch(error(message || errors));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export default buyInsurance.reducer;

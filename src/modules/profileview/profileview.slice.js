import { createSlice } from "@reduxjs/toolkit";
import {
	getUserInfo,
	postPersonalData,
	getInsurerInfo,
	state_city,
	updateProfile,
} from "./profileView.service";
import { serializeError, actionStructre } from "utils";

export const profileView = createSlice({
	name: "profileView",
	initialState: {
		profileResponse: {
			profile: {},
			members: [],
		},
		successResponse: {
			status: false,
			message: "",
		},
		errorResponse: {
			error: "",
			errors: [],
			message: "",
		},
		error: null,
		insurer: [],
		statecity: {},
		update: null,
		loading: false
	},

	//reducers
	reducers: {
		loading: (state, { payload = true }) => {
			state.loading = payload;
		},
		getUserProfile: (state, action) => {
			state.profileResponse.profile = action.payload;
			state.profileResponse.members = action.payload.members;
			state.errorResponse.error = "";
			state.errorResponse.errors = [];
			state.errorResponse.message = "";
		},
		setSuccess: (state, action) => {
			state.successResponse.status = action.payload.status;
			state.successResponse.message = action.payload.message;
			state.errorResponse.error = "";
			state.errorResponse.errors = [];
			state.errorResponse.message = "";
		},
		setError: (state, action) => {
			state.errorResponse.error = action.payload;
			state.successResponse.status = false;
			state.successResponse.message = "";
		},
		clearFields: (state, action) => {
			state.successResponse.status = false;
			state.successResponse.message = "";
			state.errorResponse.error = "";
			state.errorResponse.errors = [];
			state.errorResponse.message = "";
		},
		error: (state, { payload }) => {
			state.error = serializeError(payload);
		},
		clr: (state, { payload }) => {
			state.error = null;
			state.success = null;
			switch (payload) {
				case "pincode":
					state.statecity = {};
					break;
				case "update":
					state.update = null;
					break;
				default:
					break;
			}
		},
		success: (state, { payload }) => {
			state.success = payload;
		},
		insurer: (state, { payload }) => {
			state.insurer = payload;
		},
		statecity: (state, { payload }) => {
			state.statecity = payload;
		},
		update: (state, { payload }) => {
			state.update = payload;
		},
	},
});

export const {
	loading,
	getUserProfile,
	setSuccess,
	setError,
	clearFields,
	error,
	clr,
	success,
	insurer,
	statecity,
	update,
} = profileView.actions;

//Action Creators

export const getProfileDetails = ({ id, master_id }) => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const { data } = await getUserInfo(id, master_id);
			if (!!data.data) {
				dispatch(getUserProfile(data.data[0]));
				dispatch(loading(false))
			} else {
				dispatch(loading(false))
				dispatch(setError("API Failed"));
			}
		} catch (error) {
			dispatch(loading(false))
			dispatch(setError(error.message));
		}
	};
};

export const postUserDetails = (data, { id, master_id }) => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const response = await postPersonalData(data);
			if (!!response?.data) {

				dispatch(setSuccess(response.data));
				const { data } = await getUserInfo(id, master_id);
				if (data?.data) {
					dispatch(loading(false))
					dispatch(getUserProfile(data.data[0]));
				}
			}
		} catch (error) {
			dispatch(loading(false))
			dispatch(setError("API Failed!"));
		}
	};
};

export const Insurer = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, insurer, error, getInsurerInfo, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getstatecity = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, statecity, error, state_city, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const Update = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await updateProfile(id, payload);
			if (data.data || success) {
				dispatch(update(message || data.data));
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

export const clear = () => (dispatch) => dispatch(clearFields());

export const profileDetails = (state) => state.profile.profileResponse?.profile;
export const profileMembers = (state) => state.profile.profileResponse?.members;
export const successResponse = (state) => state.profile.successResponse;

export default profileView.reducer;

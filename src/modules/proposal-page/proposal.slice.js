/*
Module: Propsal
User Type: -
Commented By: Salman Ahmed
 */

// import { createSlice } from "@reduxjs/toolkit";
// import service from "./serviceApi";
// import { actionStructre, serializeError } from "../../utils";

// export const proposalSlice = createSlice({
// 	name: "proposal",
// 	initialState: {
// 		loading: false,
// 		error: null,
// 		success: null,
// 		statecity: {},
// 		proposal:{},
// 	    plan_data:{}
// 	},
// 	reducers: {
// 		loading: (state) => {
// 			state.loading = true;
// 			state.error = null;
// 			state.success = null;
// 		},
// 		success: (state, { payload }) => {
// 			state.loading = null;
// 			state.error = null;
// 			state.success = payload;
// 		},
// 		error: (state, { payload }) => {
// 			state.loading = null;
// 			state.error = serializeError(payload);
// 			state.success = payload;
// 		},
// 		clear: (state, { payload }) => {
// 			state.loading = null;
// 			state.error = null;
// 			state.success = null;
// 			switch (payload) {
// 				case "pincode":
// 					state.statecity = {};
// 					break;
// 				default:
// 					break;
// 			}
// 		},
// 		statecity: (state, { payload }) => {
// 			state.statecity = payload;
// 		},
// 		proposal_data: (state, { payload }) => {
// 			state.proposal = payload;
// 		},
// 		plandata: (state, { payload }) => {
// 			state.plan_data = payload;
// 		},
// 	},
// });

// export const {
// 	loading,
// 	success,
// 	error,
// 	clear,
// 	statecity,
// 	proposal_data,
// 	plandata,
// } = proposalSlice.actions;

// export const getstatecity = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			actionStructre(dispatch, statecity, error, service.statecity, data);
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// export const postProposal = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			actionStructre(dispatch, proposal_data, error, service.proposal, data);
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// export default proposalSlice.reducer;

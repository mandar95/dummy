import { createSlice } from "@reduxjs/toolkit";
import service from "./serviceApi";
import {
	// actionStructre,
	serializeError,
} from "../../../utils";

export const paymentGatewaySlice = createSlice({
	name: "payment-gateway",
	initialState: {
		loading: false,
		error: null,
		success: null,
		order: {},
		payment_id: null,
		documentURL: [],
		activate: null,
		purchase:{},
	},
	reducers: {
		loading: (state) => {
			state.loading = true;
			state.error = null;
			state.success = null;
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
			switch (payload) {
				case "activation":
					state.activate = null;
					break;
				case "purchase-plan":
					state.purchase = {};
					break;
				default:
					break;
			}
		},
		order: (state, { payload }) => {
			state.order = payload;
		},
		payment_id: (state, { payload }) => {
			state.payment_id = payload;
		},
		clear_info: (state) => {
			state.order = {};
			state.payment_id = null;
		},
		documentURL: (state, { payload }) => {
			state.documentURL = payload;
			state.loading = false;
		},
		clearDocumentURL: (state) => {
			state.documentURL = null;
		},
		activation: (state, { payload }) => {
			state.activate = payload;
		},
		purchase_plan: (state, { payload }) => {
			state.purchase = payload;
		},
	},
});

export const {
	loading,
	success,
	error,
	clear,
	order,
	payment_id,
	clear_info,
	documentURL,
	clearDocumentURL,
	activation,
	purchase_plan,
} = paymentGatewaySlice.actions;

export const loadOrder = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const { data, message, errors, success: status } = await service.loadOrder(
				payload
			);
			if (status && data.data) {
				dispatch(order(data.data));
				dispatch(payment_id(data.paymentId));
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

// submit Order
export const saveOrder = (payload,rfq) => {
	return async (dispatch) => {
		try {
			const { message, errors, success: status } = await service.saveOrder(
				payload,rfq
			);
			if (status) {
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

export const Activate = (payload) => {
	return async (dispatch) => {
		try {
			const { message, errors, success: status } = await service.activate(payload);
			if (status) {
				dispatch(activation(message));
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

// export const paymentRFQ = (id) => {
//   return async (dispatch) => {
//     try {
//       dispatch(loading());
//       actionStructre(dispatch, order, error, service.paymentRFQ, id)
//     } catch (err) {
//       dispatch(error("Something went wrong"));
//       console.error("Error", err);
//     }
//   };
// }

export const paymentRFQ = (payload) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const { data, message, errors, success: status } = await service.paymentRFQ(
				payload
			);
			if (status && data.data) {
				dispatch(order(data.data));
				dispatch(payment_id(data.paymentId));
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


export default paymentGatewaySlice.reducer;

/*
Module: SAAS
Commented By: Salman Ahmed
 */


// import { createSlice } from "@reduxjs/toolkit";
// import service from "./saas.service";
// import { actionStructre } from "../../utils";

// export const saasSlice = createSlice({
// 	name: "sass",
// 	initialState: {
// 		loading: false,
// 		error: null,
// 		success: null,
// 		modules: [],
// 		policy_types: [],
// 		users_master: [
// 			{ id: 3, name: "Broker", value: 3 },
// 			{ id: 4, name: "Employer", value: 4 },
// 		],
// 		plan_types: [],
// 		plans: [],
// 		plan: {},
// 		plan_modules: { broker: [], employer: [] },
// 		billing_widgets: { data: {}, total_days: 0 },
// 		subscriptions: [],
// 		plan_id: null,
// 		plan_catelogue: [],
// 		plan_update: null,
// 		invoice: "",
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
// 			let message = " ";
// 			if (typeof payload === "string") message = payload;
// 			else if (typeof payload === "object") {
// 				for (const property in payload) {
// 					message = `${message}
// ${payload[property][0]}`;
// 				}
// 			}

// 			state.loading = null;
// 			state.error = message !== " " ? message : "Unable to connect to the server, please check your internet connection.";
// 			state.success = null;
// 		},
// 		clear: (state) => {
// 			state.error = null;
// 			state.success = null;
// 		},
// 		modules: (state, { payload }) => {
// 			state.modules = SortModules(payload);
// 		},
// 		policy_types: (state, { payload }) => {
// 			state.policy_types = payload;
// 		},
// 		plans: (state, { payload }) => {
// 			state.plans = payload;
// 		},
// 		plan: (state, { payload }) => {
// 			state.plan = payload;
// 		},
// 		clear_plan: (state) => {
// 			state.plan = {};
// 		},
// 		getPlanId: (state, { payload }) => {
// 			state.plan_id = payload;
// 		},
// 		clearPlanId: (state, { payload }) => {
// 			state.plan_id = null;
// 		},
// 		PlanCatelogue: (state, { payload }) => {
// 			state.plan_catelogue = payload;
// 		},
// 		PlanUpdate: (state, { payload }) => {
// 			state.plan_update = payload;
// 		},
// 		clearPlanUpdate: (state, { payload }) => {
// 			state.plan_update = null;
// 		},
// 		plan_types: (state, { payload }) => {
// 			state.plan_types = payload;
// 		},
// 		plan_modules: (state, { payload }) => {
// 			state.plan_modules.broker = payload.broker;
// 			state.plan_modules.employer = payload.employer;
// 		},
// 		clear_plan_modules: (state) => {
// 			state.plan_modules = {};
// 		},
// 		billing_widgets: (state, { payload }) => {
// 			state.billing_widgets = payload;
// 		},
// 		subscriptions: (state, { payload }) => {
// 			state.subscriptions = payload;
// 		},
// 		invoice: (state, { payload }) => {
// 			state.invoice = payload?.invoice_url || "";
// 		},
// 	},
// });

// export const {
// 	loading,
// 	success,
// 	error,
// 	clear,
// 	modules,
// 	policy_types,
// 	plans,
// 	plan,
// 	plan_types,
// 	clear_plan,
// 	plan_modules,
// 	clear_plan_modules,
// 	billing_widgets,
// 	subscriptions,
// 	getPlanId,
// 	clearPlanId,
// 	PlanCatelogue,
// 	PlanUpdate,
// 	clearPlanUpdate,
// 	invoice
// } = saasSlice.actions;

// const SortModules = (data) =>
// 	data.reduce((parentFiltered, parent) => {
// 		if (parent.isParent || !parent.isChild) {
// 			const childArray = data.reduce((childFiltered, child) => {
// 				if (
// 					child.isChild &&
// 					(child.parentId === parent.id || child.parent_menu_id === parent.id)
// 				) {
// 					childFiltered.push(child);
// 				}
// 				return childFiltered;
// 			}, []);
// 			parentFiltered.push({
// 				...parent,
// 				child: childArray,
// 			});
// 		}
// 		return parentFiltered;
// 	}, []);

// // Action creator

// // Plans

// // load Options
// export const loadOptions = () => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { data, message, errors } = await service.loadOptions();
// 			if (data.data) {
// 				dispatch(modules(data.data.modules));
// 				dispatch(policy_types(data.data.policy_types));
// 				dispatch(plan_types(data.data.plan_types));
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// // load Plans
// export const loadPlans = () => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { data, message, errors } = await service.loadPlans();
// 			if (data.data) {
// 				dispatch(plans(data.data));
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// // load Plan
// export const loadPlan = (id, modules) => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { data, message, errors } = await service.loadPlan(id);
// 			if (data.plan_details) {
// 				dispatch(plan(data.plan_details[0]));
// 				dispatch(
// 					plan_modules({
// 						broker: data.broker_module_details?.length ? SortModules(data.broker_module_details) : modules,
// 						employer: data.employer_module_details?.length ? SortModules(data.employer_module_details) : modules,
// 					})
// 				);
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// // store Plan
// export const storePlan = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { message, errors, success: status } = await service.storePlan(data);
// 			if (status) {
// 				dispatch(success(message));
// 				dispatch(loadPlans());
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// // update Plan
// export const updatePlan = (data, id) => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { message, errors, success: status } = await service.updatePlan(
// 				data,
// 				id
// 			);
// 			if (status) {
// 				dispatch(success(message));
// 				dispatch(loadPlans());
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// // delete Plan
// export const deletePlan = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { message, errors, success: status } = await service.deletePlan(data);
// 			if (status) {
// 				dispatch(success(message));
// 				dispatch(loadPlans());
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// // Billing
// // load Billing Widgets
// export const loadBillingWidgets = () => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { data, message, errors } = await service.loadBillingWidgets();
// 			if (data.data) {
// 				dispatch(billing_widgets(data));
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// // load Subscriptions
// export const loadSubscriptions = () => {
// 	return async (dispatch) => {
// 		try {
// 			dispatch(loading());
// 			const { data, message, errors } = await service.loadSubscriptions();
// 			if (data.data) {
// 				dispatch(subscriptions(data.data));
// 			} else {
// 				dispatch(error(message || errors));
// 			}
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// //fetch plans
// export const fetchplans = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			actionStructre(dispatch, PlanCatelogue, error, service.getPlanCatlogue, data);
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// //buy-plans
// export const BuyPlan = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			actionStructre(dispatch, PlanUpdate, error, service.buyPlan, data);
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// //fetch invoice
// export const Invoice = (data) => {
// 	return async (dispatch) => {
// 		try {
// 			actionStructre(dispatch, invoice, error, service.invoice, data);
// 		} catch (err) {
// 			dispatch(error("Something went wrong"));
// 			console.error("Error", err);
// 		}
// 	};
// };

// export default saasSlice.reducer;

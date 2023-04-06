import React, { useEffect } from "react";
import _ from "lodash";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import {
	loadOrder,
	saveOrder,
	clear,
	clear_info,
	Activate,
	paymentRFQ,
} from "./payment-gateway.slice";
// import {
// BuyPlan as PlanPurchase,
// clearPlanUpdate,
// } from "modules/saas/saas.slice";
import { useHistory } from "react-router";
import { reloadPage } from "utils";
import { useQuery } from "../../../utils";

const loadRazorpay = (url = "https://checkout.razorpay.com/v1/checkout.js") => {
	return new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = url;
		script.onload = () => {
			resolve(true);
		};
		script.onerror = () => {
			resolve(false);
		};
		document.body.appendChild(script);
	});
};

if (document.domain === "localhost") {
	// develoment
} else {
	//production
}

const PaymentGateway = (props) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const { location } = props;
	const query = useQuery(location.search);

	const { order, success, error, payment_id, activate, purchase } = useSelector(
		(state) => state.paymentGateway
	);
	const { currentUser, userType } = useSelector((state) => state.login);
	// const { plan_update } = useSelector((state) => state.saas);

	let type = query.get("type");
	let client_id = query.get("client_id");
	let subscription = query.get("subscription");
	let amount = query.get("amount");
	let plan = query.get("plan");
	let client = query.get("client");
	let enquiry_id = decodeURIComponent(query.get("enquiry_id"));

	//load user
	useEffect(() => {
		if (enquiry_id)
			dispatch(paymentRFQ({ enquiry_id }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//check queries
	useEffect(() => {
		//from billing console
		if (type === "billing-console") {
			if (!(client_id && subscription && plan && amount)) {
				swal("Something went wrong", "", "warning").then(() =>
					history.replace("/billing-console")
				);
			}
		}
		//from landing page
		if (type === "landing-page") {
			if (!(client_id && subscription && plan && amount && client)) {
				swal("Something went wrong", "", "warning").then(() => history.replace("/home"));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	//data check (type - billing console)
	useEffect(() => {
		if (_.isEmpty(purchase) && type === "billing-console") {
			reloadPage("/billing-console");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [purchase]);

	// load order
	useEffect(() => {
		if (client_id && subscription && amount) {
			dispatch(
				loadOrder({
					client_id:
						client_id ||
						(userType === "Broker"
							? currentUser?.broker_id
							: currentUser?.employer_id),
					amount: amount * 100,
					subscription_type: subscription,
					plan_id: plan,
				})
			);
		}
		if (enquiry_id) {

		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// onSuccess || onError
	useEffect(() => {
		if (success) {
			dispatch(clear_info());
			if (type === "landing-page") {
				dispatch(Activate({ client_id: client_id, client: client * 1 }));
			}
			// if (type === "billing-console") {
			// 	dispatch(PlanPurchase(purchase));
			// }
			if (enquiry_id) {
				history.replace(`/rfq-callback-done?enquiry_id=${encodeURIComponent(enquiry_id)}&payment=done`)
			}
		}
		if (error) {
			swal("Alert", error, "warning").then(() => {
				/* type === "billing-console"
					? reloadPage(`/billing-console`)
					: */ reloadPage(`/home`);
			});
		}

		return () => {
			dispatch(clear());
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, error]);

	// //billing-console plan-purchase success and clear
	// useEffect(() => {
	// 	if (plan_update) {
	// 		if (type === "billing-console") {
	// 			swal(plan_update, "", "success").then(() => {
	// 				reloadPage(`/billing-console`);
	// 			});
	// 		}
	// 	}

	// 	return () => {
	// 		dispatch(clearPlanUpdate());
	// 		// dispatch(clear("purchase-plan"));
	// 	};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [plan_update]);

	//Activation success (landing-page)
	useEffect(() => {
		if (activate) {
			swal("Activation successful", "", "success").then(() => {
				type === "billing-console"
					? reloadPage(`/billing-console`)
					: reloadPage(`/login`);
			});
			return () => {
				dispatch(clear("activation"));
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activate]);

	// display RazorPay
	useEffect(() => {
		if (order && payment_id) displayRazorpay();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [order, payment_id]);

	const displayRazorpay = async () => {
		const result = await loadRazorpay(
			"https://checkout.razorpay.com/v1/checkout.js"
		);

		if (!result) {
			swal("Razorpay SDK failed to load. Are you online?", "", "info");
			return;
		}

		const options = {
			key: process.env.REACT_APP_KEY_ID_RAZORPAY_TEST, // Enter the Key ID generated from the Dashboard
			amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			currency: "INR",
			name: "Employee benefits",
			description:
				"A comprehensive solution which can help manage employee benefits with ease",
			image: "",
			order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
			handler: function (response) {
				dispatch(
					saveOrder({ ...response, order_id: order.id, payment_id: payment_id }, enquiry_id)
				);
			},
			modal: {
				ondismiss: function () {
					swal(
						"Redirecting",
						`Payment Failed! Redirecting to ${type === "billing-console" ? `billing console` : "home"
						}`,
						"info"
					).then(() => {
						type === "billing-console"
							? reloadPage(`/billing-console`)
							: reloadPage(`/home`);
					});
				},
			},
			prefill: {
				email: currentUser?.email || "",
				contact: currentUser?.mobile_no || "",
			},
			notes: {
				address: "Address Here",
			},
			theme: {
				color: "#45b4d9",
			},
		};
		let paymentObject = new window.Razorpay(options);
		paymentObject.on("payment.failed", function ({ error }) {
			console.table(error);
			dispatch(saveOrder({ order_id: order.id, payment_id: payment_id }, enquiry_id));
			swal("Alert", error.description, "warning").then(() => {
				type === "billing-console"
					? reloadPage(`/billing-console`)
					: reloadPage(`/home`);
			});
		});
		paymentObject.open();
		// e.preventDefault();
	};

	return <></>;
};
export default PaymentGateway;


/*
Module: Buy Plan
User Type: Admin
Commented By: Salman Ahmed
 */

// import React, { useEffect, useState } from "react";
// import { Row, Col, Button, Card } from "react-bootstrap";
// import { Button as Btn } from "../../../../components";
// import OptionModal from "./option-modal";
// import { useHistory } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
// 	fetchplans,
// 	clear,
// 	loadBillingWidgets,
// 	getPlanId,
// 	clearPlanId,
// } from "../../saas.slice";
// import swal from "sweetalert";
// import _ from "lodash";
// import { purchase_plan } from "modules/saas/payment-gateway/payment-gateway.slice";

// const BuyPlan = (props) => {
// 	const history = useHistory();
// 	let dispatch = useDispatch();

// 	const {
// 		billing_widgets: { data },
// 		plan_id,
// 		plan_catelogue,
// 		error,
// 	} = useSelector((state) => state.saas);
// 	const { currentUser, userType } = useSelector((state) => state.login);
// 	const [modalShow, setModalShow] = useState(false);
// 	const [elemState, setElemState] = useState({});
// 	/*-----------------query selector ----------------*/

// 	useEffect(() => {
// 		dispatch(loadBillingWidgets());
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []);

// 	//get plan id
// 	useEffect(() => {
// 		if (data.pan_id) {
// 			dispatch(getPlanId(data.pan_id));
// 		} else {
// 			dispatch(clearPlanId());
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [data.pan_id]);

// 	useEffect(() => {
// 		if (plan_id && !_.isEmpty(currentUser)) {
// 			dispatch(
// 				fetchplans({
// 					plan_id: plan_id,
// 					client_id:
// 						userType === "Broker" ? currentUser?.broker_id : currentUser?.employer_id,
// 				})
// 			);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [plan_id, currentUser]);

// 	/*--------x--------query selector --------x-------*/

// 	/*-----------------error handling ----------------*/
// 	useEffect(() => {
// 		dispatch(clear());
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []);

// 	useEffect(() => {
// 		if (error) {
// 			swal("Alert", error, "warning").then(() => {
// 				history.push("/billing-console");
// 			});
// 		}

// 		return () => {
// 			dispatch(clear());
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [error]);
// 	/*----------x------error handling ----------x-----*/

// 	/*--------------------UI-Elements-----------------*/
// 	//Table Row
// 	const TableRow = (type, update, upgrade, border) => (
// 		<Row
// 			className="p-0 mx-0 mb-2 w-100"
// 			style={{ borderBottom: border ? "0.2px dashed black" : "" }}
// 		>
// 			<Col
// 				xs="4"
// 				sm="4"
// 				md="4"
// 				lg="4"
// 				xl="4"
// 				className="p-0 m-0 w-100 text-center"
// 			>
// 				<h6>{type}</h6>
// 			</Col>
// 			<Col
// 				xs="4"
// 				sm="4"
// 				md="4"
// 				lg="4"
// 				xl="4"
// 				className="p-0 m-0 w-100 text-center"
// 			>
// 				<h6>{update}</h6>
// 			</Col>
// 			<Col
// 				xs="4"
// 				sm="4"
// 				md="4"
// 				lg="4"
// 				xl="4"
// 				className="p-0 m-0 w-100 text-center"
// 			>
// 				<h6>{upgrade}</h6>
// 			</Col>
// 		</Row>
// 	);
// 	/*-------x------------UI-Elements--------x--------*/

// 	const onBack = () => {
// 		history.push("/billing-console");
// 	};

// 	const buyNow = (elem) => {
// 		setElemState(elem);
// 		setModalShow(true);
// 	};

// 	const onSubmit = ({ subs_type, Type }) => {
// 		if (
// 			!_.isEmpty(elemState) &&
// 			subs_type &&
// 			(currentUser?.broker_id || currentUser?.employer_id)
// 		) {
// 			setModalShow(false);
// 			let request = {
// 				client_id:
// 					userType === "Broker" ? currentUser?.broker_id : currentUser?.employer_id,
// 				plan_id: elemState?.id,
// 				subscription_type: subs_type * 1,
// 				update_key: Type * 1,
// 			};
// 			switch (subs_type * 1) {
// 				case 1:
// 					request = {
// 						...request,
// 						amount:
// 							request?.update_key === 1
// 								? elemState?.monthly_price
// 								: elemState?.upgarde_monthly_price,
// 					};
// 					break;
// 				case 3:
// 					request = {
// 						...request,
// 						amount:
// 							request?.update_key === 1
// 								? elemState?.quaterly_price
// 								: elemState?.upgrade_quaterly_price,
// 					};
// 					break;
// 				case 6:
// 					request = {
// 						...request,
// 						amount:
// 							request?.update_key === 1
// 								? elemState?.half_yearly_price
// 								: elemState?.upgrade_half_yearly_price,
// 					};
// 					break;
// 				case 12:
// 					request = {
// 						...request,
// 						amount:
// 							request?.update_key === 1
// 								? elemState?.yearly_price
// 								: elemState?.upgrade_yearly_price,
// 					};
// 					break;
// 				default:
// 					request = {
// 						...request,
// 						amount:
// 							request?.update_key === 1
// 								? elemState?.yearly_price
// 								: elemState?.upgrade_yearly_price,
// 					};
// 					break;
// 			}
// 			if (request?.amount && request?.plan_id && request?.client_id) {
// 				dispatch(purchase_plan(request));
// 				history.push(
// 					`/payment-gateway?type=billing-console&subscription=${request?.subscription_type}&client_id=${request?.client_id}&amount=${request?.amount}&plan=${request?.plan_id}`
// 				);
// 			} else {
// 				swal("Selection not available", "", "warning");
// 			}
// 		}
// 	};

// 	return (
// 		<>
// 			<Row className="p-2 m-2">
// 				<Col sm="12" md="12" lg="12" xl="12" className="my-4">
// 					<Button onClick={onBack}>{"<- Back"}</Button>
// 					<h3 className="text-center my-2">Plan Catelogue</h3>
// 				</Col>
// 				{plan_catelogue.map((elem, index) => (
// 					<Col key={'catelogue' + index} sm="12" md="6" lg="4" xl="4" className="p-3">
// 						<Card>
// 							<Card.Body
// 								className="text-center"
// 								style={{
// 									minHeight: "250px",
// 									maxHeight: "250px",
// 									overflow: "auto",
// 									background: elem?.hex2 || "white",
// 									color: elem?.hex1 || "black",
// 								}}
// 							>
// 								<Card.Title>
// 									{elem?.name || "Plan"}
// 								</Card.Title>
// 								<Card.Text>{elem?.tagline || "N/A"}</Card.Text>
// 								<Card.Text>{elem?.description || "N/A"}</Card.Text>
// 							</Card.Body>
// 							<Card.Body
// 								style={{
// 									borderTop: "1px solid rgba(0,0,0,.125)",
// 									minHeight: "200px",
// 									maxHeight: "200px",
// 									overflow: "auto",
// 								}}
// 							>
// 								<Card.Title className="text-center">Features</Card.Title>
// 								<Card.Text>
// 									{!_.isEmpty(elem?.feature) &&
// 										elem?.feature.map((item, index) => (
// 											<div key={'feature' + index} className="w-100">
// 												<p>
// 													<i className="fa fa-dot-circle-o"></i>
// 													{"  "}
// 													{item?.name || "N/A"}
// 													<p style={{ float: "right" }}>
// 														<i
// 															className="fa fa-check"
// 															style={{
// 																color: elem?.hex1 || "lightgreen",
// 																border: `0.5px solid ${elem?.hex1 || "lightgreen"}`,
// 															}}
// 														></i>
// 													</p>
// 												</p>
// 											</div>
// 										))}
// 								</Card.Text>
// 							</Card.Body>
// 							<Card.Footer>
// 								{/*Header Row*/}
// 								{TableRow("Period", "Update", "Upgrade", true)}
// 								{/*Monthly Subscription*/}
// 								<h6 className="text-center py-2">Monthly Subscriptions</h6>
// 								{TableRow(
// 									"1 Month",
// 									`${elem?.monthly_price || "N/A"} ₹`,
// 									`${elem?.upgarde_monthly_price || "N/A"} ₹`,
// 									false
// 								)}
// 								{TableRow(
// 									"4 Months",
// 									`${elem?.quaterly_price || "N/A"} ₹`,
// 									`${elem?.upgrade_quaterly_price || "N/A"} ₹`,
// 									true
// 								)}
// 								{/*Semi-annual & Annual Subscription*/}
// 								<h6 className="text-center py-2">
// 									{"Semi-annual & Annual Subscriptions"}
// 								</h6>
// 								{TableRow(
// 									"6 Months",
// 									`${elem?.half_yearly_price || "N/A"} ₹`,
// 									`${elem?.upgrade_half_yearly_price || "N/A"} ₹`,
// 									false
// 								)}
// 								{TableRow(
// 									" 1 Year",
// 									`${elem?.yearly_price || "N/A"} ₹`,
// 									`${elem?.upgrade_yearly_price || "N/A"} ₹`,
// 									true
// 								)}
// 								<Col sm="12" md="12" lg="12" xl="12" className="my-2 py-2 text-center">
// 									<Btn
// 										buttonStyle="outline-solid"
// 										hex1={elem?.hex1 || "#009933"}
// 										hex2={elem?.hex2 || "#99ff99"}
// 										style={{
// 											boxShadow: "0 6.7px 5.3px rgba(0, 0, 0, 0.048)",
// 											width: "70%",
// 										}}
// 										onClick={() => buyNow(elem)}
// 									>
// 										Buy Now
// 									</Btn>
// 								</Col>
// 							</Card.Footer>
// 						</Card>
// 					</Col>
// 				))}
// 			</Row>
// 			<OptionModal
// 				show={modalShow}
// 				onHide={() => setModalShow(false)}
// 				onSubmit={onSubmit}
// 			/>
// 		</>
// 	);
// };

// export default BuyPlan;

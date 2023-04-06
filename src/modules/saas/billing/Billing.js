/*
Module: Billing
User Type: Saas User
Commented By: Salman Ahmed
 */

// import React, { useEffect } from "react";
// import _ from "lodash";
// import { Card, IconlessCard } from "../../../components";
// import { Row, Col, Spinner, Button } from "react-bootstrap";
// import { useHistory } from "react-router-dom";
// import { DataTable } from "../../user-management";
// import { Donut } from "./Graph";
// import { Detail } from "./Detail";
// import UserDetails from "./user-details";
// import {
// 	loadBillingWidgets,
// 	loadSubscriptions,
// 	Invoice,
// 	clear,
// } from "../saas.slice";
// import { useDispatch, useSelector } from "react-redux";
// import { SubscriptionColumn } from "../saas.helper";
// import "./style.css";
// // import swal from "sweetalert";


// export const Billing = () => {
// 	const dispatch = useDispatch();
// 	const history = useHistory();
// 	const {
// 		billing_widgets: { data },
// 		subscriptions,
// 		// invoice,
// 		error,
// 	} = useSelector((state) => state.saas);
// 	const { currentUser, userType } = useSelector((state) => state.login);

// 	useEffect(() => {
// 		dispatch(loadBillingWidgets());
// 		dispatch(loadSubscriptions());
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []);

// 	useEffect(() => {
// 		if (data?.pan_id && !_.isEmpty(currentUser)) {
// 			dispatch(
// 				Invoice({
// 					plan_id: data?.pan_id,
// 					client_id:
// 						userType === "Broker" ? currentUser?.broker_id : currentUser?.employer_id,
// 				})
// 			);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [data.pan_id, currentUser]);

// 	//title------------------

// 	/*widget title*/

// 	const title = (
// 		<div className="d-flex w-100">
// 			<p className="p-0 m-0 w-100">Billing Console</p>
// 			<div className="d-flex justify-content-end">
// 				<Button
// 					size="sm"
// 					varient="primary"
// 					onClick={() => history.push(`/buy-plan`)}
// 				>
// 					<p
// 						style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', fontWeight: "600", wordBreak: "keep-all" }}
// 						className="p-0 m-0"
// 					>
// 						Upgrade/Update
// 					</p>
// 				</Button>
// 			</div>
// 		</div>
// 	);

// 	/*billing title*/

// 	// const billingTitle = (
// 	// 	<div className="d-flex w-100">
// 	// 		<p className="p-0 m-0 w-100">Billing Details</p>
// 	// 		<div className="d-flex justify-content-end">
// 	// 			<Button
// 	// 				size="sm"
// 	// 				varient={invoice ? "primary" : "secondary"}
// 	// 				disabled={invoice ? false : true}
// 	// 				onClick={() => {
// 	// 					invoice
// 	// 						? window.open(invoice)
// 	// 						: swal("Invoice not available", "", "warning");
// 	// 				}}
// 	// 			>
// 	// 				<p
// 	// 					style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', fontWeight: "600", wordBreak: "keep-all" }}
// 	// 					className="p-0 m-0"
// 	// 				>
// 	// 					Invoice
// 	// 				</p>
// 	// 			</Button>
// 	// 		</div>
// 	// 	</div>
// 	// );
// 	//-----------------------

// 	//error handling
// 	useEffect(() => {
// 		if (error) {
// 			console.error(error);
// 		}

// 		return () => {
// 			dispatch(clear());
// 		};
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [error]);

// 	return (
// 		<>
// 			{!(_.isEmpty(data) && _.isEmpty(subscriptions)) ? (
// 				<>
// 					<Row className="h-100 w-100">
// 						<Col xl="5" lg="5" md="12" sm="12">
// 							<div className="flip-card">
// 								<div className="flip-card-inner">
// 									<div className="flip-card-front">
// 										<IconlessCard
// 											removeBottomHeader={true}
// 											title="Usage Details"
// 											headerStyle={{ textAlign: "center", marginLeft: "-10px" }}
// 										>
// 											<Donut />
// 										</IconlessCard>
// 									</div>
// 									<div className="flip-card-back">
// 										<IconlessCard
// 											removeBottomHeader={false}
// 											title="User Details"
// 											headerStyle={{ textAlign: "center", marginLeft: "-10px" }}
// 										>
// 											<UserDetails />
// 										</IconlessCard>
// 									</div>
// 								</div>
// 							</div>
// 						</Col>
// 						<Col
// 							xl="7"
// 							lg="7"
// 							md="12"
// 							sm="12"
// 							className="d-flex align-items-center justify-content-center px-lg-0 px-xl-0"
// 							style={{ minHeight: "500px" }}
// 						>
// 							<Card title={title}>
// 								<Detail data={data} />
// 							</Card>
// 						</Col>
// 					</Row>
// 					<Card title={"Billing Details"}>
// 						<DataTable
// 							noStatus
// 							columns={SubscriptionColumn()}
// 							data={subscriptions}
// 							rowStyle
// 						// AIstatus
// 						/>
// 					</Card>
// 				</>
// 			) : (
// 				<Spinner
// 					style={{
// 						position: "absolute",
// 						top: "50%",
// 						left: "50%",
// 					}}
// 					animation="border"
// 					role="status"
// 				>
// 					<span className="sr-only">Loading...</span>
// 				</Spinner>
// 			)}
// 		</>
// 	);
// };

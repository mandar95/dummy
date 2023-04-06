import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
// import _ from "lodash";

const RateChart = (props) => {
	/*--------------------UI-Elements-----------------*/
	//Table Row
	const TableRow = (type, price, border) => (
		<Row
			className="p-0 mx-0 mb-2 w-100"
			style={{ borderBottom: border ? "0.2px dashed black" : "" }}
		>
			<Col
				xs="6"
				sm="6"
				md="6"
				lg="6"
				xl="6"
				className="p-0 m-0 w-100 text-center"
			>
				<h6>{type}</h6>
			</Col>
			<Col
				xs="6"
				sm="6"
				md="6"
				lg="6"
				xl="6"
				className="p-0 m-0 w-100 text-center"
			>
				<h6>{price}</h6>
			</Col>
		</Row>
	);
	/*-------x------------UI-Elements--------x--------*/

	const Data = {
		monthly_price: props?.data?.monthly_price || "N/A",
		quaterly_price: props?.data?.quaterly_price || "N/A",
		half_yearly_price: props?.data?.half_yearly_price || "N/A",
		yearly_price: props?.data?.yearly_price || "N/A",
	};

	return (
		<Modal
			{...props}
			size="xl"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Rate Chart</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className="p-2 mt-2 mr-2 ml-2 mb-4" >
					<h5
						className="text-center w-100 mb-2 pb-4"
						style={{
							borderBottom: "0.2px dashed black",
							textAlign: "center",
							fontWeight: "650",
						}}
					>
						Subscriptions
					</h5>
					{/*Header Row*/}
					{TableRow("Period", "Update", "Upgrade", true)}
					{/*Monthly Subscription*/}
					<h6 className="text-center py-2 w-100">Monthly Subscriptions</h6>
					{TableRow("1 Month", `${Data?.monthly_price || "N/A"} ₹`, false)}
					{TableRow("4 Months", `${Data?.quaterly_price || "N/A"} ₹`, true)}
					{/*Semi-annual & Annual Subscription*/}
					<h6 className="text-center py-2 w-100">
						{"Semi-annual & Annual Subscriptions"}
					</h6>
					{TableRow("6 Months", `${Data?.half_yearly_price || "N/A"} ₹`, false)}
					{TableRow(" 1 Year", `${Data?.yearly_price || "N/A"} ₹`, true)}
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button buttonStyle="danger" onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RateChart;

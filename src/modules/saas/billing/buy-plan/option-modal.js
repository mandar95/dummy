/*
Module: Buy Plan
User Type: Admin
Commented By: Salman Ahmed
 */

// import React from "react";
// import { Modal, Button, Row, Col, Form } from "react-bootstrap";
// import { useForm } from "react-hook-form";
// import { CustomControl } from "../../../user-management/AssignRole/option/style";
// import { Head } from "../../../../components";
// const OptionModal = (props) => {
// 	const { register, handleSubmit } = useForm();

// 	return (
// 		<Modal
// 			{...props}
// 			size="md"
// 			aria-labelledby="contained-modal-title-vcenter"
// 			dialogClassName="my-modal"
// 		>
// 			<Form onSubmit={handleSubmit(props.onSubmit)}>
// 				<Modal.Header closeButton>
// 					<Modal.Title id="contained-modal-title-vcenter">
// 						Select Subscription
// 					</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<Row>
// 						<Col sm="12" md="12" lg="12" xl="12">
// 							<Head className="text-center">Select action type</Head>
// 							<div
// 								className="d-flex justify-content-around flex-wrap mt-2"
// 								style={{ margin: "0 39px 40px -12px" }}
// 							>
// 								<CustomControl className="d-flex mt-4 mr-0">
// 									<p
// 										style={{
// 											fontWeight: "600",
// 											paddingLeft: "27px",
// 											marginBottom: "0px",
// 										}}
// 									>
// 										{"Upgrade"}
// 									</p>
// 									<input
// 										ref={register}
// 										name={"Type"}
// 										type={"radio"}
// 										value={2}
// 										defaultChecked={true}
// 									/>
// 									<span></span>
// 								</CustomControl>
// 								<CustomControl className="d-flex mt-4 ml-0">
// 									<p
// 										style={{
// 											fontWeight: "600",
// 											paddingLeft: "27px",
// 											marginBottom: "0px",
// 										}}
// 									>
// 										{"Update"}
// 									</p>
// 									<input ref={register} name={"Type"} type={"radio"} value={1} />
// 									<span></span>
// 								</CustomControl>
// 							</div>
// 						</Col>
// 						<Col sm="12" md="12" lg="12" xl="12">
// 							<CustomControl className="d-flex mt-4 mr-0">
// 								<p
// 									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
// 								>
// 									{"Monthly Plan"}
// 								</p>
// 								<input
// 									ref={register}
// 									name={"subs_type"}
// 									type={"radio"}
// 									value={1}
// 									defaultChecked={true}
// 								/>
// 								<span></span>
// 							</CustomControl>
// 						</Col>
// 						<Col sm="12" md="12" lg="12" xl="12">
// 							<CustomControl className="d-flex mt-4 mr-0">
// 								<p
// 									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
// 								>
// 									{"Quarterly Plan"}
// 								</p>
// 								<input ref={register} name={"subs_type"} type={"radio"} value={3} />
// 								<span></span>
// 							</CustomControl>
// 						</Col>
// 						<Col sm="12" md="12" lg="12" xl="12">
// 							<CustomControl className="d-flex mt-4 mr-0">
// 								<p
// 									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
// 								>
// 									{"Semi-Annual Plan"}
// 								</p>
// 								<input ref={register} name={"subs_type"} type={"radio"} value={6} />
// 								<span></span>
// 							</CustomControl>
// 						</Col>
// 						<Col sm="12" md="12" lg="12" xl="12">
// 							<CustomControl className="d-flex mt-4 mr-0">
// 								<p
// 									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
// 								>
// 									{"Annual Plan"}
// 								</p>
// 								<input ref={register} name={"subs_type"} type={"radio"} value={12} />
// 								<span></span>
// 							</CustomControl>
// 						</Col>
// 					</Row>
// 				</Modal.Body>
// 				<Modal.Footer>
// 					<Button onClick={props.onHide}>Close</Button>
// 					<Button type="submit">Proceed</Button>
// 				</Modal.Footer>
// 			</Form>
// 		</Modal>
// 	);
// };
// export default OptionModal;

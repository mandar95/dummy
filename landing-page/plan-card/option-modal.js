import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CustomControl } from "modules/user-management/AssignRole/option/style";
const OptionModal = (props) => {
	const { register, handleSubmit } = useForm();

	return (
		<Modal
			{...props}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(props.onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Select Subscription
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col sm="12" md="12" lg="12" xl="12">
							<CustomControl className="d-flex mt-4 mr-0">
								<p
									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
								>
									{"Monthly Plan"}
								</p>
								<input
									ref={register}
									name={"subs_type"}
									type={"radio"}
									value={1}
									defaultChecked={true}
								/>
								<span></span>
							</CustomControl>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12">
							<CustomControl className="d-flex mt-4 mr-0">
								<p
									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
								>
									{"Quarterly Plan"}
								</p>
								<input ref={register} name={"subs_type"} type={"radio"} value={4} />
								<span></span>
							</CustomControl>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12">
							<CustomControl className="d-flex mt-4 mr-0">
								<p
									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
								>
									{"Semi-Annual Plan"}
								</p>
								<input ref={register} name={"subs_type"} type={"radio"} value={6} />
								<span></span>
							</CustomControl>
						</Col>
						<Col sm="12" md="12" lg="12" xl="12">
							<CustomControl className="d-flex mt-4 mr-0 mb-4">
								<p
									style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}
								>
									{"Annual Plan"}
								</p>
								<input ref={register} name={"subs_type"} type={"radio"} value={12} />
								<span></span>
							</CustomControl>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={props.onHide}>Close</Button>
					<Button type="submit">Proceed</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
export default OptionModal;

import React, { useState } from "react";
import { CompactCard } from "components";
import { Row, Col, Button } from "react-bootstrap";
// import Modal from "./Modal";
import _ from "lodash";
import { useSelector } from "react-redux";

const Feature = ({ data, register, setValue, watch }) => {
	// const [show, setShow] = useState(false);
	const [enable, setEnable] = useState(false);
	const [selected, setSelected] = useState([]);
	const [getPremium, setPremium] = useState(
		data?.type === "pre_post" ? [] : [0, 0, 0, 0]
	);
	const { globalTheme } = useSelector(state => state.theme)
	/*---------------------------card titles------------------------*/
	//Card Title Function
	const titleFn = (header) => (
		<div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
			<label style={{ width: "100%" }}>{header || "N/A"}</label>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					size="sm"
					style={{ border: "none", maxHeight: "35.71px" }}
					onClick={() => {
						enable ? setEnable(false) : setEnable(true);
					}}
					variant={enable ? "danger" : "primary"}
				>
					<i style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}>
						{enable ? <i className="fa fa-times"></i> : <i className="fa fa-plus"></i>}
					</i>
				</Button>
			</div>
		</div>
	);

	//pre-post multi selection
	const PrePost = (index, inputName, premium) => {
		//ninja technique
		let valueCheck = selected.filter((item) => item === index);
		if (data?.type === "room_type") {
			if (!_.isEmpty(valueCheck)) {
				setSelected(_.without(selected, index));
				//substraction
				let CalcPre = getPremium;
				CalcPre[index] = 0;
				setValue(`${data?.product_feature_id}.days`, CalcPre);
				setPremium(CalcPre);
			} else {
				let r = [...selected, index];
				setSelected(r);
				//addition
				let CalcPre = getPremium;
				CalcPre[index] = premium;
				setValue(`${data?.product_feature_id}.days`, CalcPre);
				setPremium(CalcPre);
			}
		} else {
			if (!_.isEmpty(valueCheck)) {
				setSelected([]);
				//substraction
				setValue(`${data?.product_feature_id}.days`, `0,0`);
			} else {
				let r = [0, 1];
				setSelected(r);
				// let CalcPre = getPremium;

				setValue(
					`${data?.product_feature_id}.days`,
					`${data?.data?.pre},${data?.data?.post}`
				);
			}
		}
	};

	return (
		(data?.type === "room_type" || data?.type === "pre_post") && (
			<Col className="pb-4">
				<div className="mt-4">
					{/* <Row>
								<Col sm="10" md="12" lg="12" xl="12">
									<h2 style={{ fontWeight: "600" }}>
										{data?.product_feature_name || "N/A"}
									</h2>
								</Col>
							</Row> */}
					<CompactCard
						removeBottomHeader={enable ? false : true}
						title={titleFn(data?.product_feature_name || "N/A")}
					>
						{enable && (
							<Row>
								<Col sm="12" md="12" lg="12" xl="12">
									<div style={{ marginTop: "-20px" }}>
										{/* {<h5>{data?.product_feature_name || "N/A"}</h5>} */}
										{!!data?.content && (
											<p style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', borderTop: "0.2px black solid" }}>
												{data?.content || "No content available"}
											</p>
										)}
										{!_.isEmpty(data?.data) &&
											Object.keys(data?.data)?.map((item, index) => {
												return (
													<div
														key={'room-rent' + index}
														className="d-flex pt-2 w-100"
														style={{ borderTop: "0.2px black solid" }}
													>
														<Col
															xs="10"
															sm="10"
															md="10"
															lg="10"
															xl="10"
															className="p-0 m-0"
														>
															<p style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
																{data?.type === "pre_post"
																	? `${item}-hospitalization ${data?.data[`${item}`] || "N/A"
																	} days`
																	: `Premium for ${_.capitalize(
																		item.replace("_", " ")
																	)} :- ₹ ${data?.data[`${item}`] || "N/A"}`}
															</p>
														</Col>
														<Col
															xs="2"
															sm="2"
															md="2"
															lg="2"
															xl="2"
															className="p-0 m-0"
															style={{ textAlign: "right" }}
														>
															<Button
																size="sm"
																disabled={enable ? false : true}
																variant={
																	enable
																		? selected.includes(index)
																			? "primary"
																			: "secondary"
																		: "secondary"
																}
																onClick={() => {
																	data.type === "pre_post"
																		? PrePost(
																			index,
																			`${data?.product_feature_id}.days`,
																			data?.data[`${item}` || 0]
																		)
																		: PrePost(
																			index,
																			`${data?.product_feature_id}.days`,
																			data?.data[`${item}` || 0]
																		);
																}}
															>
																{enable ? (
																	selected.includes(index) ? (
																		<i className="fa fa-check"></i>
																	) : (
																		"Select"
																	)
																) : (
																	"Select"
																)}
															</Button>
														</Col>
													</div>
												);
											})}
										{enable && (
											<>
												<input
													type="hidden"
													ref={register}
													name={`${data?.product_feature_id}.days`}
												/>
												<input
													type="hidden"
													ref={register}
													name={`${data?.product_feature_id}.type`}
													value={data?.type}
												/>
											</>
										)}
									</div>
								</Col>
							</Row>
						)}
					</CompactCard>
				</div>
			</Col>
		)
	);
};

export default Feature;

import React, { useState } from "react";
import { CompactCard } from "components";
import { Row, Col, Button } from "react-bootstrap";
// import Modal from "./Modal";
import _ from "lodash";
import { useSelector } from "react-redux";

const Feature = ({ data, register, setValue, watch }) => {
	// const [show, setShow] = useState(false);
	const [enable, setEnable] = useState(false);
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

	return (
		data?.type === "table" && (
			<Col className="pb-4">
				<div className="mt-4">
					<Row>
						{/* <Col sm="10" md="12" lg="12" xl="12">
									<h2 style={{ fontWeight: "600" }}>
										{data?.product_feature_name || "N/A"}
									</h2>
								</Col> */}
					</Row>
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
											data?.data?.map(({ sumInsured, premium }, index) => {
												return (
													<div
														key={'sksk5' + index}
														className="d-flex pt-2 w-100"
														style={{
															borderTop: "0.2px black solid",
														}}
													>
														<Col xs="5" sm="5" md="5" lg="5" xl="5" className="p-0 m-0">
															<p style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>{`SI :- ${sumInsured || "N/A"
																}`}</p>
														</Col>
														<Col xs="5" sm="5" md="5" lg="5" xl="5" className="p-0 m-0">
															<p style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>{`Premium :- ${premium || "N/A"
																}`}</p>
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
																		? premium === watch(`${data?.product_feature_id}.premium`)
																			? "primary"
																			: "secondary"
																		: "secondary"
																}
																onClick={() => {
																	setValue(`${data?.product_feature_id}.premium`, premium);
																	setValue(
																		`${data?.product_feature_id}.sum_insured`,
																		sumInsured
																	);
																}}
															>
																{enable ? (
																	premium === watch(`${data?.product_feature_id}.premium`) ? (
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
													name={`${data?.product_feature_id}.premium`}
												/>
												<input
													type="hidden"
													ref={register}
													name={`${data?.product_feature_id}.sum_insured`}
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

import React, { useState } from "react";
import { CompactCard } from "components";
import { Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
// import Modal from "./Modal";

const Feature = ({ data, register }) => {
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
		data?.type === "waiver" && (
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
										<div className="d-flex pt-2 w-100">
											<Col xs="10" sm="10" md="10" lg="10" xl="10" className="p-0 m-0">
												<p style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>Wavied Off</p>
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
													disabled
													variant={data?.is_waived_off ? "primary" : "danger"}
												>
													{data?.is_waived_off ? (
														<i className="fa fa-check"></i>
													) : (
														<i className="fa fa-times"></i>
													)}
												</Button>
												{enable && (
													<>
														<input
															type="hidden"
															ref={register}
															name={`${data?.product_feature_id}.premium`}
															value={data?.premium}
														/>
														<input
															type="hidden"
															ref={register}
															name={`${data?.product_feature_id}.sum_insured`}
															value={data?.sum_insured}
														/>
														<input
															type="hidden"
															ref={register}
															name={`${data?.product_feature_id}.type`}
															value={data?.type}
														/>
													</>
												)}
											</Col>
										</div>
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

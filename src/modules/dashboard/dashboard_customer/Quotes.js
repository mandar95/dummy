import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Button } from "components";
import { Row, Col, Badge } from "react-bootstrap";

import Widget from "../../../components/Widget/Widgets";
import _ from "lodash";
import Deficiency from "./Deficiency";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

export const Quotes = ({ quotes }) => {
	const history = useHistory();
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);
	const [data, setData] = useState([]);
	const { globalTheme } = useSelector(state => state.theme)
	const handleOpen = (id) => {
		if (open) {
			open === Number(id) ? setOpen(false) : setOpen(Number(id));
		} else {
			setOpen(Number(id));
		}
	};

	const customStatus = {
		Won: "success",
		Reject: "danger",
		Lost: "secondary",
		Deficiency: "warning",
		Open: "primary",
		Active: "success",
		Approved: "primary",
	};

	const List = (headings, combinations, data, icons, links) =>
		(!_.isEmpty(headings) ? headings : [])?.map((item, index) =>
			!_.isEmpty(links) ? (
				<div className="p-1" key={"quotes" + index}>
					<a href={links[index] || "/home"} style={{ textDecoration: "none" }}>
						<Widget
							Hex1={combinations[index]?.hex1}
							Hex2={combinations[index]?.hex2}
							Header={item}
							Number={data[`${item}`]}
							Image={icons[index]?.icon}
						/>
					</a>
				</div>
			) : (
				<div className="p-1" key={"quotes" + index}>
					<Widget
						Hex1={combinations[index]?.hex1}
						Hex2={combinations[index]?.hex2}
						Header={item}
						Number={data[`${`${item}`}`]}
						Image={icons[index]?.icon}
					/>
				</div>
			)
		);

	useEffect(() => {
		if (!_.isEmpty(quotes)) {
			setOpen(quotes[0]?.id);
		}
	}, [quotes]);

	return (
		<>
			{
				quotes.map(
					({
						rfq_selected_plan,
						selected_quote,
						selected_plan_features,
						id,
						headings,
						combinations,
						data,
						icons,
						links,
						status,
						rfq_deficiency,
						enquiry_id,
					}) => (
						// true && (
						<Card key={id + 'quotes'}>
							<Col xl={2} lg={3} md={12} sm={12} className="plan-name">
								<img src="/assets/images/cover-img.png" alt="plan logo" />
								<span>
									{rfq_selected_plan?.selected_ic_plan?.policy_sub_type_name || ""}
								</span>
							</Col>
							<Col xl={8} lg={7} md={12} sm={12} className="plan-detail">
								<div className="text-group">
									<p>Plan Name</p>
									<span>
										{rfq_selected_plan?.selected_ic_plan?.name || "Not Selected"}
									</span>
								</div>
								{rfq_selected_plan && (
									<>
										<div className="text-group">
											<p>Sum Insured</p>
											<span>₹ {rfq_selected_plan?.sum_insured}</span>
										</div>
										<div className="text-group">
											<p>Premium</p>
											<span>₹ {rfq_selected_plan?.final_premium}</span>
										</div>
									</>
								)}
								<div className="text-group">
									<p>Status</p>
									<Badge
										size="sm"
										variant={customStatus?.[`${status}`]}
										style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', cursor: "pointer" }}
										onClick={
											status === "Deficiency"
												? () => {
													setShow(id);
													setData(rfq_deficiency);
												}
												: () => { }
										}
									>
										{status}
									</Badge>
								</div>
							</Col>
							<Col xl={2} lg={2} md={12} sm={12} className="buy-button text-center d-flex justify-content-center align-items-center">
								<Button
									className="mr-0"
									buttonStyle="warning"
									disabled={status === "Won" ? true : false}
									onClick={() =>
										status === "Won"
											? {}
											: !rfq_selected_plan
												? history.push(`/policy-renewal?enquiry_id=${encodeURIComponent(enquiry_id)}`)
												: history.push(`/customize-plan?enquiry_id=${encodeURIComponent(enquiry_id)}`)
									}
									style={
										status !== "Won"
											? { visibility: "visible" }
											: { visibility: "hidden" }
									}
								>
									Buy
								</Button>
								{/* <div className='d-flex justify-content-center align-items-center'> */}
								<i
									className={`ti-angle-${open === Number(id) ? "up" : "down"} text-${open === Number(id) ? "danger" : "success"
										}  ml-4 p-2`}
									style={{
										fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
										fontWeight: 800,
										background: "#f0f8ff",
										borderRadius: "50%",
										cursor: 'pointer'
									}}
									onClick={() => handleOpen(id)}
								/>
								{/* </div> */}
							</Col>
							{open === Number(id) && (
								<Row className="d-flex justify-content-center mx-auto mt-3">
									<div
										style={{
											display: "flex",
											justifyContent: "center",
										}}
									>
										<WidgetWrapper>
											{List(headings, combinations, data, icons, links)}
										</WidgetWrapper>
									</div>
								</Row>
							)}
						</Card>
					)
				)
				// )
			}
			<Deficiency
				show={show}
				onHide={() => {
					setShow(false);
					setData([]);
				}}
				data={data}
			/>
		</>
	);
};

// Styles

const Card = styled(Row)`
	padding: 0px;
	box-shadow: 1px 1px 14px 0px #6e6e6e24;
	border-radius: 10px;
	/* border: 2px solid #caefff; */
	margin: 35px auto;
	background: #fff;
	padding: 20px;
	align-items: center;
	.plan-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		img {
			width: 60px;
			border-radius: 50%;
			padding: 10px;
			background: #8070c4;
		}
		span {
			
			font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
			padding-top: 10px;
			color: #574e7d;
		}
	}
	.plan-detail {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		.text-group {
			margin: 7px 22px 0px 0px;
			p {
				font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
				color: #555555;
				margin-bottom: -0.1rem;
			}
			span {
				
				font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
			}
		}
	}
	@media (max-width: 992px) {
		.buy-button {
			margin-top: 30px;
		}
		.plan-detail {
			margin-top: 20px;
		}
	}
`;
const WidgetWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	@media (max-width: 600px) {
		display: block;
		overflow: auto;
	}
`;

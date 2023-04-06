import React, { Fragment } from 'react';
import { Row, Col, Button as Btn } from 'react-bootstrap';
import _ from 'lodash';
import styled from 'styled-components'

const DivHeader = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
	
`;

const DivValue = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
	white-space: pre-wrap;
	word-wrap: break-word;
`;

export const exclude = [
	"id",
	"quote_id",
	"cover_type",
	"industry_id",
	"subindustry_id",
	"policy_sub_type_id",
	"premium_type_id",
	"sum_insured_type_id",
	"industry_subtype_id",
	"industry_type_id",
	"is_fresh_policy",
	"policy_type_id",
	// 'enquiry_id',
	"city_id",
	"state_id",
	"premium_file",
	"suminusred_file",
	"document",
	'logo'
];

const exceptions = ["premium_file", "suminusred_file", "document"];

export const Lister = (obj) => {
	//getting keys and values
	let keys = !_.isEmpty(obj) ? Object.keys(obj) : [];
	let values = !_.isEmpty(obj) ? Object.values(obj) : [];
	return (
		<div className="d-flex flex-wrap">
			<Row
				xs={1}
				sm={1}
				md={2}
				lg={3}
				xl={3}
				style={{ width: "100%", marginTop: "-10px" }}
				className="d-flex"
			>
				{!_.isEmpty(keys) ? (
					keys.map((item, index) => (
						<Fragment key={'lister' + index}>
							{!!values[`${index}`] &&
								typeof values[`${index}`] !== "object" &&
								!exclude.includes(keys[`${index}`]) && (
									<Col
										sm={12}
										xs={12}
										md={6}
										lg={4}
										xl={4}
										className="py-2 px-0 text-nowrap"
									>
										<>
											<DivHeader>{keys[index].replace(/_/g, " ").toUpperCase()}</DivHeader>
											<DivValue>
												{(!!values[index] && values[index].toString()) || "-"}
											</DivValue>
										</>
									</Col>
								)}
							{!!values[`${index}`] && exceptions.includes(keys[`${index}`]) && (
								<Col
									sm={12}
									xs={12}
									md={6}
									lg={4}
									xl={4}
									className="py-2 px-0 text-nowrap"
								>
									<>
										<DivHeader>{keys[index].replace(/_/g, " ").toUpperCase()}</DivHeader>
										<DivValue>
											{!!values[index] && typeof values[index] === "string" ? (
												<Btn size="sm" onClick={() => window.open(values[index])}>
													{keys[index].replace(/_/g, " ").toUpperCase()}
												</Btn>
											) : keys[index] === 'premium_file' ? (
												<>
													<p className='p-0 m-0'>Tax,Amount,Total Premium</p>
													{!_.isEmpty(values[index]) &&
														values[index].map(({ amount, tax, total_premium }, index) => (
															<btn key={index + 'prem'} disabled className="btn shadow text-left m-1 btn-outline-dark btn-sm rounded-lg" >
																{('Amount : ' + amount + '\n Tax : ' + tax + '\n Total Premium : ' + total_premium) || "-"}
															</btn>
														))}
												</>
											) : (!_.isEmpty(values[index]) && values[index]?.map((value, index) => (
												<btn key={index + 'prem'} disabled className="btn shadow m-1 btn-outline-dark btn-sm rounded-lg" >
													{value || "-"}
												</btn>
											)))}
										</DivValue>
									</>
								</Col>
							)}
						</Fragment>
					))
				) : (
					<p style={{ color: "red" }}>Data not available.</p>
				)}
			</Row>
		</div>
	);
};

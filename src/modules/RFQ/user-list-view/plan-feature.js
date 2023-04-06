/* eslint-disable eqeqeq */
import React, { Fragment } from "react";
import styled from "styled-components";


import { Col, Row, OverlayTrigger, Tooltip, Accordion, Card as BSCard } from "react-bootstrap";
import { OptionInput } from "modules/RFQ/home/style";

import VariantCard from 'modules/RFQ/home/steps/customize-plan/VariantCard';
import _ from "lodash";

import { MaternityDependence, noMultipleAdd } from "modules/RFQ/plan-configuration/helper";
import { FilterProductData } from './helper'
import { ContextAwareToggle } from "../home/steps/customize-plan/CompareCard";

export default function PlanFeature({
	list,
	register,
	parent,
	watch,
	prefill,
	quotes,
	filterData,
	totalPre,
	handleSubmit,
	setUpdate,
	onSubmit,
	featureEdit
}) {

	let listArray = !_.isEmpty(filterData) ? filterData : [];
	let units = { 1: "days", 2: "months", 3: "years" };

	const NameFn = (elem, childIndex, id, product_type, featureEdit) => {
		if (product_type * 1 === 1) {
			return (
				<OptionInput small key={"child-feature1" + childIndex} className="d-flex">
					<Fragment key={"child-feature1" + childIndex}>
						<input
							onClick={() => { setUpdate(prev => !prev) }}
							name={`parent[${id}].child`}
							type={"radio"}
							// type={"hidden"}
							ref={register}
							value={String(elem?.id)}
							// hidden
							defaultChecked={childIndex === 0}
						// defaultValue={String(elem?.id)}
						/>
						{parent[id]?.child == elem.id && (
							<input
								name={`parent[${id}].child_ids`}
								type={"hidden"}
								ref={register}
								value={String(elem?.ids)}
							// hidden
							// defaultChecked
							// defaultValue={String(elem?.id)}
							/>)}
					</Fragment>
					<span style={{ display: !featureEdit && 'none' }}></span>
					<p>{Number(elem.sum_insured_type) === 2 ? `${elem.sum_insured}% of Sum Insured` : `₹ ${elem.sum_insured}`}</p>
				</OptionInput>
			);
		}
		if (product_type * 1 === 2) {
			return (
				<OptionInput small key={"child-feature2" + childIndex} className="d-flex">
					<input
						onClick={() => { setUpdate(prev => !prev) }}
						name={`parent[${id}].child`}
						type={"radio"}
						ref={register}
						value={elem?.id}
						defaultChecked={childIndex === 0}
					// defaultValue={childIndex === 0 && elem?.id}
					/>
					{parent[id]?.child == elem.id && (
						<input
							name={`parent[${id}].child_ids`}
							type={"hidden"}
							ref={register}
							value={String(elem?.ids)}
						// hidden
						// defaultChecked
						// defaultValue={String(elem?.id)}
						/>)}
					<span style={{ display: !featureEdit && 'none' }}></span>
					<p>{`${elem?.duration_value} ${units?.[`${elem?.duration_unit}`]} ${!!elem.duration_type ? elem.duration_type : ''}`}</p>
				</OptionInput>
			);
		}
		if (product_type * 1 === 3) {
			return (
				<OptionInput small key={"child-feature3" + childIndex} className="d-flex">
					<input
						onClick={() => { setUpdate(prev => !prev) }}
						name={`parent[${id}].child`}
						type={"radio"}
						ref={register}
						value={elem?.id}
						defaultChecked={childIndex === 0}
					// defaultValue={childIndex === 0 && elem?.id}
					/>
					{parent[id]?.child == elem.id && <input
						name={`parent[${id}].child_ids`}
						type={"hidden"}
						ref={register}
						value={String(elem?.ids)}
					// hidden
					// defaultChecked
					// defaultValue={String(elem?.id)}
					/>}
					<span style={{ display: !featureEdit && 'none' }}></span>
					<p>{`${elem?.name} ( ${Number(elem.sum_insured_type) === 2 ? `${elem.sum_insured}% of Sum Insured` : `₹ ${elem.sum_insured}`} )`}</p>
				</OptionInput>
			);
		}
		if (product_type * 1 === 5) {
			return (noMultipleAdd.includes(Number(id)) ? <>
				<input
					// onClick={() => { setUpdate(prev => !prev) }}
					name={`parent[${id}].child`}
					// type={"radio"}
					type={"hidden"}
					ref={register}
					value={elem?.id}
				// defaultChecked={childIndex === 0}
				// defaultValue={elem?.id}
				/>
				{parent[id]?.child == elem.id && (
					<input
						name={`parent[${id}].child_ids`}
						type={"hidden"}
						ref={register}
						value={String(elem?.ids)}
					// hidden
					// defaultChecked
					// defaultValue={String(elem?.id)}
					/>)}</> :
				<OptionInput small key={"child-feature5" + childIndex} className="d-flex">
					<Fragment key={"child-feature5" + childIndex}>
						<input
							onClick={() => { setUpdate(prev => !prev) }}
							name={`parent[${id}].child`}
							type={"radio"}
							// type={"hidden"}
							ref={register}
							value={elem?.id}
							defaultChecked={childIndex === 0}
						// defaultValue={elem?.id}
						/>
						{parent[id]?.child == elem.id && (
							<input
								name={`parent[${id}].child_ids`}
								type={"hidden"}
								ref={register}
								value={String(elem?.ids)}
							// hidden
							// defaultChecked
							// defaultValue={String(elem?.id)}
							/>
						)}
					</Fragment>
					<span style={{ display: !featureEdit && 'none' }}></span>
					<p>{Number(elem.sum_insured_type) === 2 ? `${elem.sum_insured}% of Sum Insured` : `₹ ${elem.sum_insured || 0}`}</p>
				</OptionInput>
			);
		}
	};

	const PlanDiv = (type, child, ParentId, product_type) => {
		return (
			<Col xl={9} lg={8} md={12} sm={12} style={{ zIndex: type === "sumInsured" && 9 }}>
				<Slider minHeight={type === "top" && '650px'} top={type === "top"}>
					{listArray.map((item, index) => (
						<Col
							key={"customize" + index}
						>
							<VariantCard
								type={type}
								recomended={index === 1}
								Parent={parent && parent[ParentId]}
								product_type={product_type}
								quote={item}
								child={child}
								i={index}
								totalPre={totalPre[index]}
								handleSubmit={handleSubmit}
								onSubmit={onSubmit}
								register={register}
								prefill={prefill}
							/>
						</Col>
					))}
				</Slider>
			</Col>
		);
	};


	let _filterData = FilterProductData(filterData);

	return (
		<div className="pb-5 customize-plan-card">
			{_filterData.map(
				(
					{
						id,
						product_feature_id,
						product_feature_name: name,
						product_detail: child,
						content,
						product_type,
						is_mandantory,
						plan_ids,
					},
					index
				) => {
					if (MaternityDependence.includes(product_feature_id) && parent?.length && !parent[14]?.id) {
						return null;
					}

					return (
						<Wrapper key={index + 'fetures'}>
							<Row className="flex-nowrap">
								<Col xl={3} lg={4} md={6} sm={8} style={{ minWidth: "360px" }} className={noMultipleAdd.includes(product_feature_id) ? 'mt-1' : 'mt-1'}>
									{child?.length === 1 && is_mandantory ?
										<>
											<OptionInput notAllowed key={"feature" + index} className="d-flex">
												<input
													name={`parent[${product_feature_id}].id`}
													// type={"hidden"}
													type={"checkbox"}
													defaultChecked={true}
													checked={true}
													ref={register}
													value={product_feature_id}
												/>
												<input
													name={`parent[${product_feature_id}].parent_ids`}
													type={"hidden"}
													ref={register}
													value={plan_ids}
												// defaultChecked={true}
												/>
												<span style={{ display: !featureEdit && 'none' }}></span>
												<p>
													{name}
													{!!content && <OverlayTrigger
														key={"home-india"}
														placement={"top"}
														overlay={<Tooltip id={"tooltip-home-india"}>{content}</Tooltip>}
													>
														<svg
															className="icon icon-info"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 35 35"
															fill="#8D9194"
														>
															<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
															<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
															<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
														</svg>
													</OverlayTrigger>}
												</p>
											</OptionInput>
											{child && parent[product_feature_id]?.id && (
												<>
													<input
														// onClick={() => { setUpdate(prev => !prev) }}
														name={`parent[${product_feature_id}].child`}
														// type={"radio"}
														type={"hidden"}
														ref={register}
														value={child[0]?.id}
													// defaultChecked={childIndex === 0}
													// defaultValue={elem?.id}
													/>
													{parent[product_feature_id]?.child == child[0].id && (
														<input
															name={`parent[${product_feature_id}].child_ids`}
															type={"hidden"}
															ref={register}
															value={String(child[0]?.ids)}
														// hidden
														// defaultChecked
														// defaultValue={String(elem?.id)}
														/>)}</>
											)}
										</>
										: <>
											{noMultipleAdd.includes(product_feature_id) ?
												<>
													<OptionInput key={"feature" + index} className="d-flex">
														<input
															onClick={() => { setUpdate(prev => !prev) }}
															name={`parent[${product_feature_id}].id`}
															type={"checkbox"}
															ref={register}
															value={product_feature_id}
															defaultChecked={true}
														/>
														<input
															name={`parent[${product_feature_id}].parent_ids`}
															type={"hidden"}
															ref={register}
															value={plan_ids}
														// defaultChecked={true}
														/>
														<span style={{ display: !featureEdit && 'none' }}></span>
														<p>
															{name}
															{!!content && <OverlayTrigger
																key={"home-india"}
																placement={"top"}
																overlay={<Tooltip id={"tooltip-home-india"}>{content}</Tooltip>}
															>
																<svg
																	className="icon icon-info"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 35 35"
																	fill="#8D9194"
																>
																	<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
																	<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
																	<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
																</svg>
															</OverlayTrigger>}
														</p>
													</OptionInput>

													{child && parent[product_feature_id]?.id && (
														<div className="ml-4">
															{child.map((elem, i) =>
																NameFn(elem, i, product_feature_id, product_type, featureEdit)
															)}
														</div>
													)}
												</>
												:
												<Accordion defaultActiveKey={1}>
													<BSCard>
														<Accordion.Toggle as={BSCard.Header} eventKey={index + 1}>
															<OptionInput single key={"feature" + index} className="d-flex mt-6px">
																<input
																	onClick={() => { setUpdate(prev => !prev) }}
																	name={`parent[${product_feature_id}].id`}
																	type={"checkbox"}
																	ref={register}
																	value={product_feature_id}
																	defaultChecked={true}
																/>
																<input
																	name={`parent[${product_feature_id}].parent_ids`}
																	type={"hidden"}
																	ref={register}
																	value={plan_ids}
																// defaultChecked={true}
																/>
																<span style={{ display: !featureEdit && 'none' }}></span>
																<p>
																	{name}
																	{!!content && <OverlayTrigger
																		key={"home-india"}
																		placement={"top"}
																		overlay={<Tooltip id={"tooltip-home-india"}>{content}</Tooltip>}
																	>
																		<svg
																			className="icon icon-info"
																			xmlns="http://www.w3.org/2000/svg"
																			viewBox="0 0 35 35"
																			fill="#8D9194"
																		>
																			<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
																			<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
																			<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
																		</svg>
																	</OverlayTrigger>}
																</p>
															</OptionInput>
															<ContextAwareToggle eventKey={index + 1} />
														</Accordion.Toggle>
														<Accordion.Collapse eventKey={index + 1}>
															<BSCard.Body>

																{child && parent[product_feature_id]?.id && (
																	<div className="ml-4">
																		{child.map((elem, i) =>
																			NameFn(elem, i, product_feature_id, product_type, featureEdit)
																		)}
																	</div>
																)}
															</BSCard.Body>
														</Accordion.Collapse>
													</BSCard>
												</Accordion>}
										</>}
								</Col>
								{PlanDiv(
									"list",
									parent[product_feature_id]?.id && child,
									product_feature_id,
									product_type
								)}
							</Row>
						</Wrapper>
					);
				}
			)}
		</div>
	);
}

const Slider = styled(Row)`
	height: 100%;
	${({ minHeight }) => `min-height: ${minHeight};`}
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	.prev-btn {
		position: absolute;
		left: -11px;
		font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
	}
	.next-btn {
		position: absolute;
		left: 986px;
		font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
		img {
			transform: scaleX(-1);
		}
	}
	.ui-card {
		/* height: 20rem; */
		/* width: 12rem; */
		position: absolute;
		left: 380px;
		min-width: 340px;
		max-width: fit-content;
		/* z-index: 1; */
		opacity: 0;
		transform: scale(0.5) translateY(50%) translateX(50%);
		/* transition: opacity 0.2s ease-in-out; */
		/* cursor: pointer; */
		pointer-events: none;
		/* background: #2e5266; */
		/* background: linear-gradient(to top, #2e5266, #6e8898); */
		transition: 0.5s;
	}

	.ui-card.active {
		position: absolute;
		left: 330px;
		/* z-index: 3; */
		transform: scale(1) translateY(0) translateX(0);
		opacity: 1;
		pointer-events: auto;
		transition: 1s;
	}
	.ui-card.prev,
	.ui-card.next {
		position: absolute;
		/* z-index: 2; */
		transform: scale(1) translateY(0) translateX(0);
		opacity: 1;
		pointer-events: auto;
		transition: 1s;
	}
	.ui-card.prev {
		left: 640px;
	}
	.ui-card.next {
		left: 20px;
	}
`;

export const BackBtn = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	outline: none;
	border: none;
	background: none;
`;

export const BackIcon = styled.i`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(35px + ${fontSize - 92}%)` : '35px'};
	color: #585858b3;
	line-height: 25px;
`;

const Wrapper = styled.div`
.card {
  border: none;
  border-radius: 15px;
  /* padding: 15px 0; */
  text-align: start;
  .card-header{
    background-color: rgba(255, 255, 255, 0);
    cursor: pointer;
    border-bottom: 0;
		padding: 15px 0;
    span{
      
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    }
		.mt-6px{
			margin-top: -6px;
		}
  }
  .card-body {
    padding: 0;
    .list{
      padding: 13px 0 13px 20px;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.0rem + ${fontSize - 92}%)` : '1.0rem'};
      
      margin: 6px 0;
    }
    .list:hover{
      background: #F3F7FB;
    }
  }
}`

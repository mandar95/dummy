/* eslint-disable eqeqeq */
import React, { Fragment, useState, useContext, useEffect } from "react";
import styled from "styled-components";

import { Button } from "components";
import { Col, Row, OverlayTrigger, Tooltip, Accordion, Card as BSCard } from "react-bootstrap";
import { OptionInput } from "../../style";
import { Title } from "../../../select-plan/style";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";
import { StyledButton } from "../../../data-upload/style";

// import CallBack from "./CallBack";
import VariantCard from "./VariantCard";
import { CarouselCard } from "./carousel-card/carousel-card";
import _ from "lodash";
import { Loader } from "../../../../../components";
import { useSelector } from "react-redux";

const units = { 1: "Days", 2: "Months", 3: "Years" };

export const ContextAwareToggle = ({ eventKey, callback }) => {
	const currentEventKey = useContext(AccordionContext);
	const decoratedOnClick = useAccordionToggle(
		eventKey,
		() => callback && callback(eventKey)
	);
	const isCurrentEventKey = currentEventKey === eventKey;
	return (
		<StyledButton
			color='#60c385;'
			variant="link"
			className="open-button"
			onClick={decoratedOnClick}
			relative={'relative'}
			style={{ marginTop: '22px' }}
		>
			{isCurrentEventKey ? (
				<i className="arrow up" ></i>
			) : (
				<i className="arrow down"></i>
			)}
		</StyledButton>
	);
};

export default function CompareCard({
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
	setGateForCarePreSalesFeatures,
	setGateForCarePreSalesFeatureAccordion
}) {
	// const checkbox = quotes?.filter(data => Boolean(data?.plan_product_features?.length))?.map(data => data?.plan_product_features?.map(data => data?.id));
	let listArray = !_.isEmpty(quotes) ? quotes : [];
	const [selected, setSelected] = useState(1);
	const [height, setHeight] = useState(0)
	const { globalTheme } = useSelector(state => state.theme)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		let maxValue = 0;
		const shouldUpdate = listArray.every((_, childIndex) => document.getElementById('divId' + childIndex)?.clientHeight)
		// const maxDescription = Math.max(...listArray.map(o => o.plan_description.length))
		setTimeout(() => {
			if (shouldUpdate) {

				listArray.forEach((_, index) => {
					const divHeight = document.getElementById('divId' + index)?.clientHeight;
					// if (maxDescription === _.plan_description.length) {
					if (divHeight > maxValue)
						maxValue = divHeight
					// }
				})
				setHeight(maxValue)
			}
		}, 1000)
	})
	// const [flag, setFlag] = useState(0)
	// const [render, setRender] = useState(0)
	// const Parent = watch("parent") || [];

	// useEffect(() => {
	// 	if (flag < 20 && Parent) {
	// 		setFlag(prev => prev + 1)
	// 	}

	// }, [flag, Parent])

	// useEffect(() => {

	// 	if (Parent.length) {
	// 		setRender(prev => prev + 1)
	// 	}

	// }, [Parent])


	const NameFn = (elem, childIndex, id, product_type, include_multiple_si) => {
		if (product_type * 1 === 1) {
			return (
				<OptionInput small key={"child-feature1" + childIndex} className="d-flex">
					<Fragment key={"child-feature1" + childIndex}>
						<input
							onClick={() => {
								setUpdate(prev => !prev);
								if (Boolean(elem?.type_of_plan === "partialOnline")) {
									setGateForCarePreSalesFeatures(gate => true);
								}
							}}
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
					<span></span>
					<p>{Number(elem.sum_insured_type) === 2 ? `${elem.sum_insured || 0}% of Sum Insured` : `₹ ${elem.sum_insured || 0}`}</p>
				</OptionInput>
			);
		}
		if (product_type * 1 === 2) {
			return (
				<OptionInput small key={"child-feature2" + childIndex} className="d-flex">
					<input
						onClick={() => {
							setUpdate(prev => !prev);
							if (Boolean(elem?.type_of_plan === "partialOnline")) {
								setGateForCarePreSalesFeatures(gate => true);
							}
						}}
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
					<span></span>
					<p>{`${elem?.duration_value || 0} ${units?.[`${elem?.duration_unit}`]} ${!!elem.duration_type ? elem.duration_type : ''}`}</p>
				</OptionInput>
			);
		}
		if (product_type * 1 === 3) {
			return (
				<OptionInput small key={"child-feature3" + childIndex} className="d-flex">
					<input
						onClick={() => {
							setUpdate(prev => !prev);
							if (Boolean(elem?.type_of_plan === "partialOnline")) {
								setGateForCarePreSalesFeatures(gate => true);
							}
						}}
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
					<span></span>
					<p>{`${elem?.name || '-'}` + (elem.sum_insured ? ` ( ${Number(elem.sum_insured_type) === 2 ? `${elem.sum_insured || 0}% of Sum Insured` : `₹ ${elem.sum_insured || 0}`} )` : '')}</p>
				</OptionInput>
			);
		}
		if (product_type * 1 === 5) {
			return (include_multiple_si === 0 ? <>
				<input
					// onClick={() => { setUpdate(prev => !prev) }}

					onClick={() => {
						if (Boolean(elem?.type_of_plan === "partialOnline")) {
							setGateForCarePreSalesFeatures(gate => true);
						}
					}}
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
							onClick={() => {
								setUpdate(prev => !prev);
								if (Boolean(elem?.type_of_plan === "partialOnline")) {
									setGateForCarePreSalesFeatures(gate => true);
								}
							}}
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
					<span></span>
					<p>{Number(elem.sum_insured_type) === 2 ? `${elem.sum_insured || 0}% of Sum Insured` : `₹ ${elem.sum_insured || 0}`}</p>
				</OptionInput>
			);
		}
	};

	const PlanDiv = (type, child, ParentId, product_type) => {
		// const Child = watch(`parent[${ParentId}]`) || [];
		return (
			<Col xl={9} lg={8} md={12} sm={12} style={{ zIndex: type === "sumInsured" && 9 }}>
				<Slider minHeight={(type === "top" ? (height + 'px') : 0)/* ||'inherit' */} top={type === "top"}>
					{type === "top" && selected !== 1 && (
						<BackBtn
							className="prev-btn"
							onClick={() => setSelected((prev) => prev - 1)}
						>
							<img
								src="/assets/images/icon/Group-7347.png"
								alt="bck"
								height="45"
								width="45"
							/>
						</BackBtn>
					)}
					{listArray.map((item, index) => (
						<Col
							key={"customize" + index}
							{...type === "top" && { id: 'divId' + index }}
							style={{ height: type === "top" ? ((height /* && false */) ? height : 'max-content') : '100%' }}
							// style={{ zIndex: index === 1 ? "2" : "1" }}
							// style={{ zIndex: (listArray.length - (index + 1)) }}
							className={`ui-card ${(type === "list") ? "long-text" : ""}  ${selected === index
								? " active"
								: selected === index - 1
									? "prev"
									: selected === index + 1
										? "next"
										: ""
								}`}
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
					{type === "top" && quotes.length > 3 &&
						selected !== listArray.length - 2 &&
						(
							<BackBtn
								className="next-btn"
								onClick={() => setSelected((prev) => prev + 1)}
							>
								<img
									src="/assets/images/icon/Group-7347.png"
									alt="bck"
									height="45"
									width="45"
								/>
							</BackBtn>
						)}
				</Slider>
			</Col>
		);
	};

	// const ParentCheck = ({ index, product_feature_id, plan_ids, name, content }) => {
	// 	return (
	// 		<OptionInput key={"feature" + index} className="d-flex">
	// 			<input
	// 				onClick={() => { setUpdate(prev => !prev) }}
	// 				name={`parent[${product_feature_id}].id`}
	// 				type={"checkbox"}
	// 				ref={register}
	// 				value={product_feature_id}
	// 				defaultChecked={true}
	// 			/>
	// 			<input
	// 				name={`parent[${product_feature_id}].parent_ids`}
	// 				type={"hidden"}
	// 				ref={register}
	// 				value={plan_ids}
	// 			// defaultChecked={true}
	// 			/>
	// 			<span></span>
	// 			<p>
	// 				{name || ''}
	// 				{!!content && <OverlayTrigger
	// 					key={"home-india"}
	// 					placement={"top"}
	// 					overlay={<Tooltip id={"tooltip-home-india"}>{content}</Tooltip>}
	// 				>
	// 					<svg
	// 						className="icon icon-info"
	// 						xmlns="http://www.w3.org/2000/svg"
	// 						viewBox="0 0 35 35"
	// 						fill="#8D9194"
	// 					>
	// 						<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
	// 						<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
	// 						<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
	// 					</svg>
	// 				</OverlayTrigger>}
	// 			</p>
	// 		</OptionInput>
	// 	)
	// }

	return (
		<div className="pb-5 customize-plan-card">
			<Row className="flex-nowrap" style={{
				position: 'sticky',
				top: '0px',
				zIndex: '99',
			}}>
				<Col xl={3} lg={4} md={6} sm={8} style={{
					minWidth: "360px", background: 'white', marginBottom: '30px',
				}}>
					<CarouselCard />
					{/* <CallBack prefill={prefill} /> */}
				</Col>
				{PlanDiv("top")}
			</Row>
			<Row className="flex-nowrap">
				<Col
					xl={3}
					lg={4}
					md={6}
					sm={8}
					style={{ minWidth: "360px", padding: "0" }}
					className="d-flex justify-content-center align-items-center"
				>
					{!!quotes.length && <Button
						buttonStyle="outline-solid"
						disabled
						style={{ position: 'absolute', top: '-30px' }}
						shadow="none"
						className="py-2"
						hex1="#f7f4ff"
						hex2="#f7f4ff"
					>
						<span
							className="text-center"
							style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', color: "#114a7d" }}
						>
							{(quotes[0].policy_sub_type)}
							{/* {quote?.name || "N/A"} */}
						</span>
					</Button>}
					<br />
					<Title fontSize="1.1rem" color="#114a7d">
						Sum-Insured
					</Title>
				</Col>
				{PlanDiv("sumInsured")}
			</Row>
			{filterData.map(
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
						include_multiple_si,
						// is_maternity,
						maternity_dependant,
					},
					index
				) => {
					if (maternity_dependant && parent?.length && !parent[filterData.find(({ is_maternity }) => is_maternity)?.product_feature_id]?.id) {
						return null;
					}
					return (
						<Wrapper key={index + 'fetures'}>
							<Row className="flex-nowrap">
								<Col xl={3} lg={4} md={6} sm={8} style={{ minWidth: "360px" }} className={index === 0 ? '' : 'mt-1'}>
									{(child?.length === 1 && is_mandantory) ?
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
												<span></span>
												<p>
													{name || ''}
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
												// <div className="ml-4">
												// 	{child.map((elem, i) =>
												// 		NameFn(elem, i, product_feature_id, product_type, true)
												// 	)}
												// </div>
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
											{(include_multiple_si === 0 && product_type === 5) ?
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
														<span></span>
														<p>
															{name || ''}
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
																NameFn(elem, i, product_feature_id, product_type, include_multiple_si)
															)}
														</div>
													)}
												</>
												:
												<Accordion /* defaultActiveKey={1} */>
													<BSCard>
														<Accordion.Toggle as={BSCard.Header} eventKey={index + 1}>
															<OptionInput single key={"feature" + index} className="d-flex mt-6px">
																<input
																	onClick={() => {
																		setUpdate(prev => !prev);
																		if (Boolean(child[0]?.type_of_plan === "partialOnline")) {
																			setGateForCarePreSalesFeatureAccordion(gate2 => true)
																		}
																	}
																	}
																	name={`parent[${product_feature_id}].id`}
																	type={"checkbox"}
																	ref={register}
																	value={product_feature_id}
																	defaultChecked={true}
																	disabled={Boolean(child[0]?.type_of_plan === "partialOnline")}
																/>
																<input
																	name={`parent[${product_feature_id}].parent_ids`}
																	type={"hidden"}
																	ref={register}
																	value={plan_ids}
																// defaultChecked={true}
																/>
																<span></span>
																<p>
																	{name || ''}
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
																			NameFn(elem, i, product_feature_id, product_type, include_multiple_si)
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
			{!height && <Loader />}
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
	.long-text li{
		overflow: hidden;
  	height: max-content !important;
  	text-overflow: ellipsis;
  	display: -webkit-box;
  	-webkit-line-clamp: 1;
  	-webkit-box-orient: vertical;
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
		position: absolute ;
		left: 330px;
		/* z-index: 3; */
		transform: scale(1) translateY(0) translateX(0);
		opacity: 1;
		pointer-events: auto;
		transition: 1s;
	}
	.ui-card.prev,
	.ui-card.next  {
		position:  absolute;
		/* z-index: 2; */
		transform: scale(1) translateY(0) translateX(0);
		opacity: 1;
		pointer-events: auto;
		transition: 1s;
	}
	.ui-card.prev {
		left: 640px ;
	}
	.ui-card.next {
		left: 20px ;
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

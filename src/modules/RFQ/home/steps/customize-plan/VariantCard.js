import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Button } from "components";
// import _ from "lodash";

import { useLocation } from "react-router";
import { useDispatch, useSelector } from 'react-redux';

import TeamDetailsEditModal from './team-details-modal/Modal';
import PopOver from './popover/popover';

import { loadCompanyData } from 'modules/RFQ/home/home.slice';

import "./input.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { NumberInd } from "utils";

let units = { 1: "Days", 2: "Months", 3: "Years" };

export default function VariantCard({
	recomended,
	type,
	quote,
	child,
	// prelistdata,
	i,
	Parent,
	active,
	totalPre,
	handleSubmit,
	onSubmit,
	register,
	product_type,
	prefill
	// listLength
}) {
	const dispatch = useDispatch();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const enquiryId = decodeURIComponent(query.get("enquiry_id"));
	const { globalTheme } = useSelector(state => state.theme)

	// const [quoteId, setQuoteId] = useState(null);
	const [popoverShow, setShow] = useState(false);
	const [target, setTarget] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [, setIsSaveData] = useState(false);
	const ref = useRef(null);

	const handleHover = (event) => {
		setShow(!popoverShow);
		setTarget(event.target);
	};

	const openModal = () => {
		setShowModal(true);
	}
	const setEnquiryData = () => {
		dispatch(loadCompanyData({
			enquiry_id: enquiryId
		}));
	}


	const ListFn = (child) => {
		let d = 0;
		let childFilter = (child || []).find(({ premiums, id: ChildId }, index) => {
			if ((premiums[i] || Number(premiums[i]) === 0) && Number(Parent?.child) === Number(ChildId)
			) {
				d = Number(premiums[i]);
				return true;
			}
			return false
		});
		if (!childFilter && child) {
			childFilter = (child || []).find(({ premiums, id: ChildId }, index) => {
				if ((premiums[i] || Number(premiums[i]) === 0)) {
					d = Number(premiums[i]);
					return true;
				}
				return false
			});
		}
		if (true || (Number(product_type) === 2 && childFilter?.duration_type?.length > 20) || (Number(product_type) === 3 && childFilter?.name?.length > 20)) {
			return <>
				<OverlayTrigger
					key={"home-india"}
					placement={"top"}
					overlay={<Tooltip id={"tooltip-home-india"}>
						{(childFilter) ? ((child || []).length && /* noMultipleAdd.includes(Number(Parent?.id)) ? 'Covered' : */ <>
							{Number(product_type) === 1 && (childFilter.sum_insured ? (Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured}`) : 'Covered')}
							{Number(product_type) === 2 && ((`${childFilter?.duration_value || 0} ${units?.[`${childFilter?.duration_unit}`]} ${!!childFilter.duration_type ? childFilter.duration_type : ''}`) || 'Covered')}
							{Number(product_type) === 3 && ((`${childFilter?.name || ''} ${childFilter.sum_insured ? `( ${Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured}`} )` : ''}`))}
							{Number(product_type) === 5 && (childFilter.sum_insured ? (Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured || 0}`) : 'Covered')}
						</>)
							: "Not Covered"}
					</Tooltip>}
				>
					<LI className='li-long-text'>
						{(childFilter) ? ((child || []).length && /* noMultipleAdd.includes(Number(Parent?.id)) ? 'Covered' : */ <>
							{Number(product_type) === 1 && (childFilter.sum_insured ? (Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured}`) : 'Covered')}
							{Number(product_type) === 2 && ((`${childFilter?.duration_value || 0} ${units?.[`${childFilter?.duration_unit}`]} ${!!childFilter.duration_type ? childFilter.duration_type : ''}`) || 'Covered')}
							{Number(product_type) === 3 && ((`${childFilter?.name || ''} ${childFilter.sum_insured ? `( ${Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured}`} )` : ''}`))}
							{Number(product_type) === 5 && (childFilter.sum_insured ? (Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured || 0}`) : 'Covered')}
						</>)
							: "Not Covered"}</LI>
				</OverlayTrigger>
				<p className={'sr-only'}>Premium {d}. {totalPre}</p>
			</>;
		}

		// return <><LI>{(childFilter) ? ((child || []).length && /* noMultipleAdd.includes(Number(Parent?.id)) ? 'Covered' : */ <>

		// 	{Number(product_type) === 1 && (childFilter.sum_insured ? (Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured}`) : 'Covered')}

		// 	{Number(product_type) === 2 && ((`${childFilter?.duration_value || 0} ${units?.[`${childFilter?.duration_unit}`]} ${!!childFilter.duration_type ? childFilter.duration_type : ''}`) || 'Covered')}

		// 	{Number(product_type) === 3 && ((`${childFilter?.name || ''} ${childFilter.sum_insured ? `( ${Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured}`} )` : ''}`))}

		// 	{Number(product_type) === 5 && (childFilter.sum_insured ? (Number(childFilter.sum_insured_type) === 2 ? `${childFilter.sum_insured}% of Sum Insured` : `₹ ${childFilter.sum_insured || 0}`) : 'Covered')}
		// </>)
		// 	: "Not Covered"}</LI>
		// 	<p className={'sr-only'}>Premium {d}. {totalPre}</p></>;
	};

	const TopCard = (
		<>
			{/*Content body*/}
			{/* <div className='d-flex flex-column justify-content-between'> */}
			<div>
				<LogoDiv>
					<img alt="logo" src={quote?.logo} height="auto" width="40%" />
				</LogoDiv>
				{/*Titles*/}
				<div className="text-center" style={{ margin: "15px 0px 0" }}>
					<h4 style={{ fontSize: globalTheme.fontSize ? `calc(1.3rem + ${globalTheme.fontSize - 92}%)` : '1.3rem', fontWeight: "600" }}>{quote?.insurer_name || "N/A"}</h4>
				</div>
				{/* <div className="text-center" style={{ margin: "15px 0px" }}>
					<Button
						buttonStyle="outline-solid"
						disabled
						shadow="none"
						className="py-2"
						hex1="#DCDCDC"
						hex2="#DCDCDC"
					>
						<span
							className="text-center"
							style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', color: "black" }}
						>
							{quote?.policy_sub_type || "N/A"}
						</span>
					</Button>
				</div> */}
				<div className="text-center" style={{ margin: "8px 0px 15px" }}>
					<h4 style={{ fontSize: globalTheme.fontSize ? `calc(1.3rem + ${globalTheme.fontSize - 92}%)` : '1.3rem', fontWeight: "600" }}>{quote?.name || "N/A"}
						<OverlayTrigger
							key={"home-india"}
							placement={"bottom"}
							overlay={<Tooltip id={"tooltip-home-india"}>
								{quote?.plan_description || "N/A"}
							</Tooltip>}
						>
							<svg
								className="icon icon-info"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 35 35"
								fill="#8D9194"
								style={{
									display: 'inline-block',
									width: '1em',
									height: '1em',
									strokeWidth: '0',
									stroke: 'currentColor',
									fill: 'currentColor',
									marginLeft: '0.4rem',
								}}
							>
								<path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
								<path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
								<path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
							</svg>
						</OverlayTrigger>
					</h4>
				</div>
				{/*Description*/}
				{/* <div
					className="text-center font-weight-light"
					style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', wordBreak: 'break-word' }}
				>
					<p>{quote?.plan_description || "N/A"}</p>
				</div> */}

				{/* <Badge recomended={recomended}>
					<img
						alt="badge"
						src="/assets/images/recomended.png"
						width="40"
						height="40"
					/>
				</Badge> */}
			</div>
			{/*Button*/}
			<div>
				<div className="w-100 d-flex justify-content-center mt-2">
					<Button
						buttonStyle="outline-solid"
						className="w-100 py-3"
						borderRadius="12px"
						hex1="#1bf29e"
						hex2="#1bf29e"
						shadow="none"
						type={"button"}
						onClick={() => onSubmit(quote?.id)}
					>
						<span style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', letterSpacing: "2px" }}>
							{`₹ ${NumberInd(Number(quote?.total_premium) + Number(totalPre))}`}
						</span>
					</Button>
				</div>
				{/*T&C*/}
				<div className="text-center mt-2 mb-2">
					<p className="text-secondary mb-0">(GST Included)</p>
				</div>
			</div>
			{/* </div> */}
		</>
	);

	// {/*plan-card*/ }
	return (
		<>
			<StyledDiv top={type === "top"} recomended={recomended}>
				{type === "top" && <>{TopCard}</>}
				{type === "sumInsured" && (
					<div className="d-flex justify-content-center align-items-center variant-page"
						onClick={openModal}
					>
						<div
							style={{
								fontWeight: '500',
								fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px',
								cursor: 'pointer'
							}}
							onMouseOver={handleHover}
							onMouseOut={handleHover}
						>
							{/* /- per ${prefill?.suminsured_type_id === 1 ? 'life' : "family"}  */}
							{`₹ ${NumberInd(prefill?.member_details?.reduce((n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)), 0))} `}
							&nbsp;&nbsp;<i className="fa fa-info-circle"></i>
						</div>
						<PopOver showpopover={popoverShow} target={target} reference={ref} tooltipdata={prefill?.member_details} />
					</div>
				)}
				{type === "list" && (
					<div
						className="text-center"
					// style={{ marginTop: '25px', marginBottom: '25px' }}
					>
						<ul
							className="m-0 p-0"
							style={{
								fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', fontWeight: "600", listStyleType: "none",
								alignItems: 'center', display: 'flex', justifyContent: 'center'
							}}
						>
							{ListFn(child)}
						</ul>
					</div>
				)}
			</StyledDiv>
			{!!showModal &&
				<TeamDetailsEditModal
					show={showModal}
					onHide={() => setShowModal(false)}
					// company_data={prefill}
					onSaveTrue={() => setIsSaveData(true)}
					onSaveFalse={() => setEnquiryData()}
					enquiry_id={enquiryId}
				/>
			}
		</>
	);
	// </Col>
	// </Row >
}

const StyledDiv = styled.div`
	display: flex;
  flex-direction: column;
  justify-content: ${({ top }) => top ? 'space-between' : 'center'};
	max-width: 315px;
	width: 315px;
	background: ${({ recomended, top }) =>
		recomended
			? !top
				? "#FFFFFF"
				: "linear-gradient(to bottom,#d3f1fb,#FFFFFF 29%)"
			: "#f8f8ff"};
	border-radius: 2px;
	height: 100%;
	padding: 10px 20px;
	/* box-shadow: ${({ recomended }) =>
		recomended ? "0px 10px 20px 9px rgb(228 228 228)" : "none"}; */
	/* ${({ recomended, top }) =>
		!top &&
		`
	&:after {
    background-color: ${recomended ? "#FFFFFF" : "#f8f8ff"};
  	width: 315px;
  	height: 20px;
  	content: "";
  	position: absolute;
  	top: -20px;
  	left: 15px;
	}
	`} */
`;

const LogoDiv = styled.div`
	margin: 5px 0px;
	width: 100%;
	display: flex;
	justify-content: center;
`;

const LI = styled.li`
	letter-spacing: 1.2px;
	margin-top: 10px;
`;

// const Badge = styled.div`
// 	visibility: ${({ recomended }) => (recomended ? "" : "hidden")};
// 	position: absolute;
// 	top: -5px;
// 	right: 25px;
// `;

// SumInsuredType(company_data, company_data.family_construct?.length)
// const SumInsuredType = (companyData = {}, relationLength) => {
// 	if (Number(companyData.suminsured_type_id) === 1 && Number(relationLength) === 1) {
// 			return 'per employees'
// 	}
// 	else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 1) {
// 			return 'Total number of live'
// 	}
// 	else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 2) {
// 			return 'Total number of employees'
// 	}

// 	return 'Total number of employees'
// }

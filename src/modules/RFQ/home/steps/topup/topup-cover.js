import React, { useEffect } from "react";
import { RFQButton, ToggleCard, Loader } from "components";
import { Form, Row, Col } from "react-bootstrap";
import styled from "styled-components";
// import AdditionalCover from "./additional-topup";

import { BackBtn } from "../button";
import _ from "lodash";
import swal from "sweetalert";
import * as yup from "yup";

import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import {
	clear,
	set_company_data,
	saveCompanyData,
	getTopUP,
	setTopUpLoading,
	// setTopUpLoading,
} from "../../home.slice";
import { doesHasIdParam } from "../../home";

export const TopupCover = ({ utm_source }) => {
	// const [show, setShow] = useState(false);
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const id = decodeURIComponent(query.get("enquiry_id"));
	const brokerId = query.get("broker_id");
	const insurerId = query.get("insurer_id");
	const { globalTheme } = useSelector(state => state.theme)

	// const [basicCover, setBasicCover] = useState([]);
	// const [topUpCover, setTopUpCover] = useState([]);

	const {
		success,
		loading,
		topupLoading,
		company_data,
		enquiry_id,
		TopUP_Data,
	} = useSelector((state) => state.RFQHome);
	const validationSchema = yup.object().shape({
		policy_sub_type_id: yup.string().required(),
	});

	const { handleSubmit, register, setValue, watch, errors } = useForm({
		validationSchema,
		defaultValues: {
			policy_sub_type_id: parseInt(company_data?.policy_sub_type_id)
		},
	});

	useEffect(() => {
		if (errors.policy_sub_type_id) {
			swal("Please select health benefit", "", "warning");
		}
	}, [errors]);

	useEffect(() => {
		if (company_data?.policy_sub_type_id) {
			setValue("policy_sub_type_id", company_data?.policy_sub_type_id);
		}
		else {
			setValue("policy_sub_type_id", TopUP_Data[0]?.policy_sub_type_id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data, TopUP_Data]);

	useEffect(() => {
		if (company_data?.industry_type) {
			dispatch(
				getTopUP({
					industry_id: company_data?.industry_type,
					enquiry_id: enquiry_id || id,
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data]);

	// useEffect(() => {
	// 	if (!_.isEmpty(TopUP_Data)) {
	// 		let basic_cover = TopUP_Data.filter((e) => [1, 2, 3].includes(e.policy_sub_type_id));
	// 		let topup_cover = TopUP_Data.filter((e) => [4, 5, 6].includes(e.policy_sub_type_id));

	// 		setBasicCover(basic_cover);
	// 		setTopUpCover(topup_cover);
	// 	}
	// }, [TopUP_Data])

	useEffect(() => {
		if (_.isEmpty(TopUP_Data) && !topupLoading) {
			swal("No benefit found", "", "warning").then(() => {
				history.replace(`/company-details`);
				dispatch(setTopUpLoading());
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [TopUP_Data]);

	// redirect if !id
	useEffect(() => {
		if (!id) {
			history.replace(`/company-details`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// redirect
	useEffect(() => {
		if (success && (enquiry_id || id)) {
			history.push(`/customize-plan?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
		}
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, enquiry_id]);

	const onSubmit = (data) => {
		// let policy_id = TopUP_Data.filter((e) => parseInt(e.id) === parseInt(data.policy_sub_type_id));
		// dispatch(saveCompanyData({
		// 	policy_sub_type_id: policy_id[0].policy_sub_type_id,
		// 	step: 7,
		// 	enquiry_id: id
		// }));
		// dispatch(set_company_data({
		// 	policy_sub_type_id: policy_id[0].policy_sub_type_id
		// }));

		dispatch(
			saveCompanyData({
				...data,
				step: 7,
				enquiry_id: id,
			})
		);
		dispatch(
			set_company_data({
				...data,
				polic_sub_type_name: TopUP_Data?.filter(
					({ policy_sub_type_id }) =>
						Number(policy_sub_type_id) === Number(data?.policy_sub_type_id)
				)[0]?.policy_sub_type_name,
			})
		);

	};


	// const getCovers = (data) => {
	// 	alert(JSON.stringify(data));
	// }

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className="justify-content-center">
					<Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
						<BackBtn
							url={`/about-team?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`}
							style={{ outline: "none", border: "none", background: "none" }}
						>
							<img
								src="/assets/images/icon/Group-7347.png"
								alt="bck"
								height="45"
								width="45"
							/>
						</BackBtn>
						<h1 style={{ fontWeight: "600", marginLeft: "10px", fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>
							Would you like to offer other health benefits to your team?
						</h1>
					</Col>
					<Col style={{ maxWidth: "1080px" }} sm="12" md="12" lg="12" xl="12">
						<ToggleCard
							// data={[
							// 	{
							// 		imgSrc: "/assets/images/icon/life.png",
							// 		content: "Offer best in class accident insurance upto Rs 10 lakhs",
							// 		title: 'Group Health Insurance',
							// 		price: 5000,
							// 		id: 1,
							// 	},
							// 	{
							// 		imgSrc: "/assets/images/icon/life.png",
							// 		content: "Offer best in class accident insurance upto Rs 10 lakhs",
							// 		title: 'Group Health Insurance',
							// 		price: 5000,
							// 		id: 2,
							// 	},
							// 	{
							// 		imgSrc: "/assets/images/icon/life.png",
							// 		content: "Offer best in class accident insurance upto Rs 10 lakhs",
							// 		title: 'Group Health Insurance',
							// 		price: 5000,
							// 		id: 3,
							// 	},
							// ]}
							data={TopUP_Data.map((item) => ({
								imgSrc: item?.cover_type_logo || "/assets/images/icon/life.png",
								content:
									item?.cover_type_content ||
									"Offer best in class accident insurance upto Rs 10 lakhs",
								title: item?.cover_type_title || "Group Health Insurance",
								// price: item?.price_per_employee,
								id: item?.policy_sub_type_id,
							}))}
							contentStyle={{
								fontSize: globalTheme.fontSize ? `calc(0.91rem + ${globalTheme.fontSize - 92}%)` : '0.91rem',
								fontWeight: "400",
								color: "#5e5e5e",
								margin: "6px 0",
							}}
							titleDivStyle={{
								marginTop: "15px",
							}}
							inputName="policy_sub_type_id"
							inputRef={register}
							setVal={setValue}
							watch={watch}
							width="285px"
							height="auto"
							imageSize="80px"
							imageDivSize="85px"
						></ToggleCard>
						{/* <CheckBoxCard
						// data={basicCover.map((item) => ({
						// 	imgSrc: "/assets/images/icon/life.png",
						// 	content: "Offer best in class accident insurance upto Rs 10 lakhs",
						// 	title: 'Group Health Insurance',
						// 	name: "A",
						// 	price: item?.price_per_employee,
						// 	id: item?.policy_sub_type_id,
						// 	value: item?.policy_sub_type_id,
						// }))}
						data={[
							{
								imgSrc: "/assets/images/icon/life.png",
								content: "Offer best in class accident insurance upto Rs 10 lakhs",
								title: 'Group Health Insurance',
								name: 1,
								price: 5000,
								id: 1,
								value: 1,
							},
							{
								imgSrc: "/assets/images/icon/term.png",
								content: "Offer best in class accident insurance upto Rs 10 lakhs",
								title: "Group Term Life",
								name: 2,
								price: 7000,
								id: 2,
								value: 2,
							},
							{
								imgSrc: "/assets/images/icon/health.png",
								content: "Offer best in class accident insurance upto Rs 10 lakhs",
								title: "Group Personal Accident",
								name: 3,
								price: 9000,
								id: 3,
								value: 3,
							},
						]}
						width="240px"
						height="250px"
						onClick={getCovers}
					></CheckBoxCard> */}
					</Col>
					{/* {!!topUpCover.length && <Col
						sm="12"
						md="12"
						lg="12"
						xl="12"
						className="d-flex justify-content-center"
					>
						<Badge
							pill
							style={{
								backgroundColor: "#DCDCDC",
								marginTop: "30px",
								cursor: "pointer",
							}}
							onClick={() => setShow(true)}
						>
							<p
								className="px-4 py-2"
								style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', marginBottom: "-1px" }}
							>
								<span>Top Up Cover</span><i className="fa fa-angle-right" aria-hidden="true" style={{
									fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px',
									lineHeight: '11px',
									fontWeight: '500',
									marginLeft: '15px',
									color: '#484848'
								}} />
							</p>
						</Badge>
					</Col>} */}
				</Row>
				<Row className="w-100">
					<ColTag sm="12" md="12" lg="12" xl="12" className="d-flex">
						<RFQButton
						// style={{ margin: "5px" }}
						// onClick={() => history.push("/select-plan")}
						>
							Next
							<i className="fa fa-long-arrow-right" aria-hidden="true" />
						</RFQButton>
					</ColTag>
				</Row>
			</Form>
			{/* <AdditionalCover topUpData={topUpCover} show={show} onHide={() => setShow(false)} /> */}
			{(loading || topupLoading || success) && <Loader />}
		</>
	);
};

const ColTag = styled(Col)`
	margin-top: 40px;
	@media screen and (max-width: 990px) {
		margin-left: 20px;
	}
`;

// const ColHeader = styled(Col)`
// 	@media screen and (max-width: 990px) {
// 		justify-content: center;
// 	}
// `;

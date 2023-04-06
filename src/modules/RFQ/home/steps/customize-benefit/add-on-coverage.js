import React, { useEffect } from "react";
import { ToggleCard } from "components";
import { Form, Row, Col } from "react-bootstrap";
// import AdditionalCover from "../topup/additional-topup";

// import _ from 'lodash';
// import swal from "sweetalert";

import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { getTopUP } from '../../home.slice';

const AddOn = () => {
	// const [show, setShow] = useState(false);
	const dispatch = useDispatch();
	const { globalTheme } = useSelector(state => state.theme)
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const id = decodeURIComponent(query.get("enquiry_id"));

	// const [basicCover, setBasicCover] = useState([]);
	// const [topUpCover, setTopUpCover] = useState([]);

	const { company_data, enquiry_id, TopUP_Data } = useSelector(state => state.RFQHome);


	const { handleSubmit, register, setValue, watch } = useForm({
		defaultValues: {
			policy_sub_type_id: parseInt(company_data?.policy_sub_type_id) || ""
		},

	});

	useEffect(() => {
		if (company_data?.policy_sub_type_id) {
			setValue('policy_sub_type_id', company_data?.policy_sub_type_id)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data])

	useEffect(() => {
		if (company_data?.industry_type) {
			dispatch(getTopUP({
				industry_id: company_data?.industry_type,
				// sub_industry_id: 1,
				enquiry_id: enquiry_id || id
			}));
		}
		return () => {
			//dispatch(clear('topup'));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data])

	// useEffect(() => {
	// 	if (!_.isEmpty(TopUP_Data)) {
	// 		let basic_cover = TopUP_Data.filter((e) => [1, 2, 3].includes(e.policy_sub_type_id));
	// 		let topup_cover = TopUP_Data.filter((e) => [4, 5, 6].includes(e.policy_sub_type_id));

	// 		setBasicCover(basic_cover);
	// 		setTopUpCover(topup_cover);
	// 	}
	// }, [TopUP_Data])


	const onSubmit = (data) => {
	}
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<div className="mt-4">
				<Row>
					<Col sm="10" md="12" lg="6" xl="6">
						<h2 style={{ fontWeight: "600" }}>Add on coverage.</h2>
						<p>Provide a comprehensive health benefit plan to your team.</p>
					</Col>
				</Row>
				<Row>
					<Col sm="12" md="12" lg="12" xl="12">
						<ToggleCard
							data={TopUP_Data.map((item) => ({
								imgSrc: item?.cover_type_logo || "/assets/images/icon/life.png",
								content: item?.cover_type_content || "Offer best in class accident insurance upto Rs 10 lakhs",
								title: item?.cover_type_title || 'Group Health Insurance',
								// price: item?.price_per_employee,
								id: item?.policy_sub_type_id,
							}))}
							contentStyle={{
								fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
								fontWeight: "600",
								color: "#858a8a",
								marginTop: "8px",
							}}
							titleDivStyle={{
								marginTop: "15px;"
							}}
							inputName="policy_sub_type_id"
							inputRef={register}
							setVal={setValue}
							watch={watch}
							width="255px"
							height="auto"
							isDisabled={true}
						></ToggleCard>
					</Col>
				</Row>
				{/* {!!topUpCover.length && <Row>
						<Col
							sm="12"
							md="12"
							lg="12"
							xl="12"
							className="d-flex justify-content-center"
						>
							{<Badge
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
							</Badge>}
						</Col>
					</Row>} */}
			</div>
		</Form>
	);
};

export default AddOn;

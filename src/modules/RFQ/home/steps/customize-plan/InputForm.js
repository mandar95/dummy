import React, { useEffect, useState, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { Input, Select } from "../../../components";
import { Error/* , RFQButton */ } from "components";
import _ from "lodash";
import swal from "sweetalert";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import TeamDetailsEditModal from "./team-details-modal/Modal";
import {
	loadCompanyData,
	// Quotes,
	totallives,
} from "modules/RFQ/home/home.slice";

import PopOver from "./popover/popover";
import { doesHasIdParam } from "../../home";
import CallBack from "./CallBack";
import { NumberInd } from "../../../../../utils";

const rel = {
	3: 'Children', 5: 'Parents', 7: 'Parents in law'
}

const filterName = (name, id) => {
	if (![3, 5, 7].includes(id)) {
		return name;
	}
	return rel[id]
}

export default function InputForm({
	register,
	errors,
	prefill,
	setValue,
	enquiry_id,
	Controller,
	control,
	// watch,
	// quotes,
	// getType,
	// selectedType,
	customize
}) {
	const history = useHistory();
	const dispatch = useDispatch();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const enquiryId = decodeURIComponent(query.get("enquiry_id"));
	const utm_source = query.get("utm_source");
	const brokerId = query.get("broker_id");
	const insurerId = query.get("insurer_id");
	const { industry_data } = useSelector((state) => state.RFQHome);
	const [showModal, setShowModal] = useState(false);

	const [isSaveData, setIsSaveData] = useState(false);

	const [popoverShow, setShow] = useState(false);
	const [target, setTarget] = useState(null);
	const ref = useRef(null);

	// const [allEqual, setAllEqual] = useState(true);

	const handleHover = (event) => {
		setShow(!popoverShow);
		setTarget(event.target);
	};

	// const SI = watch("sum_insured");
	// const SI = watch('sum_insured')

	useEffect(() => {
		if (!_.isEmpty(prefill)) {
			// const allEqual = prefill?.member_details.every(
			// 	(item) => item.sum_insured === prefill?.member_details[0].sum_insured
			// );
			// setAllEqual(allEqual);
			setValue("no_of_employees", prefill?.no_of_employees);
			setValue("industry_type", Number(prefill?.industry_type));
			setValue("is_fresh_policy", prefill?.is_fresh_policy ? "Yes" : "No");
			setValue("plan_type", prefill?.polic_sub_type_name);
			setValue(
				"sum_insured",
				NumberInd(prefill?.member_details?.reduce(
					(n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)),
					0
				))
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prefill]);

	const redirectTo = (field, link) => {
		// customize &&
		swal({
			title: "Confirm Action",
			text: `Are you sure you want to edit ${field}?`,
			icon: "warning",
			buttons: {
				cancel: "Cancel",
				catch: {
					text: "Confirm",
					value: "confirm",
				},
			},
			dangerMode: true,
		}).then((caseValue) => {
			switch (caseValue) {
				case "confirm":
					history.push(`${link}?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
					break;
				default:
			}
		});
		// !customize &&
		// swal({
		// 	title: "Confirm Action",
		// 	text: `Are you sure you want to edit? You will be redirect to customize plan`,
		// 	icon: "warning",
		// 	buttons: {
		// 		cancel: "Cancel",
		// 		catch: {
		// 			text: "Confirm",
		// 			value: "confirm",
		// 		},
		// 	},
		// 	dangerMode: true,
		// }).then((caseValue) => {
		// 	switch (caseValue) {
		// 		case "confirm":
		// 			history.push(`/customize-plan?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`);
		// 			break;
		// 		default:
		// 	}
		// });
	};

	// const Changetype = (elem) => {
	// 	// setType(elem);
	// 	getType(elem)
	// };

	const relations = () => {
		if (!_.isEmpty(prefill.relation_type) && !_.isEmpty(industry_data?.relations))
			return prefill.relation_type.filter((id) => ![4, 6, 8].includes(Number(id))).map((item) => {
				return _.compact(
					industry_data?.relations.map((elem) =>
						(item * 1 === elem?.id) ?
							filterName(elem?.name, elem?.id) : null
					)
				);
			});
	};

	const relations_list = _.compact(relations()).join(", ").toString();
	// const DependantLives = (prefill.relation_count || []).map(({ count, id }) => {
	// 	if (id * 1 !== 1) {
	// 		return Number(count);
	// 	} else {
	// 		return 0;
	// 	}
	// });
	const isDemography = Number(prefill.is_demography) === 1 ? true : false
	const TotalLives = isDemography ? String(prefill.family_construct?.reduce((total, { no_of_relations }) => total + no_of_relations, 0)
		|| 0
	) : prefill.no_of_employees

	useEffect(() => {
		if (TotalLives) {
			dispatch(totallives(TotalLives));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [TotalLives]);

	useEffect(() => {
		if (relations_list) {
			setValue("family_construct", relations_list);
		}
		if (TotalLives) {
			setValue("total_lives", TotalLives);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [relations_list, TotalLives]);

	useEffect(() => {
		if (!isSaveData) {
			dispatch(
				loadCompanyData({
					enquiry_id: enquiryId,
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSaveData]);

	const openModal = () => {
		!customize &&
			swal({
				title: "Confirm Action",
				text: `Are you sure you want to edit? You will be redirect to customize plan`,
				icon: "warning",
				buttons: {
					cancel: "Cancel",
					catch: {
						text: "Confirm",
						value: "confirm",
					},
				},
				dangerMode: true,
			}).then((caseValue) => {
				switch (caseValue) {
					case "confirm":
						history.push(`/customize-plan?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
						break;
					default:
				}
			});
		customize &&
			setShowModal(true);
	};

	const setEnquiryData = () => {
		dispatch(
			loadCompanyData({
				enquiry_id: enquiryId,
			})
		);
	};

	return (
		<>
			<Row className="d-flex flex-wrap">
				{isDemography &&
					EmployeeShow(prefill, prefill.family_construct?.length) && <Col
						md={12}
						lg={6}
						xl={3}
						sm={12}
						className="mb-3"
						style={{ zoom: "0.69" }}
					>
						<Input
							style={{ cursor: "pointer" }}
							name="no_of_employees"
							label="Total Employee"
							maxLength="10"
							onInput={(e) => (e.target.value = ("" + e.target.value).toUpperCase())}
							autoComplete="none"
							type="text"
							id="no_of_employees"
							inputRef={register}
							// defaultValue={"600"}
							// error={errors.no_of_employees}
							minHeight="85px"
							readOnly
							onClick={() => redirectTo("number of employees", "/family-count")}
							onEdit={() => redirectTo("number of employees", "/family-count")}
							icon="fa fa-edit"
						/>
						{/* {!!errors.no_of_employees && (
						<Error top="4px">{errors.no_of_employees.message}</Error>
					)} */}
					</Col>}
				<Col
					md={12}
					lg={6}
					xl={3}
					sm={12}
					className="mb-3"
					style={{ zoom: "0.69" }}
				>
					<Input
						style={{ cursor: "pointer" }}
						name="plan_type"
						label="Product Type"
						placeholder="Select Options"
						autoComplete="none"
						id="plan_type"
						inputRef={register}
						required={false}
						defaultValue={prefill?.polic_sub_type_name}
						// error={errors.plan_type}
						minHeight="85px"
						readOnly
						onClick={() => redirectTo("plan type", "/topup")}
						onEdit={() => redirectTo("plan type", "/topup")}
						icon="fa fa-edit"
					/>
					{/* {!!errors.plan_type && (
						<Error className="mt-0">{errors.plan_type.message}</Error>
					)} */}
				</Col>
				{isDemography &&
					<Col
						md={12}
						lg={6}
						xl={3}
						sm={12}
						className="mb-3"
						style={{ zoom: "0.69" }}
					>
						<Input
							style={{ cursor: "pointer" }}
							name="family_construct"
							label="Family Construct"
							autoComplete="none"
							type="text"
							id="family_construct"
							inputRef={register}
							defaultValue={relations_list || ""}
							// error={errors.address}
							minHeight="85px"
							readOnly
							onClick={() => redirectTo("family construct", "/family-construct")}
							onEdit={() => redirectTo("family construct", "/family-construct")}
							icon="fa fa-edit"
						/>
						{!!errors.address && <Error top="4px">{errors.address.message}</Error>}
					</Col>
				}

				<Col
					md={12}
					lg={6}
					xl={3}
					sm={12}
					className="mb-3"
					style={{ zoom: "0.69" }}
				>
					<Controller
						as={
							<Select
								style={{ cursor: 'not-allowed' }}
								name="industry_type"
								label="Industry Type"
								placeholder="Select Industry Type"
								autoComplete="none"
								id="industry_type"
								inputRef={register}
								required={false}
								options={
									industry_data?.industries?.map((item) => ({
										id: item?.id,
										name: item?.name,
										value: item?.id,
									})) || []
								}
								// error={errors.industry_type}
								minHeight="85px"
								disabled
								defaultValue={prefill?.industry_type && Number(prefill?.industry_type)}
							/>
						}
						name={"industry_type"}
						control={control}
					/>
					{/* {!!errors.industry_type && (
						<Error className="mt-0">{errors.industry_type.message}</Error>
					)} */}
				</Col>

				<Col
					md={12}
					lg={6}
					xl={2}
					sm={12}
					className="mb-3"
					style={{ zoom: "0.69" }}
				>
					<Input
						style={{ cursor: "pointer" }}
						name="is_fresh_policy"
						label="Buying Plan First Time"
						placeholder="Select Options"
						autoComplete="none"
						id="is_fresh_policy"
						inputRef={register}
						required={false}
						// error={errors.is_fresh_policy}
						minHeight="85px"
						defaultValue={prefill?.is_fresh_policy ? "Yes" : "No"}
						readOnly
						onClick={() => redirectTo("this field", "/policy-renewal")}
						onEdit={() => redirectTo("this field", "/policy-renewal")}
						icon="fa fa-edit"
					/>
					{/* {!!errors.is_fresh_policy && (
						<Error className="mt-0">{errors.is_fresh_policy.message}</Error>
					)} */}
				</Col>
				<Col
					md={12}
					lg={6}
					xl={2}
					sm={12}
					className="mb-3"
					style={{ zoom: "0.69" }}
				>
					<Input
						style={{ cursor: "pointer" }}
						name="total_lives"
						label="Total Lives"
						maxLength="10"
						onInput={(e) => (e.target.value = ("" + e.target.value).toUpperCase())}
						autoComplete="none"
						type="text"
						id="total_lives"
						inputRef={register}
						defaultValue={TotalLives || 0}
						// error={errors.pan}
						minHeight="85px"
						readOnly
						onClick={() => redirectTo("total lives", isDemography ? "/family-count" : "/upload-data-demography")}
						onEdit={() => redirectTo("total lives", isDemography ? "/family-count" : "/upload-data-demography")}
						icon="fa fa-edit"
					/>
					{/* {!!errors.total_lives && (
						<Error top="4px">{errors.total_lives.message}</Error>
					)} */}
				</Col>
				<Col
					md={12}
					lg={6}
					xl={2}
					sm={12}
					className="mb-3"
					style={{ zoom: "0.69" }}
				>
					{isDemography ?
						<Input
							style={{ cursor: "pointer" }}
							name="sum_insured"
							// label={allEqual ? "Sum Insured" : "Total Sum Insured"}
							label={"Total Sum Insured"}
							placeholder="Sum Insured"
							autoComplete="none"
							readOnly
							id="sum_insured"
							inputRef={register}
							required={false}
							//defaultValue={quotes[0]?.total_cover}
							defaultValue={NumberInd(prefill?.member_details?.reduce(
								(n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)),
								0
							))}
							// error={errors.sum_insured}
							minHeight="85px"
							onClick={openModal}
							onEdit={openModal}
							onMouseOver={handleHover}
							onMouseOut={handleHover}
							icon="fa fa-edit"
						/> :
						<Input
							style={{ cursor: "pointer" }}
							name="sum_insured"
							// label={allEqual ? "Sum Insured" : "Total Sum Insured"}
							label={"Total Sum Insured"}
							placeholder="Sum Insured"
							autoComplete="none"
							readOnly
							id="sum_insured"
							inputRef={register}
							required={false}
							//defaultValue={quotes[0]?.total_cover}
							defaultValue={NumberInd(prefill?.member_details?.reduce(
								(n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)),
								0
							))}
							// error={errors.sum_insured}
							minHeight="85px"
							onMouseOver={handleHover}
							onMouseOut={handleHover}
						// icon="fa fa-edit"
						/>
					}
					{/* {!!errors.sum_insured && (
						<Error top="4px">{errors.sum_insured.message}</Error>
					)} */}
					<PopOver
						showpopover={popoverShow}
						target={target}
						reference={ref}
						tooltipdata={prefill?.member_details}
					/>
				</Col>
				{/* abhi changes */}
				{/* {customize && <><Col md={12} lg={6} xl={3} sm={12} className="mb-3">
					<RFQButton
						// className='mt-4'
						width="100%"
						height="59px"
						variant={selectedType === "insurance" ? "bulgy2" : "bulgy_invert2"}
						onClick={() => Changetype("insurance")}
					>
						Insurance Wise
					</RFQButton>
				</Col>
					<Col md={12} lg={6} xl={3} sm={12} className="mb-3">
						<RFQButton
							// className='mt-4'
							width="100%"
							height="59px"
							variant={selectedType === "variant" ? "bulgy2" : "bulgy_invert2"}
							onClick={() => Changetype("variant")}
						>
							Variant Wise
						</RFQButton>
					</Col></>} */}
				<CallBack prefill={prefill} />

			</Row>
			{!!showModal && (
				<TeamDetailsEditModal
					show={showModal}
					onHide={() => setShowModal(false)}
					// company_data={prefill}
					onSaveTrue={() => setIsSaveData(true)}
					onSaveFalse={() => setEnquiryData()}
					enquiry_id={enquiryId}
				/>
			)}
		</>
	);
}

export const EmployeeShow = (companyData = {}, relationLength) => {
	if (Number(companyData.suminsured_type_id) === 1 && Number(relationLength) === 1) {
		return true
	}
	else if (Number(companyData.suminsured_type_id) === 1 && Number(relationLength) > 1) {
		return false
	}
	else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 1) {
		return false
	}
	else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 2) {
		return true
	}

	return false
}
